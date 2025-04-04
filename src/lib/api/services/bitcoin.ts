import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_BITCOIN_SERVICE_URL ?? "http://localhost:5000"

type Range = {
  start: number
  end: number
}

const BitcoinService = {
  getHashblocks: async (page: number = 0) => {
    try {
      const response = await axios.get(`${BASE_URL}/hashblock`, {
        params: {
          page
        }
      })
      return response.data
    }
    catch (error) {
      return error
    }
  },
  getAddressInfo: async (address: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/address/${address}`)
      return response.data
    }
    catch (error) {
      return error
    }
  },
  getWhales: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/whales`)
      return response.data
    }
    catch (error) {
      return error
    }
  },
  getTransactionIds: async (id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/transactionIds/${id}`)
      return response.data
    }
    catch (error) {
      return error
    }
  },
  getTransactionInfo: async (transaction: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/transaction/${transaction}`)
      return response.data
    }
    catch (error) {
      return error
    }
  },
  getMainChain: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/bitcoin/main-chain-height?end=${date.end}&start=${date.start}&network=mainnet&format=json`)

    let data = []
    if (response.data) {
      data = response.data.bitcoin_main_chain_height.map((item: any) => ({
        timestamp: item[0],
        height: item[1]
      }))
    }
    return data
  },
  getBitcoinTransactions: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/bitcoin/number-of-utxos?end=${date.end}&start=${date.start}&network=mainnet&format=json`)

    let data = []
    if (response.data) {
      data = response.data.bitcoin_number_of_utxos.map((item: any) => ({
        timestamp: item[0],
        transactions: item[1]
      }))
    }
    return data
  },
  getSupply: async (date: Range) => {
    const response = await axios.get(`https://ledger-api.internetcomputer.org/supply/circulating/series?step=0&end=${date.end}&start=${date.start}&network=mainnet&format=json`)

    let data = []
    if (response.data) {
      data = response.data.map((item: any) => ({
        timestamp: item[0],
        supply: item[1]
      }))
    }

    return data
  },
  getTVL: async (date: Range) => {
    const response = await axios.get(`https://ledger-api.internetcomputer.org/metrics/transaction-volume?step=3600&start=${date.start}&end=${date.end}`)

    return response.data.data
  },
  getBurned: async (date: Range) => {
    const response = await axios.get(`https://ledger-api.internetcomputer.org/icp-burned/series?step=7200&start=${date.start}&end=${date.end}&format=json`)

    let data = []
    if (response.data) {
      data = response.data.map((item: any) => ({
        timestamp: item[0],
        burned: item[1]
      }))
    }

    return data
  },
  getCyclesRate: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/metrics/cycle-burn-rate?start=${date.start}&end=${date.end}&format=json`)

    let data = []
    if (response.data) {
      data = response.data.cycle_burn_rate.map((item: any) => ({
        timestamp: item[0],
        cycles: item[1]
      }))
    }
    return data
  },
  getBlocksHeight: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/metrics/block-height?format=json&step=7200&start=${date.start}&end=${date.end}`)

    let data = []
    if (response.data) {
      data = response.data.block_height.map((item: any) => ({
        timestamp: item[0],
        height: item[1]
      }))
    }
    return data
  },
  getQueryTransactions: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/max-query-transactions-per-sec-till-date?start=${date.start}&end=${date.end}&format=json`)

    let data = []
    if (response.data) {
      data = response.data.max_query_transactions_per_sec.map((item: any) => ({
        timestamp: item[0],
        queryTransactions: item[1]
      }))
    }
    return data
  },
  getCkBTCHeight: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/bitcoin/main-chain-height?start=${date.start}&end=${date.end}&step=600`)
    let data = []
    if (response.data) {
      data = response.data.bitcoin_main_chain_height.map((item: any) => ({
        timestamp: item[0],
        height: item[1]
      }))
    }
    return data
  },
  getCkBTCSuply: async (date: Range) => {
    const response = await axios.get(`https://icrc-api.internetcomputer.org/api/v1/ledgers/mxzaz-hqaaa-aaaar-qaada-cai/total-supply?start=${date.start}&end=${date.end}&step=600`)
    let data = []
    if (response.data) {
      data = response.data.data.map((item: any) => ({
        timestamp: item[0],
        total_suply: item[1]
      }))
    }
    return data
  },
  getCkBTCCanisters: async () => {
    const response = await axios.get(`https://icrc-api.internetcomputer.org/api/v1/ledgers/mxzaz-hqaaa-aaaar-qaada-cai/canisters`)
    let data = []
    if (response.data) {
      data = response.data.data
    }
    return data
  },
  getCkBTCTransactions: async (limit: number) => {
    const response = await axios.get(`https://icrc-api.internetcomputer.org/api/v1/ledgers/mxzaz-hqaaa-aaaar-qaada-cai/transactions?limit=${limit}`)
    let data = []
    if (response.data) {
      data = response.data.data
    }
    return data
  },
  getCkBTCNumberTransactions: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/bitcoin/number-of-utxos?start=${date.start}&end=${date.end}&step=600`)
    let data = []
    if (response.data) {
      data = response.data.bitcoin_number_of_utxos.map((item: any) => ({
        timestamp: item[0],
        number_of_utxos: Math.floor(item[1])
      }))
    }
    return data
  },
  getCkBTCStable: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/bitcoin/stable-memory-size-in-bytes?end=${date.end}&start=${date.start}&network=mainnet&format=json`)

    let data = []
    if (response.data) {
      data = response.data.bitcoin_stable_memory_size_in_bytes.map((item: any) => ({
        timestamp: item[0],
        memory: item[1]
      }))
    }
    return data
  },
  getCanisters: async (date: Range) => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/metrics/registered-canisters-count?end=${date.end}&step=7200&start=${date.start}&status=running&format=json`)

    let data = []
    if (response.data) {
      data = response.data.running_canisters.map((item: any) => ({
        timestamp: item[0],
        canisters: Math.floor(item[1])
      }))
    }

    return data
  },
  getDailyStats: async () => {
    const response = await axios.get(`https://ic-api.internetcomputer.org/api/v3/daily-stats?format=json`)

    let data = []
    if (response.data) {
      data = response.data.daily_stats[0]
    }
    return data
  }
}

export default BitcoinService