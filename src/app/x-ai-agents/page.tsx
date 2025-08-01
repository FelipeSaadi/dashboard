'use client'

import React, { useState, useEffect } from 'react'
import BitcoinService from '@/lib/api/services/bitcoin'
import InfoModal from '@/components/info-modal/info-modal'
import OpenChat from '@/components/open-chat/open-chat'
import WhaleHunting from '@/components/whale-hunting/whale-hunting'
import TransactionInfo from '@/components/transaction-info/transaction-info'
import TweetList, { Tweet } from '@/components/tweet-list/tweet-list'
import AddressInfo from '@/components/address-info/address-info'
import NewsletterModal from '@/components/newsletter-modal/newsletter-modal'
import { Tabs, Tab, Box } from '@mui/material'

import styles from './styles.module.scss'
import Layout from '@/components/layout/Layout'
import XService from '@/lib/api/services/x'
import { ChakraProvider } from '@chakra-ui/react'
import { HeaderBar } from '@/components/header-bar'

const XAiAgents: React.FC = () => {
  const [actual, setActual] = useState('bitcoin')
  const [modalOpened, setModalOpened] = useState(false)
  const [whaleOpened, setWhaleOpened] = useState(false)
  const [info, setInfo] = useState<any>()

  const [tweets, setTweets] = useState<Tweet[]>([])
  const [zicoTweets, setZicoTweets] = useState<Tweet[]>([])
  const [avaxTweets, setAvaxTweets] = useState<Tweet[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [zicoCurrentPage, setZicoCurrentPage] = useState(1)
  const [avaxCurrentPage, setAvaxCurrentPage] = useState(1)

  const [hasMore, setHasMore] = useState(true)
  const [zicoHasMore, setZicoHasMore] = useState(true)
  const [avaxHasMore, setAvaxHasMore] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false)

  useEffect(() => {
    const getTweets = async () => {
      setIsLoading(true)
      const response = await XService.getTweets(1)
      if (response?.tweets) {
        setTweets(response.tweets)
        setHasMore(currentPage < response.pagination.totalPages)
      }
      setIsLoading(false)
    }

    const getZicoTweets = async () => {
      setIsLoading(true)
      const response = await XService.getZicoTweets(1)
      if (response?.tweets) {
        setZicoTweets(response.tweets)
        setZicoHasMore(zicoCurrentPage < response.pagination.totalPages)
      }
      setIsLoading(false)
    }

    const getAvaxTweets = async () => {
      setIsLoading(true)
      const response = await XService.getAvaxTweets(1)
      if (response?.tweets) {
        setAvaxTweets(response.tweets)
        setAvaxHasMore(avaxCurrentPage < response.pagination.totalPages)
      }
      setIsLoading(false)
    }

    getTweets()
    getZicoTweets()
    getAvaxTweets()
  }, [])

  const loadMoreTweets = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    const nextPage = currentPage + 1
    const response = await XService.getTweets(nextPage)

    if (response?.tweets) {
      setTweets((prev) => [...prev, ...response.tweets])
      setCurrentPage(nextPage)
      setHasMore(nextPage < response.pagination.totalPages)
    }
    setIsLoading(false)
  }

  const loadMoreZicoTweets = async () => {
    if (isLoading || !zicoHasMore) return

    setIsLoading(true)
    const nextPage = zicoCurrentPage + 1
    const response = await XService.getZicoTweets(nextPage)

    if (response?.tweets) {
      setZicoTweets((prev) => [...prev, ...response.tweets])
      setZicoCurrentPage(nextPage)
      setZicoHasMore(nextPage < response.pagination.totalPages)
    }
    setIsLoading(false)
  }

  const loadMoreAvaxTweets = async () => {
    if (isLoading || !avaxHasMore) return

    setIsLoading(true)
    const nextPage = avaxCurrentPage + 1
    const response = await XService.getAvaxTweets(nextPage)

    if (response?.tweets) {
      setAvaxTweets((prev) => [...prev, ...response.tweets])
      setAvaxCurrentPage(nextPage)
      setAvaxHasMore(nextPage < response.pagination.totalPages)
    }
    setIsLoading(false)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleGetInfo = async (type: string, value: string) => {
    setModalOpened(true)

    if (type === 'address') {
      const response: any = await BitcoinService.getAddressInfo(value)

      if (response.data && response.data.chain_stats) {
        const data = {
          ok: response.data,
          type: type,
        }

        setInfo(data)
      } else {
        setInfo({ error: 'fail' })
      }
    } else if (type === 'transaction') {
      const response: any = await BitcoinService.getTransactionInfo(value)

      if (response.data) {
        const data = {
          ok: response.data,
          type: type,
        }

        setInfo(data)
      } else {
        setInfo({ error: 'fail' })
      }
    }
  }

  const handleClose = () => {
    setInfo(null)
    setModalOpened(false)
  }

  const handleOpen = (page: string) => {
    if (page === 'Whale Hunting') {
      setWhaleOpened(true)
    }
  }

  const handleNewsletterSubmit = async (email: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error('Failed to subscribe:', error)
      return false
    }
  }

  return (
    <>
      <ChakraProvider>
        <HeaderBar />
      </ChakraProvider>
      <div className={styles.xAiAgents}>
        <div className="flex flex-col w-full h-[calc(80vh)] gap-6">
          <h1 className="ml-4 text-xl font-bold text-white">AI Agents on X</h1>

          <div className="mx-4 p-3 rounded-lg bg-backgroundSecondary border border-[#FFFFFF8F]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-md text-white mb-2">
                  Stay Updated with AI Insights
                </h2>
                <p className="text-zinc-400">
                  Subscribe to our newsletter and receive curated AI analysis
                  summaries directly in your inbox. Be the first to know about
                  market trends and AI predictions.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  className="px-6 py-3 bg-[#3BEBFC] hover:bg-[#3BEBFC]/80 text-white font-medium rounded-lg transition-colors"
                  onClick={() => setNewsletterModalOpen(true)}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <div className="w-full">
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: 'var(--background-secondary)',
                  mb: 2,
                }}
              >
                <Tabs
                  sx={{
                    marginBottom: '4px',
                    '.Mui-selected': {
                      color: `white !important`,
                    },
                  }}
                  slotProps={{ indicator: { style: { backgroundColor: 'white' } } }}
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="tweet tabs"
                >
                  <Tab className={styles.tab} label="All Tweets" />
                  <Tab className={styles.tab} label="Zico's Tweets" />
                  <Tab className={styles.tab} label="AVAX's Tweets" />
                </Tabs>
              </Box>

              {activeTab === 0 && (
                <>
                  <TweetList tweets={tweets} />
                  {hasMore && (
                    <div className="flex justify-center my-5">
                      <button
                        onClick={loadMoreTweets}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-[#1DA1F2] text-white font-semibold rounded-full hover:bg-[#1a91da] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Loading...' : 'Load more'}
                      </button>
                    </div>
                  )}
                </>
              )}

              {activeTab === 1 && (
                <>
                  <TweetList tweets={zicoTweets} />
                  {zicoHasMore && (
                    <div className="flex justify-center my-5">
                      <button
                        onClick={loadMoreZicoTweets}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-[#1DA1F2] text-white font-semibold rounded-full hover:bg-[#1a91da] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Loading...' : 'Load more'}
                      </button>
                    </div>
                  )}
                </>
              )}

              {activeTab === 2 && (
                <>
                  <TweetList tweets={avaxTweets} />
                  {avaxHasMore && (
                    <div className="flex justify-center my-5">
                      <button
                        onClick={loadMoreAvaxTweets}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-[#1DA1F2] text-white font-semibold rounded-full hover:bg-[#1a91da] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Loading...' : 'Load more'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {modalOpened && (
          <InfoModal data={info} onClose={() => handleClose()}>
            {info?.type === 'address' ? (
              <AddressInfo title="Address Information" data={info?.['ok']} />
            ) : (
              <TransactionInfo
                title="Transaction Information"
                data={info?.['ok']}
              />
            )}
          </InfoModal>
        )}

        <OpenChat />

        {whaleOpened && (
          <WhaleHunting
            onSelect={(id: string) => handleGetInfo('address', id)}
            onClose={() => setWhaleOpened(false)}
          />
        )}

        <NewsletterModal
          isOpen={newsletterModalOpen}
          onClose={() => setNewsletterModalOpen(false)}
          onSubmit={handleNewsletterSubmit}
        />
      </div >
    </>
  )
}

export default XAiAgents
