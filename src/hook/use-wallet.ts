import { useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet, Wallet } from "thirdweb/wallets";
import {
  useActiveWallet,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";

import { useWalletStore } from "@/store/wallet";
import AuthService from "@/lib/api/services/auth";

// --- EVM-only no MVP para evitar fluxo SIWE com chains não-EVM:
export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "email",
        "x",
        "passkey",
        "coinbase",
        "github",
        "discord",
        "telegram",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("io.rabby"),
  createWallet("me.rainbow"),
  createWallet("com.brave.wallet"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.trustwallet.app"),
  createWallet("com.ledger"),
  createWallet("xyz.argent"),
  createWallet("global.safe"), // se conectar Safe, a assinatura via signLoginPayload cobre EIP-1271
  createWallet("co.family.wallet"),
];

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY as string,
});

export const useWallet = () => {
  const activeWallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();

  const wallet = useWalletStore((s) => s.wallet);
  const signature = useWalletStore((s) => s.signature);
  const setLoading = useWalletStore((s) => s.setLoading);
  const setWallet = useWalletStore((s) => s.setWallet);
  const setToken = useWalletStore((s) => s.setToken);
  const setSignature = useWalletStore((s) => s.setSignature);
  const setAuthToken = useWalletStore((s) => s.setAuthToken);
  const setSessionId = useWalletStore((s) => s.setSessionId);

  const handleConnect = async (w: Wallet) => {
    const account = w.getAccount();
    const addr = account?.address;
    if (!addr) return;

    // 1) pede payload para o MESMO endereço que irá assinar
    let authResp = await AuthService.auth(addr);
    if (!authResp) return;

    // 2) sanity-check: se o backend devolver outro address no payload (edge raro), refaz o login
    if (authResp.payload.address.toLowerCase() !== addr.toLowerCase()) {
      authResp = await AuthService.auth(addr);
      if (!authResp) return;
    }

    // 3) assina com signLoginPayload (thirdweb v5)
    const sig = await AuthService.signature(authResp.payload, account);
    if (!sig) return;

    // 4) verifica e valida
    const verify = await AuthService.verify(authResp.payload, sig);
    if (!verify?.token) return;

    const valid = await AuthService.validate(verify.token, verify.sessionId);
    if (!valid) return;

    // 5) atualiza store
    setSignature(sig);
    setAuthToken(verify.token);
    setSessionId(verify.sessionId);
    setWallet(addr);
  };

  useEffect(() => {
    setLoading(
      connectionStatus === "connecting" || connectionStatus === "unknown"
    );
  }, [connectionStatus, setLoading]);

  useEffect(() => {
    if (connectionStatus === "connected" && activeWallet) {
      // conecta e autentica
      handleConnect(activeWallet);
    }
  }, [connectionStatus, activeWallet]);

  const handleDisconnect = () => {
    setWallet(null);
    setToken(null);
  };

  return { wallet, connectionStatus, handleConnect, handleDisconnect };
};
