import { useCallback } from "react";
import {
  useActiveAccount,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { sendAndConfirmTransaction, Bridge, getContract, prepareContractCall, readContract, prepareTransaction } from "thirdweb";
import * as chains from "thirdweb/chains";
import { client } from "./use-wallet";
import type { Abi } from "viem";

type PrepareTxInput = {
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  amountWei: bigint;
  receiver?: string;
};

const CHAIN_MAP: Record<number, Readonly<{ id: number; rpc: string }>> = Object.entries(chains)
  .filter(([_, chain]) => typeof chain === 'object' && chain !== null && 'id' in chain && 'rpc' in chain)
  .reduce((acc, [_, chain]) => {
    const typedChain = chain as chains.Chain;
    return {  
      ...acc,
      [typedChain.id]: typedChain
    };
  }, {});

const BASE_URL = process.env.NEXT_PUBLIC_LIQUID_SWAP_SERVICE_URL || 'http://localhost:3002'

export function useSwap(jwt?: string) {
  const account = useActiveAccount();
  const switchChain = useSwitchActiveWalletChain();

  const prepareAndSign = useCallback(
    async (input: PrepareTxInput) => {
      if (!jwt) throw new Error("Missing JWT");
      if (!account) throw new Error("No active account");

      const test = await Bridge.Sell.prepare({
        originChainId: input.fromChainId,
        originTokenAddress: input.fromToken as `0x${string}`,
        destinationChainId: input.toChainId,
        destinationTokenAddress: input.toToken as `0x${string}`,
        amount: BigInt(input.amountWei),
        sender: input.receiver as `0x${string}`,
        receiver: input.receiver as `0x${string}`,
        client,
      });

      // const res = await fetch(
      //   `${BASE_URL}/swap/tx`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${jwt}`,
      //     },
      //     body: JSON.stringify({
      //       fromChainId: input.fromChainId,
      //       toChainId: input.toChainId,
      //       fromToken: input.fromToken,
      //       toToken: input.toToken,
      //       amount: input.amountWei,
      //       receiver: input.receiver,
      //     }),
      //   }
      // );

      // if (!res.ok) {
      //   const err = await res.json().catch(() => ({}));
      //   throw new Error(err?.message || "Failed to prepare swap");
      // }

      // const { prepared } = await test.json();

      const receipts: string[] = [];

      for (const step of test.steps) {
        for (const transaction of step.transactions) {
          const result = await sendAndConfirmTransaction({
            transaction,
            account,
          });

          const hash = (result as any)?.transactionHash ?? (result as any) ?? "";
          if (typeof hash !== "string" || hash.length === 0) {
            receipts.push("");
          } else {
            receipts.push(hash);
          }
        }
      }

      // for (const tx of txs) {
      //   const chain = CHAIN_MAP[tx.chainId as number];
      //   if (!chain) {
      //     throw new Error(`Unsupported chainId in prepared tx: ${tx.chainId}`);
      //   }
        
      //   await switchChain(chain);

      //   const sent = await sendAndConfirmTransaction({
      //     transaction: tx,
      //     account,
      //   });
      //   const hash = (sent as any)?.transactionHash ?? (sent as any) ?? "";
      //   if (typeof hash !== "string" || hash.length === 0) {
      //     receipts.push("");
      //   } else {
      //     receipts.push(hash);
      //   }
      // }

      return receipts;
    },
    [account, jwt, switchChain]
  );

  return { prepareAndSign };
}

type AvaxSwapContractInput = {
  pair: "AVAX/USD" | "BTC/USD" | "ETH/USD" | "USDC/USD" | "USDT/USD" | "DAI/USD" | "LINK/USD" | string;
  tokenA: `0x${string}`;         // taken from your UI; contract also derives internally
  amountInWei: bigint;
  // If false, skip the 1-wei ping to set lastSender (only safe if user already sent AVAX previously)
  ensureLastSender?: boolean;
  // If false, skip approve (only safe if allowance is already sufficient)
  autoApprove?: boolean;
};

const ERC20_SIGS = {
  allowance: "function allowance(address owner, address spender) view returns (uint256)",
  approve:   "function approve(address spender, uint256 amount) returns (bool)",
};

// Minimal ERC-20 ABI for allowance/approve
const ERC20_ABI = [
  { type: "function", name: "allowance", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    outputs: [{ type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable",
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }] },
] as const;

// Minimal ABI for your Swap contract
const SWAP_ABI = [
  {
    type: "function",
    name: "makeSwap",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_pair", type: "string" },
      { name: "amountIn", type: "uint256" },
    ],
    outputs: [{ type: "string" }, { type: "uint256" }],
  },
] as const satisfies Abi;

export function useAvaxSwapContract(contractAddress: `0x${string}`) {
  const account = useActiveAccount();
  const switchChain = useSwitchActiveWalletChain();

  const swap = useCallback(
    async (input: AvaxSwapContractInput) => {
      if (!account) throw new Error("No active account");
      await switchChain(chains.avalanche);

      const user = account.address as `0x${string}`;

      // (A) optional 1-wei ping to set lastSender
      let touchTxHash: string | undefined;
      if (input.ensureLastSender !== false) {
        const touchTx = prepareTransaction({
          to: contractAddress,
          value: BigInt(1),
          chain: chains.avalanche,
          client,
        });
        const sent = await sendAndConfirmTransaction({ transaction: touchTx, account });
        touchTxHash = (sent as any)?.transactionHash ?? (sent as any);
        if (!touchTxHash || typeof touchTxHash !== "string") {
          throw new Error("Failed to set lastSender (touch tx)");
        }
      }

      // (B) approve tokenA -> spender = your contract
      if (input.autoApprove !== false) {
        const tokenA = getContract({
          client,
          chain: chains.avalanche,
          address: input.tokenA,
          abi: ERC20_ABI,
        });

        const current = (await readContract({
          contract: tokenA,
          method: "allowance", // ✅ use `method` (not functionName)
          params: [user, contractAddress],
        })) as bigint;

        if (current < input.amountInWei) {
          const approveTx = prepareContractCall({
            contract: tokenA,
            method: "approve", // ✅ use `method`
            params: [contractAddress, input.amountInWei],
          });
          const approveRes = await sendAndConfirmTransaction({ transaction: approveTx, account });
          const approveHash = (approveRes as any)?.transactionHash ?? (approveRes as any);
          if (!approveHash || typeof approveHash !== "string") {
            throw new Error("Approve failed (no tx hash)");
          }
        }
      }

      // (C) call makeSwap(pair, amountIn)
      const swapContract = getContract({
        client,
        chain: chains.avalanche,
        address: contractAddress,
        abi: SWAP_ABI,
      });

      const swapTx = prepareContractCall({
        contract: swapContract,
        method: "makeSwap", // ✅ use `method`
        params: [input.pair, input.amountInWei],
      });

      const result = await sendAndConfirmTransaction({ transaction: swapTx, account });
      const hash = (result as any)?.transactionHash ?? (result as any);
      if (!hash || typeof hash !== "string") throw new Error("Swap failed (no tx hash)");

      return { hash, touchTxHash };
    },
    [account, contractAddress, switchChain]
  );

  return { swap };
}