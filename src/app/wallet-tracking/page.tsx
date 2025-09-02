'use client'

import styles from './styles.module.scss'

import React, { useState, useEffect } from 'react'
import TokenDetailsModal from '@/components/token-details-modal/token-details-modal'
import RangoService from '@/lib/api/services/rango'
import { Button } from '@/components/ui/button'
import TrackAddressModal from '@/components/track-address-modal/track-address-modal'
import { useWalletStore } from '@/store/wallet'
import { LoaderCircle } from 'lucide-react'
import { HeaderBar } from '@/components/header-bar'
import { ChakraProvider } from '@chakra-ui/react'

interface Asset {
  blockchain: string
  symbol: string
  address: string
}

interface Amount {
  amount: string
  decimals: number
}

interface Token {
  asset: Asset
  amount: Amount
  price: number
}

interface WalletData {
  address: string
  network: string
  tokens: Token[]
  totalTokens: number
  balance: number
}

const Page: React.FC = () => {
  const loading = useWalletStore((state) => state.loading)
  const token = useWalletStore((state) => state.authToken)
  const wallet = useWalletStore((state) => state.wallet)
  const [actual, setActual] = useState('Bitcoin')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)
  const [walletData, setWalletData] = useState<WalletData[]>([])
  const [filteredData, setFilteredData] = useState<WalletData[]>([])
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isStarred, setIsStarred] = useState(walletData.map(item => {
    return {
      address: item.address,
      starred: false
    }
  }))

  const fetchData = async () => {
    if (!token) {
      setWalletData([])
      setFilteredData([])
      return
    }

    try {
      const addresses = await RangoService.getAddresses(token)

      if (!addresses || addresses.length === 0) {
        setWalletData([])
        setFilteredData([])
        return
      }

      if (addresses && addresses.length > 0) {
        const walletsData: WalletData[] = await Promise.all(
          addresses.map(async (address) => {
            const [network, walletAddress] = address.split('.')
            try {
              const tokens = await RangoService.getTokens(address, token)

              if ('error' in tokens || !Array.isArray(tokens)) {
                return {
                  address: walletAddress,
                  network,
                  tokens: [],
                  totalTokens: 0,
                  balance: 0
                }
              }

              const totalBalance = tokens.reduce((sum, token) => {
                const amount = parseFloat(token.amount.amount) / Math.pow(10, token.amount.decimals)
                return sum + (amount * token.price)
              }, 0)

              return {
                address: walletAddress,
                network,
                tokens,
                totalTokens: tokens.length,
                balance: totalBalance
              }
            } catch (error) {
              console.error(`Error fetching tokens for address ${address}:`, error)
              return {
                address: walletAddress,
                network,
                tokens: [],
                totalTokens: 0,
                balance: 0
              }
            }
          })
        )

        setWalletData(walletsData)
        setFilteredData(walletsData)
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    }
  }

  useEffect(() => {
    setWalletData([])
    setFilteredData([])

    if (token) {
      fetchData()
    }
  }, [token, wallet])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = walletData.filter(item =>
      item.address.toLowerCase().includes(query) ||
      item.network.toLowerCase().includes(query)
    )
    setFilteredData(filtered)
  }

  const handleTrackAddress = async (blockchain: string, address: string) => {
    if (!blockchain || !address || !token) return

    setIsTracking(true)

    try {
      const formattedAddress = `${blockchain}.${address}`
      await RangoService.storeAddress(formattedAddress, token)
      setIsTrackModalOpen(false)
      await fetchData()
    } catch (error) {
      console.error('Error tracking address:', error)
    } finally {
      setIsTracking(false)
    }
  }

  const handleWalletClick = (wallet: WalletData) => {
    setSelectedWallet(wallet)
  }

  const handleStar = (address: string) => {
    const stareds = [...isStarred]
    const stared = stareds.find(item => item.address === address)
    if (stared) {
      stared.starred = !stared.starred
    }
    else {
      stareds.push({ address, starred: true })
    }
    setIsStarred(stareds)
  }

  return (
    <div>
      <ChakraProvider>
        <HeaderBar />
      </ChakraProvider>
      <div className={styles.home}>
        {loading && (
          <div className="flex items-center justify-center h-[60vh] text-white">
            <LoaderCircle className="animate-spin t" />
          </div>
        )}
        {token && (
          <div className="flex flex-col mx-4 md:mx-12 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-[36px] text-muted-foreground font-regular">Wallet Tracking</h1>
              <div className="flex flex-col items-center justify-center md:flex-row w-full md:w-auto gap-4">
                <div className={styles.search}>
                  <img src="/assets/search.svg" alt="Search" />
                  <input
                    type="text"
                    placeholder={wallet ? "Wallet Address" : "Connect wallet to search..."}
                    value={searchQuery}
                    onChange={handleSearch}
                    className={styles.searchInput}
                    disabled={!wallet}
                  />
                </div>
                <Button
                  className={styles.trackNewAddressButton}
                  onClick={() => wallet && setIsTrackModalOpen(true)}
                  disabled={!wallet}
                  title={!wallet ? "Connect your wallet to track addresses" : "Track a new address"}
                >
                  {!wallet ? "Connect Wallet to Track" : "Track New Address"}
                </Button>
              </div>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div className={styles.headerCell}>Address</div>
                {/* <div className={styles.headerCell}>Custom Name</div> */}
                <div className={styles.headerCell}>Network</div>
                <div className={styles.headerCell}>Tokens</div>
                <div className={styles.headerCell}>Total Balance</div>
              </div>
              {loading ? (
                <div className="text-center py-4 text-gray-400">Loading...</div>
              ) : filteredData.map((item, index) => (
                <div
                  className={styles.tableRow}
                  key={`wallet-${index}`}
                  onClick={() => handleWalletClick(item)}
                >
                  <div className={styles.cell}>
                    <div className={styles.address}>
                      <div className={`w-fit p-2 border border-[#FFFFFF42] rounded-[7px] ${isStarred.find((starred) => starred.address === item.address)?.starred ? "bg-[#44FF00]" : "bg-transparent"}`} onClick={(e) => {
                        e.stopPropagation()
                        handleStar(item.address)
                      }}>
                        {
                          isStarred.find((starred) => starred.address === item.address)?.starred ? (
                            <img src="/assets/star-filled.svg" width={20} height={20} alt="" />
                          ) : (
                            <img src="/assets/star.svg" width={20} height={20} alt="" />
                          )
                        }
                      </div>
                      <span>
                        {item.address}
                      </span>
                    </div>
                  </div>
                  <div className={styles.cell}>{item.network}</div>
                  {/* <div className={styles.cell}>{item.customName}</div> */}
                  <div className={styles.cell}>{item.totalTokens}</div>
                  <div className={styles.cell}>${item.balance.toFixed(2)}</div>
                </div>
              ))}

              {!loading && filteredData.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  You are not tracking any wallets
                </div>
              )}
            </div>
          </div>
        )}

        {!token && (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <h2 className="text-2xl font-semibold text-white">Connect Your Wallet</h2>
              <p className="text-gray-400">Please connect your wallet to access Wallet Tracking features</p>
            </div>
          </div>
        )}
      </div>

      {
        token && (
          <TrackAddressModal
            open={isTrackModalOpen}
            onClose={() => {
              setIsTrackModalOpen(false)
            }}
            onSubmit={(blockchain, address) => handleTrackAddress(blockchain, address)}
            isLoading={isTracking}
          />
        )
      }

      {
        selectedWallet && (
          <TokenDetailsModal
            open={!!selectedWallet}
            onClose={() => setSelectedWallet(null)}
            address={selectedWallet.address}
            tokens={selectedWallet.tokens}
          />
        )
      }
    </div >
  )
}

export default Page
