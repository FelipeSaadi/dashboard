"use client"

import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { Tooltip } from '@mui/material'

import { HashblockProps } from '@/components/hashblocks/hashblocks'
import Network from '@/modules/icp/components/network/network'
import CustomTabs from '@/modules/icp/components/custom-tabs/custom-tabs'
import BitcoinService from '@/lib/api/services/bitcoin'
import InfoModal from '@/components/info-modal/info-modal'
import TransactionInfo from '@/components/transaction-info/transaction-info'
import AddressInfo from '@/components/address-info/address-info'
import OpenChat from '@/components/open-chat/open-chat'
import WhaleHunting from '@/modules/icp/components/whale-hunting/whale-hunting'
import { getLastWeek, minutesInterval } from '@/utils/time'
import { ICPAreaChart } from '@/modules/icp/components/icp-area-chart/icp-area-chart'
import Layout from '@/components/layout/Layout'

const Icp: React.FC = () => {
    const [actual, setActual] = useState('ICP')
    const [actualHashblock, setActualHashblock] = useState(null)
    const [hashblocks, setHashblocks] = useState<HashblockProps[]>()
    const [modalOpened, setModalOpened] = useState(false)
    const [chatOpened, setChatOpened] = useState(false)
    const [whaleOpened, setWhaleOpened] = useState(false)
    const [hashblockOpened, setHashblockOpened] = useState(false)
    const [info, setInfo] = useState<any>()
    const [data, setData] = useState(
        {
            description: "The Internet Computer is a public blockchain network enabled by new science from first principles. It is millions of times more powerful and can replace clouds and traditional IT. The network - created by ICP, or Internet Computer Protocol - is orchestrated by permissionless decentralized governance and is hosted on sovereign hardware devices run by independent parties. Its purpose is to extend the public internet with native cloud computing functionality.",
            activeUsers: '',
            avgTransactions: '',
            transactionsValue: '',
            address: "",
            block_height: "",
            transactions: "",
            fee: "",
            burned: "",
            circulating_supply: "",
            token: 'ICP USD'
        }
    )
    const [tvl, setTVL] = useState<any>([])
    const [burned, setBurned] = useState<any>([])
    const [supply, setSupply] = useState<any>([])
    const [canisters, setCanisters] = useState<any>([])
    const [transactions, setTransactions] = useState<any>([])
    const [cyclesRate, setCyclesRate] = useState<any>([])
    const [blocksHeight, setBlocksHeight] = useState<any>([])

    const verifyCacheInterval = (cache: any) => {
        if (cache.date) {
            const interval = minutesInterval(Date.now(), cache.date)

            if (interval >= 0 && interval < 5) {
                return true
            }
        }
        return false
    }

    useEffect(() => {
        const getDailyStats = async () => {
              const response: any = await BitcoinService.getDailyStats()
              if (response) {
                setData({
                  ...data,
                  address: response.unique_accounts_per_day,
                  fee: response.icp_burned_fees,
                  burned: response.icp_burned_total,
                  transactions: response.total_transactions
                })
              }
        }

        getDailyStats()
    }, [])

    useEffect(() => {
        const now = new Date()
        const lastWeek = getLastWeek(now)

        const date = {
            start: Math.floor((+lastWeek) / 1000),
            end: Math.floor((+now) / 1000)
        }

        const getTVL = async (): Promise<void> => {
          const response = await BitcoinService.getTVL(date)

          setTVL(response)
        }

        const getBurned = async (): Promise<void> => {
          const response = await BitcoinService.getBurned(date)

          setBurned(response)
        }

        const getSupply = async (): Promise<void> => {
          const response = await BitcoinService.getSupply(date)

          setSupply(response)
        }

        getTVL()
        getBurned()
        getSupply()
    }, [])

    useEffect(() => {
        const getCanisters = async () => {
            const now = new Date()
            const lastWeek = getLastWeek(now)

            const date = {
                start: Math.floor((+lastWeek) / 1000),
                end: Math.floor((+now) / 1000)
            }

              const response: any = await BitcoinService.getCanisters(date)
              if (response) {
                setCanisters(response)
              }
        }

        getCanisters()
    }, [])

    useEffect(() => {
        const now = new Date()
        const lastWeek = getLastWeek(now)

        const date = {
            start: Math.floor((+lastWeek) / 1000),
            end: Math.floor((+now) / 1000)
        }

        const getCyclesRate = async () => {

            const response: any = await BitcoinService.getCyclesRate(date)
            if (response) {
                setCyclesRate(response)
            }
        }

        getCyclesRate()
    }, [])

    useEffect(() => {
        const now = new Date()
        const lastWeek = getLastWeek(now)

        const date = {
            start: Math.floor((+lastWeek) / 1000),
            end: Math.floor((+now) / 1000)
        }

        const getBlocksHeight = async () => {

            const response: any = await BitcoinService.getBlocksHeight(date)
            if (response) {
                setBlocksHeight(response)
            }
        }

        getBlocksHeight()
    }, [])

    const handleGetInfo = async (type: string, value: string) => {
        setModalOpened(true)
    
        if (type === 'address') {
          const response: any = await BitcoinService.getAddressInfo(value)
    
          if (response.data && response.data.chain_stats) {
            const data = {
              ok: response.data,
              type: type
            }
    
    
            setInfo(data)
          }
          else {
            setInfo({ error: 'fail' })
          }
        }
        else if (type === 'transaction') {
          const response: any = await BitcoinService.getTransactionInfo(value)
    
          if (response.data) {
            const data = {
              ok: response.data,
              type: type
            }
    
            setInfo(data)
          }
          else {
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

    return (
        <Layout
            sidebar={{ actual: actual, onChange: (coin: string) => setActual(coin), open: (page: string) => handleOpen(page) }}
            header={{ onSubmit: handleGetInfo }}
        >
            <div className={styles.home}>
                <div className={styles.container}>
                    <div className={styles.info}>
                        <Network data={data} />
                        <div className={styles.custom}>
                            {
                                tvl && <CustomTabs
                                    data={{ tvl: tvl, burned: burned, supply: supply }}
                                    labels={['TVL (7 days)', 'Total Supply (7 days)', 'Total Burned (7 days)']} />
                            }
                        </div>
                    </div>

                    <div className="flex gap-3 ">
                        <h3 className="ml-[60px] mb-4 text-lg font-bold text-zinc-100">Canisters</h3>
                    </div>
                    {
                        canisters && <div className="flex flex-col mb-8 mx-[20px] text-white xl:mx-[40px]">
                            <ICPAreaChart data={canisters} dataKey="canisters" legend="Canisters" title="" />
                        </div>
                    }


                    <div className="flex gap-3 ">
                        <h3 className="ml-[60px] mb-4 text-lg font-bold text-zinc-100">Cycles Burn Rate</h3>
                    </div>
                    {
                        cyclesRate && <div className="flex flex-col mb-8 mx-[20px] text-white xl:mx-[40px]">
                            <ICPAreaChart data={cyclesRate} dataKey="cycles" legend="Cycles" title="" />
                        </div>
                    }

                    <div className="flex gap-3 ">
                        <h3 className="ml-[60px] mb-4 text-lg font-bold text-zinc-100">Blocks Heigth</h3>
                    </div>
                    {
                        blocksHeight && <div className="flex flex-col mb-8 mx-[20px] text-white xl:mx-[40px]">
                            <ICPAreaChart data={blocksHeight} dataKey="height" legend="Blocks" title="" />
                        </div>
                    }
                </div>

                {
                    modalOpened && <InfoModal data={info} onClose={() => handleClose()}>
                        {
                            info?.type === 'address' ? <AddressInfo title="Address Information" data={info?.['ok']} />
                                // : <TransactionInfo title="Transaction Information" data={info?.['ok'] && info?.['ok'][0] !== 'Invalid hex string' && JSON.parse(info?.['ok'][0])} />
                                : <TransactionInfo title="Transaction Information" data={info?.['ok']} />
                        }
                    </InfoModal>
                }

                <OpenChat />

                {
                    whaleOpened && (
                        <WhaleHunting onSelect={(id: string) => handleGetInfo('address', id)} onClose={() => setWhaleOpened(false)} />
                    )
                }
            </div>
        </Layout>
    )
}

export default Icp