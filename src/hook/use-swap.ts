import { useCallback } from "react";
import {
  useActiveAccount,
  useSendTransaction,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import {
  ethereum,
  polygon,
  bsc,
  base,
  optimism,
  arbitrum,
  avalanche
} from "thirdweb/chains";

type PrepareTxInput = {
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  amountWei: string;
  receiver?: string;
};

const CHAIN_MAP: Record<number, Readonly<{ id: number; rpc: string }>> = {
  1: ethereum,
  137: polygon,
  56: bsc,
  8453: base,
  10: optimism,
  42161: arbitrum,
  43114: avalanche,
};

const BASE_URL = process.env.NEXT_PUBLIC_LIQUID_SWAP_SERVICE_URL || 'http://localhost:3002'

export function useSwap(jwt?: string, input?: PrepareTxInput) {
  const account = useActiveAccount();
  const sendTx = useSendTransaction();
  const switchChain = useSwitchActiveWalletChain();

  const prepareAndSign = useCallback(
    async (input: PrepareTxInput) => {
      if (!jwt) throw new Error("Missing JWT");
      if (!account) throw new Error("No active account");

      const res = await fetch(
        `${BASE_URL}/swap/tx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            fromChainId: input.fromChainId,
            toChainId: input.toChainId,
            fromToken: input.fromToken,
            toToken: input.toToken,
            amount: input.amountWei,
            receiver: input.receiver,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to prepare swap");
      }

      const { prepared } = await res.json();

      const txs =
        prepared?.transactions ??
        prepared?.steps?.flatMap((s: any) => s.transactions) ??
        [];

      if (!Array.isArray(txs) || txs.length === 0) {
        throw new Error("No prepared transactions found");
      }

      const receipts: string[] = [];
      for (const tx of txs) {
        const chain = CHAIN_MAP[tx.chainId as number];
        if (!chain) {
          throw new Error(`Unsupported chainId in prepared tx: ${tx.chainId}`);
        }
        await switchChain(chain);

        const sent = await sendTx.mutateAsync(tx);
        const hash = (sent as any)?.transactionHash ?? (sent as any) ?? "";
        if (typeof hash !== "string" || hash.length === 0) {
          receipts.push("");
        } else {
          receipts.push(hash);
        }
      }

      return receipts;
    },
    [account, jwt, sendTx, switchChain]
  );

  return { prepareAndSign };
}
