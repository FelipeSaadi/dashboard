import { create } from 'zustand'
import { AuthResponse } from '@/lib/api/services/auth'

interface WalletStore {
  wallet: string | null
  setWallet: (wallet: string | null) => void
  token: string | null
  setToken: (token: string | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  payload: AuthResponse['payload'] | null
  setPayload: (payload: AuthResponse['payload'] | null) => void
  signature: string | null
  setSignature: (signature: string | null) => void
  authToken: string | null
  setAuthToken: (authToken: string | null) => void
  sessionId: string | null
  setSessionId: (sessionId: string | null) => void
}

export const useWalletStore = create<WalletStore>()((set) => ({
  wallet: null,
  setWallet: (wallet: string | null) => set({ wallet }),
  token: null,
  setToken: (token: string | null) => set({ token }),
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
  payload: null,
  setPayload: (payload: AuthResponse['payload'] | null) => set({ payload }),
  signature: null,
  setSignature: (signature: string | null) => set({ signature }),
  authToken: null,
  setAuthToken: (authToken: string | null) => set({ authToken }),
  sessionId: null,
  setSessionId: (sessionId: string | null) => set({ sessionId })
}))