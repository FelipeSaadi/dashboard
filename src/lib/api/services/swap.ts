import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_SWAP_SERVICE_URL || 'http://localhost:3002'

export interface QuoteResponse {
  success: boolean,
  quote: {
    fromChainId: number,
    toChainId: number,
    fromToken: string,
    toToken: string,
    amount: string,
    amountHuman: string,
    amountUsd: string,
    estimatedReceiveAmount: string,
    estimatedReceiveAmountUsd: string,
    estimatedDuration: number,
    exchangeRate: number,
    fees: {
      bridgeFee: string,
      gasFee: string,
      totalFee: string,
      totalFeeUsd: string
    }
  }
}

const SwapService: any = {
  getQuote: async (token: string, fromChainId: number, toChainId: number, fromToken: string, toToken: string, amount: string): Promise<any | null> => {
    if (!token || !fromChainId || !toChainId || !fromToken || !toToken || !amount) {
      return null
    }

    try {
      const response = await axios.post<any>(`${BASE_URL}/swap/quote`, {
        fromChainId: fromChainId,
        toChainId: toChainId,
        fromToken: fromToken,
        toToken: toToken,
        amount: amount,
        unit: "token"
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      return response.data
    }
    catch (error) {
      console.log(error)
      console.error(new Error('Failed to get quote'))
      return null
    }
  },
  swap: async (token: string, fromChainId: number, toChainId: number, fromToken: string, toToken: string, amount: string, address: string, signature: string): Promise<any | null> => {
    if (!token || !fromChainId || !toChainId || !fromToken || !toToken || !amount || !address || !signature) {
      return null
    }

    try {
      const response = await axios.post<any>(`${BASE_URL}/swap/manual`, {
        "fromChainId": Number(fromChainId),
        "toChainId": Number(toChainId),
        "fromToken": fromToken,
        "toToken": toToken,
        "amount": amount,
        "sender": address,
        "receiver": address,
        "signature": signature
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      return response
    }
    catch (error) {
      console.log(error)
      console.error(new Error('Failed to swap'))
      return null
    }
  }
}

export default SwapService