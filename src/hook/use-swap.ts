import { useCallback } from "react";
import {
  useActiveAccount,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { sendAndConfirmTransaction, Bridge } from "thirdweb";
import * as chains from "thirdweb/chains";
import { client } from "./use-wallet";

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
