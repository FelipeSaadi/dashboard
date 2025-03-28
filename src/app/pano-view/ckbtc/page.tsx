'use client'

import React, { useEffect, useState } from 'react'
import BitcoinService from '@/lib/api/services/bitcoin'
import InfoModal from '@/components/info-modal/info-modal'
import OpenChat from '@/components/open-chat/open-chat'
import WhaleHunting from '@/components/whale-hunting/whale-hunting'
import TransactionInfo from '@/components/transaction-info/transaction-info'

import AddressInfo from '@/components/address-info/address-info'
import { Tooltip } from '@mui/material'

import styles from './styles.module.scss'
import TranscationsTable from '@/modules/ck-btc/components/transactions-table/transactions-table'
import CanistersTable from '@/modules/ck-btc/components/canisters-table/canisters-table'
import { CkAreaChart } from '@/modules/ck-btc/components/ck-area-chart/ck-area-chart'
import { getLastWeek } from '@/utils/time'
import Layout from '@/components/layout/Layout'
import Image from 'next/image'

const CkbtcPage = () => {
  const [actual, setActual] = useState('CkBTC')
  const [modalOpened, setModalOpened] = useState(false)
  const [chatOpened, setChatOpened] = useState(false)
  const [whaleOpened, setWhaleOpened] = useState(false)
  const [info, setInfo] = useState<any>()
  const [canisters, setCanisters] = useState()
  const [transactions, setTransactions] = useState()
  const [totalSuply, setTotalSuply] = useState()
  const [numberTransactions, setNumberTransactions] = useState()
  const [height, setHeight] = useState()
  const [memory, setMemory] = useState()

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

  useEffect(() => {
    const getCanisters = async () => {
      const response = await BitcoinService.getCkBTCCanisters()
      setCanisters(response)
    }

    getCanisters()
  }, [])

  useEffect(() => {
    const now = new Date()
    const lastWeek = getLastWeek(now)

    const date = {
      start: Math.floor(+lastWeek / 1000),
      end: Math.floor(+now / 1000),
    }

    const getTotalSuply = async () => {
      const response = await BitcoinService.getCkBTCSuply(date)
      setTotalSuply(response)
    }

    getTotalSuply()
  }, [])

  useEffect(() => {
    const getTransactions = async () => {
      const response = await BitcoinService.getCkBTCTransactions(24)
      setTransactions(response)
    }

    getTransactions()
  }, [])

  useEffect(() => {
    const now = new Date()
    const lastWeek = getLastWeek(now)

    const date = {
      start: Math.floor(+lastWeek / 1000),
      end: Math.floor(+now / 1000),
    }

    const getNumberTransactions = async () => {
      const response = await BitcoinService.getCkBTCNumberTransactions(date)
      setNumberTransactions(response)
    }

    getNumberTransactions()
  }, [])

  useEffect(() => {
    const now = new Date()
    const lastWeek = getLastWeek(now)

    const date = {
      start: Math.floor(+lastWeek / 1000),
      end: Math.floor(+now / 1000),
    }

    const getBlocksHeight = async () => {
      const response = await BitcoinService.getCkBTCHeight(date)
      setHeight(response)
    }

    getBlocksHeight()
  }, [])

  useEffect(() => {
    const now = new Date()
    const lastWeek = getLastWeek(now)

    const date = {
      start: Math.floor(+lastWeek / 1000),
      end: Math.floor(+now / 1000),
    }

    const getMemory = async () => {
      const response = await BitcoinService.getCkBTCStable(date)
      setMemory(response)
    }

    getMemory()
  }, [])

  return (
    <Layout
      sidebar={{ actual, onChange: setActual, open: handleOpen }}
      header={{ onSubmit: handleGetInfo }}
    >
      <div className={styles.home}>
        {totalSuply && (
          <div className="flex flex-col mb-8 mx-12 text-white">
            <div className="flex gap-3 my-4">
              <h3 className="ml-8 text-lg font-bold">ckBTC Total Suply</h3>
            </div>
            <CkAreaChart
              data={totalSuply}
              dataKey="total_suply"
              legend="Total Suply"
              title=""
              range={[20000000000, 25000000000]}
            />
          </div>
        )}

        {numberTransactions && (
          <div className="flex flex-col mb-8 mx-12 text-white">
            <div className="flex gap-3 my-4">
              <h3 className="ml-8 text-lg font-bold">ckBTC UTXos</h3>
            </div>
            <CkAreaChart
              data={numberTransactions}
              dataKey="number_of_utxos"
              legend="Unspent Transaction Outputs"
              title=""
              range={[182000000, 188000000]}
            />
          </div>
        )}

        {memory && (
          <div className="flex flex-col mb-8 mx-12 text-white">
            <div className="flex gap-3 my-4">
              <h3 className="ml-8 text-lg font-bold">
                ckBTC Stable Memory Usage
              </h3>
            </div>
            <CkAreaChart
              data={memory}
              dataKey="memory"
              legend="Stable Memory"
              title=""
              range={[106503159296, 106803159296]}
            />
          </div>
        )}

        {height && (
          <div className="flex flex-col mb-8 mx-12 text-white">
            <div className="flex gap-3 my-4">
              <h3 className="ml-8 text-lg font-bold">ckBTC Block Height</h3>
            </div>
            <CkAreaChart
              data={height}
              dataKey="height"
              legend="Block Height"
              title=""
              range={[868000, 870000]}
            />
          </div>
        )}

        {canisters && (
          <div className="flex flex-col mb-4 mx-12 text-white">
            <CanistersTable title="ckBTC Canisters" data={canisters} />
          </div>
        )}

        {transactions && (
          <div className="flex flex-col mb-4 mx-12 text-white">
            <TranscationsTable title="ckBTC Transactions" data={transactions} />
          </div>
        )}

        {/* <div className="flex flex-col mb-4 mx-12 text-white">
          <PoxTable title='Pox Explorer' data={stacksData.pox} />
        </div>

        <div className="flex flex-col mb-4 mx-12 text-white">
          <PoxMinersTable title='Pox Miners' data={stacksData.poxMiners} />
        </div>

        <div className="flex flex-col mb-4 mx-12 text-white">
          <VRFKeyTable title='VRF Key' data={stacksData.VRFKey} />
        </div>

        <div className="flex flex-col mb-4 mx-12 text-white">
          <OpsTable title='Ops' data={stacksData.ops} />
        </div>

        <div className="flex flex-col mb-6 mx-16 text-white">
          <SpendingChart data={stacksData.poxSubCycles} key="height" legend="Height" title="Stacking Cycles" range={[0, 4]} />
        </div> */}

        {modalOpened && (
          <InfoModal data={info} onClose={() => handleClose()}>
            {info?.type === 'address' ? (
              <AddressInfo title="Address Information" data={info?.['ok']} />
            ) : (
              // : <TransactionInfo title="Transaction Information" data={info?.['ok'] && info?.['ok'][0] !== 'Invalid hex string' && JSON.parse(info?.['ok'][0])} />
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
      </div>
    </Layout>
  )
}

export default CkbtcPage
