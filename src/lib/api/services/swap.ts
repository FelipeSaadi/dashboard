import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_SWAP_SERVICE_URL || 'http://localhost:3002'

const SwapService: any = {
  swap: async (token: string, fromChainId: number, toChainId: number, fromToken: string, toToken: string, amount: string): Promise<any | null> => {
    if (!token || !fromChainId || !toChainId || !fromToken || !toToken || !amount) {
      return null
    }

    try {
      const response = await axios.post<any>(`${BASE_URL}/swap/manual`, {
        "fromChainId": Number(fromChainId),
        "toChainId": Number(toChainId),
        "fromToken": fromToken,
        "toToken": toToken,
        "amount": amount
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