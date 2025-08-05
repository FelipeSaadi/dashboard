import axios from 'axios'

import { signMessage } from "thirdweb/utils"
import { Account } from 'thirdweb/wallets'

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001'

export interface AuthResponse {
  payload: {
    address: string
    domain: string
    expiration_time: string
    invalid_before: string
    issued_at: string
    nonce: string
    statement: string
    type: string
    version: string
  }
}

export interface VerifyResponse {
  token: string,
  sessionId: string
}

const buildMessage = (p: AuthResponse['payload']) => {
  return `${p.domain} wants you to sign in with your Ethereum account:\n${p.address}\n\n${p.statement}\n\nVersion: ${p.version}\nNonce: ${p.nonce}\nIssued At: ${p.issued_at}\nExpiration Time: ${p.expiration_time}\nNot Before: ${p.invalid_before}`;
}

const AuthService: any = {
  auth: async (address: string): Promise<AuthResponse | null> => {
    try {
      const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, {
        "address": address
      })

      return response.data
    }
    catch (error) {
      console.log(error)
      console.error(new Error('Failed to authenticate wallet'))
      return null
    }
  },
  signature: async (payload: AuthResponse['payload'], account: Account): Promise<string> => {
    try {
      const msg = buildMessage(payload);
      const response = await signMessage({
        message: msg,
        account
      });

      return response
    }
    catch (error) {
      console.log(error)
      console.error(new Error('Failed to authenticate wallet'))
      return ''
    }
  },
  verify: async (payload: AuthResponse['payload'], signature: string): Promise<VerifyResponse | null> => {
    try {
      const response = await axios.post<VerifyResponse>(`${BASE_URL}/auth/verify`, {
        "payload": payload,
        "signature": signature
      })

      return response.data
    }
    catch (error) {
      console.log(error)
      console.error(new Error('Failed to authenticate wallet'))
      return null
    }
  },
  validate: async (token: string, sessionId: string): Promise<boolean> => {
    try {
      const response = await axios.post<boolean>(`${BASE_URL}/auth/validate`, {
        "token": token,
        "sessionId": sessionId
      })

      return response.data
    }
    catch (error) {
      console.log(error)
      console.error(new Error('Failed to authenticate wallet'))
      return false
    }
  }
}

export default AuthService