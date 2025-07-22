import { create } from 'zustand'

interface ChatStore {
  messageToSend: string | null
  setMessageToSend: (messageToSend: string | null) => void
  readyToSend: boolean
  setIsReadyToSend: (readyToSend: boolean) => void
}

export const useChatStore = create<ChatStore>()((set) => ({
  messageToSend: null,
  setMessageToSend: (messageToSend: string | null) => set({ messageToSend }),
  readyToSend: false,
  setIsReadyToSend: (readyToSend: boolean) => set({ readyToSend })
}))