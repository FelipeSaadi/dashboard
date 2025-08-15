import { useEffect } from "react"

import { createThirdwebClient } from "thirdweb"
import { inAppWallet, createWallet, Wallet } from "thirdweb/wallets"
import { useActiveWallet, useActiveWalletConnectionStatus } from "thirdweb/react"

import { useWalletStore } from '@/store/wallet'
import AuthService from '@/lib/api/services/auth'

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
    }
  }),
  createWallet("io.metamask"),
  createWallet("app.phantom"),
  createWallet("org.uniswap"),
  createWallet("com.ledger"),
  createWallet("io.rabby"),
  createWallet("me.rainbow"),
  createWallet("app.onto"),
  createWallet("global.safe"),
  createWallet("com.trustwallet.app"),
  createWallet("xyz.argent"),
  createWallet("co.family.wallet"),
  createWallet("com.roninchain.wallet"),
  createWallet("app.keplr"),
  createWallet("com.brave.wallet"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.exodus"),
]

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY as string
})

export const useWallet = () => {
  const activeWallet = useActiveWallet()
  const wallet = useWalletStore(state => state.wallet)
  const signature = useWalletStore(state => state.signature)
  const setLoading = useWalletStore(state => state.setLoading)
  const setWallet = useWalletStore(state => state.setWallet)
  const setToken = useWalletStore(state => state.setToken)
  const setPayload = useWalletStore(state => state.setPayload)
  const setSignature = useWalletStore(state => state.setSignature)
  const setAuthToken = useWalletStore(state => state.setAuthToken)
  const setSessionId = useWalletStore(state => state.setSessionId)
  const connectionStatus = useActiveWalletConnectionStatus()

  const handleConnect = async (wallet: Wallet) => {
    // const address = `${wallet.id}:${(wallet.getAccount())?.address}`
    const account = wallet.getAccount()
    const address = account?.address
    const authResponse = await AuthService.auth(address as string)

    console.log(account)
    
    if (!authResponse) {
      return
    }

    let verifyResponse
    let validateResponse
    
    if (address !== authResponse.payload.address || !signature) {
      const signature = await AuthService.signature(authResponse.payload, account)
      setSignature(signature)
      verifyResponse = await AuthService.verify(authResponse.payload, signature)
      validateResponse = await AuthService.validate(verifyResponse?.token, verifyResponse?.sessionId)
      setAuthToken(verifyResponse?.token)
    } else {
      verifyResponse = await AuthService.verify(authResponse.payload, signature)
      validateResponse = await AuthService.validate(verifyResponse?.token, verifyResponse?.sessionId)
      setAuthToken(verifyResponse?.token)
    }

    setWallet(address as string)
    setSessionId(verifyResponse?.sessionId)
  }

  useEffect(() => {
    if (connectionStatus === "connecting" || connectionStatus === "unknown") {
      setLoading(true)
    }
    else {
      setLoading(false)
    }
  }, [connectionStatus])

  useEffect(() => {
    if (connectionStatus === 'connected' && activeWallet) {
      handleConnect(activeWallet)
    }
  }, [connectionStatus, activeWallet])

  const handleDisconnect = () => {
    setWallet(null)
    setToken(null)
  }

  return {
    wallet,
    connectionStatus,
    handleConnect,
    handleDisconnect
  }
}