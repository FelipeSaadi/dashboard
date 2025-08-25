import axios from "axios";
import type { Account } from "thirdweb/wallets";
import { signLoginPayload } from "thirdweb/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3001";

export interface AuthResponse {
  payload: {
    address: string;
    domain: string;
    expiration_time: string;
    invalid_before: string;
    issued_at: string;
    nonce: string;
    statement: string;
    type: string;
    version: string;
  };
}

export interface VerifyResponse {
  token: string;
  sessionId: string;
}

const AuthService = {
  auth: async (address: string): Promise<AuthResponse | null> => {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${BASE_URL}/auth/login`,
        { address }
      );
      return data;
    } catch (error) {
      console.error(new Error("Failed to authenticate wallet (login)"), error);
      return null;
    }
  },

  // ---> Assina o payload SIWE usando a API oficial do thirdweb v5
  signature: async (
    payload: AuthResponse["payload"],
    account: Account
  ): Promise<string> => {
    try {
      // essa função cuida de EOA e Smart Account (EIP-1271) de forma transparente
      const sig = await signLoginPayload({ payload, account });
      return sig.signature;
    } catch (error) {
      console.error(new Error("Failed to sign login payload"), error);
      return "";
    }
  },

  verify: async (
    payload: AuthResponse["payload"],
    signature: string
  ): Promise<VerifyResponse | null> => {
    try {
      const { data } = await axios.post<VerifyResponse>(
        `${BASE_URL}/auth/verify`,
        { payload, signature }
      );
      return data;
    } catch (error) {
      console.error(new Error("Failed to verify login payload"), error);
      return null;
    }
  },

  validate: async (token: string, sessionId: string): Promise<boolean> => {
    try {
      const { data } = await axios.post<boolean>(`${BASE_URL}/auth/validate`, {
        token,
        sessionId,
      });
      return !!data;
    } catch (error) {
      console.error(new Error("Failed to validate JWT"), error);
      return false;
    }
  },
};

export default AuthService;
