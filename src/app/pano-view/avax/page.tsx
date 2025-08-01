"use client"

import React, { useState, useEffect } from "react"
import styles from "./styles.module.scss"
import {
  ArrowRight,
}
  from "lucide-react"
import { useRouter } from "next/navigation"

import HashblocksAvax from "@/components/hashblocks-avax/hashblocks-avax"
import HashblockInfo from "@/components/hashblock-info/hashblock-info"

import TokensTable from "@/modules/avax/components/table/table"

import InfoModal from "@/components/info-modal/info-modal"
import AddressInfo from "@/components/address-info/address-info"

import OpenChat from "@/components/open-chat/open-chat"
import WhaleHunting from "@/components/whale-hunting/whale-hunting"
import { minutesInterval } from "@/utils/time"
import TransactionInfo from "@/components/transaction-info/transaction-info"
import { Card } from "@/components/ui/card"

import Layout from "@/components/layout/Layout"
import Image from "next/image"
import AvaxService from "@/lib/api/services/avax"
import { ChartByTime } from "@/modules/avax/components/chart-by-time/chart-by-time"
import { Tab, Tabs } from "@mui/material"
import SuzakoService, { Token } from "@/lib/api/services/suzaku"
import { HeaderBar } from "@/components/header-bar"

import { ChakraProvider, Divider } from "@chakra-ui/react"

const Avax: React.FC = () => {
  const router = useRouter()
  const [actual, setActual] = useState("AVAX")
  const [actualHashblock, setActualHashblock] = useState(null)
  const [hashblocks, setHashblocks] = useState([
    {
      id: "1206070",
      tx_count: 1211,
      size: 140000,
      height: 8982,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
    {
      id: "1206069",
      tx_count: 2510,
      size: 140000,
      height: 8981,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
    {
      id: "1206068",
      tx_count: 3245,
      size: 140000,
      height: 8980,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
    {
      id: "1206067",
      tx_count: 1827,
      size: 140000,
      height: 8979,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
    {
      id: "1206066",
      tx_count: "2517",
      size: 140000,
      height: 8978,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
    {
      id: "1206065",
      tx_count: 3225,
      size: 140000,
      height: 8977,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
    {
      id: "1206064",
      tx_count: 1981,
      size: 140000,
      height: 8976,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
    {
      id: "1206063",
      tx_count: 1258,
      size: 140000,
      height: 8975,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
    {
      id: "1206062",
      tx_count: 1428,
      size: 140000,
      height: 8974,
      value: 5.475,
      fee: 0.134,
      timestamp: 0,
    },
  ])
  const [value, setValue] = React.useState('0')
  const [modalOpened, setModalOpened] = useState(false)
  const [whaleOpened, setWhaleOpened] = useState(false)
  const [hashblockOpened, setHashblockOpened] = useState(false)
  const [bridgeFee, setBridgeFee] = useState<any>()
  const [bridgeTx, setBridgeTx] = useState<any>()
  const [bridgeVol, setBridgeVol] = useState<any>()
  const [bridgeSwap, setBridgeSwap] = useState<any>()
  const [bridgeDailyVol, setBridgeDailyVol] = useState<any>()
  const [bridgeSubnet, setBridgeSubnet] = useState<any>()
  const [dexTvl, setDexTvl] = useState<any>()
  const [dexVolume, setDexVolume] = useState<any>()
  const [dexFeeRatio, setDexFeeRatio] = useState<any>()
  const [dexStable, setDexStable] = useState<any>()
  const [dexWhaleShare, setDexWhaleShare] = useState<any>()
  const [gasUsed, setGasUsed] = useState<any>()
  const [gasCost, setGasCost] = useState<any>()
  const [gasPrice, setGasPrice] = useState<any>()
  const [gasSpike, setGasSpike] = useState<any>()
  const [gasMaxSpike, setGasMaxSpike] = useState<any>()
  const [gasTotalFee, setGasTotalFee] = useState<any>()
  const [poolHighVol, setPoolHighVol] = useState<any>()
  const [poolLiquidity, setPoolLiquidity] = useState<any>()
  const [poolLiquidityGTE, setPoolLiquidityGTE] = useState<any>()
  const [poolSupply, setPoolSupply] = useState<any>()
  const [poolTvl, setPoolTvl] = useState<any>()
  const [poolVol, setPoolVol] = useState<any>()
  const [poolToken, setPoolToken] = useState<any>()
  const [poolRisingVol, setPoolRisingVol] = useState<any>()
  const [poolStablecoin, setPoolStablecoin] = useState<any>()
  const [stakeConcentration, setStakeConcentration] = useState<any>()
  const [stakeTvl, setStakeTvl] = useState<any>()
  const [stakeValidators, setStakeValidators] = useState<any>()
  const [throughputBlock, setThroughputBlock] = useState<any>()
  const [throughputVariance, setThroughputVariance] = useState<any>()
  const [throughputEfficiency, setThroughputEfficiency] = useState<any>()
  const [throughputTrend, setThroughputTrend] = useState<any>()
  const [throughputValidation, setThroughputValidation] = useState<any>()
  const [tokenLaunch, setTokenLaunch] = useState<any>()
  const [tokenPrice, setTokenPrice] = useState<any>()
  const [tokenPriceImpact, setTokenPriceImpact] = useState<any>()
  const [tokenSupply, setTokenSupply] = useState<any>()
  const [tokenVolatility, setTokenVolatility] = useState<any>()
  const [tokenTrend, setTokenTrend] = useState<any>()
  const [transferVol, setTransferVol] = useState<any>()
  const [transferNFT, setTransferNFT] = useState<any>()
  const [userContract, setUserContract] = useState<any>()
  const [userDaily, setUserDaily] = useState<any>()
  const [userNew, setUserNew] = useState<any>()
  const [userHolder, setUserHolder] = useState<any>()
  const [uniqueContracts, setUniqueContracts] = useState<any>()
  const [whaleLiquidity, setWhaleLiquidity] = useState<any>()

  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    const now = Date.now();
    setHashblocks(prev => prev.map((block, index) => ({
      ...block,
      timestamp: now - (index * 300000) // 5 minutes intervals
    })));
  }, []);

  const verifyCacheInterval = (cache: any) => {
    if (cache.date) {
      const interval = minutesInterval(Date.now(), cache.date)

      if (interval >= 0 && interval < 5) {
        return true
      }
    }
    return false
  }

  // const handleClose = () => {
  //   setInfo(null)
  //   setModalOpened(false)
  // }

  const handleHashblock = (hashblock?: any) => {
    if (hashblock) {
      setActualHashblock(hashblock)
      setHashblockOpened(true)
    } else {
      setActualHashblock(null)
      setHashblockOpened(false)
    }
  }

  const handleOpen = (page: string) => {
    if (page === "Whale Hunting") {
      setWhaleOpened(true)
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getBridgeFee()

      setBridgeFee(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getBridgeTx()

      setBridgeTx(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getBridgeVol()

      setBridgeVol(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getBridgeDailyVol()

      setBridgeDailyVol(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getBridgeSubnet()

      setBridgeSubnet(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getDexTvl()

      setDexTvl(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getDexVolume()

      setDexVolume(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getDexFeeRatio()

      setDexFeeRatio(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getDexStable()

      setDexStable(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getDexWhaleShare()

      setDexWhaleShare(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getGasUsed()

      setGasUsed(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getGasPrice()

      setGasPrice(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getGasCost()

      setGasCost(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getGasSpike()

      setGasSpike(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getGasMaxSpike()

      setGasMaxSpike(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getGasTotalFee()

      setGasTotalFee(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolHighVol()

      setPoolHighVol(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolLiquidity()

      setPoolLiquidity(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolLiquidityGTE()

      setPoolLiquidityGTE(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolSupply()

      setPoolSupply(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolTvl()

      setPoolTvl(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolVol()

      setPoolVol(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolToken()

      setPoolToken(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolRisingVol()

      setPoolRisingVol(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getPoolStablecoin()

      setPoolStablecoin(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getStakeConcentration()

      setStakeConcentration(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getStakeTvl()

      setStakeTvl(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getStakeValidators()

      setStakeValidators(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getThroughputBlock()

      setThroughputBlock(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getThroughputVariance()

      setThroughputVariance(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getThroughputEfficiency()

      setThroughputEfficiency(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getThroughputTrend()

      setThroughputTrend(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getThroughputValidation()

      setThroughputValidation(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getTokenLaunch()

      setTokenLaunch(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getTokenPrice()

      setTokenPrice(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getTokenPriceImpact()

      setTokenPriceImpact(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getTokenSupply()

      setTokenSupply(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getTokenVolatility()

      setTokenVolatility(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getTokenTrend()

      setTokenTrend(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await SuzakoService.getTokens()

      setTokens(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getTransferVol()

      setTransferVol(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getTransferNFT()

      setTransferNFT(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getUserContract()

      setUserContract(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getUserDaily()

      setUserDaily(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getUserNew()

      setUserNew(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getUserHolder()

      setUserHolder(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getUniqueContracts()

      setUniqueContracts(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const data = await AvaxService.getWhaleLiquidity()

      setWhaleLiquidity(data)
    }
    getData()
  }, [])

  return (
    <>
      <ChakraProvider>
        <HeaderBar />
      </ChakraProvider>
      <div className={styles.home}>
        <div className="mb-8 mx-[20px] md:mx-[120px]">
          <h2 className="text-[48px] text-white">AVAX</h2>
        </div>

        <div className="mb-12 h-[0.5px] w-full bg-[#4C4C4C]"></div>
        {
          value === '0' && (
            <>
              <HashblocksAvax
                coin={actual}
                data={hashblocks}
                onSelect={(hashblock: any) => { }}
              />
              <div className="relative mt-16 grid border-y border-y-[0.5px] border-y-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  bridgeFee && (
                    <ChartByTime
                      data={bridgeFee.data}
                      className={styles.chartByTime}
                      title={bridgeFee.chart}
                      description={bridgeFee.description}
                      label1={bridgeFee.label1}
                      label2={bridgeFee.label2}
                      valueColor="#FF6B6B"
                      transactionsColor="#FFD93D"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  bridgeVol && (
                    <ChartByTime
                      data={bridgeVol.data}
                      className={styles.chartByTime}
                      title={bridgeVol.chart}
                      description={bridgeVol.description}
                      label1={bridgeVol.label1}
                      label2={bridgeVol.label2}
                      valueColor="#845EC2"
                      transactionsColor="#00C9A7"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>
              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  bridgeSwap && (
                    <ChartByTime
                      data={bridgeSwap.data}
                      className={styles.chartByTime}
                      title={bridgeSwap.chart}
                      description={bridgeSwap.description}
                      label={bridgeSwap.label1}
                      label1={bridgeSwap.label1}
                      label2={bridgeSwap.label2}
                      valueColor="#0081CF"
                      transactionsColor="#FF8066"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  bridgeDailyVol && (
                    <ChartByTime
                      data={bridgeDailyVol.data}
                      className={styles.chartByTime}
                      title={bridgeDailyVol.chart}
                      description={bridgeDailyVol.description}
                      label1={bridgeDailyVol.label1}
                      valueColor="#FFC75F"
                      transactionsColor="#F9F871"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                {
                  bridgeSubnet && (
                    <ChartByTime
                      data={bridgeSubnet.data}
                      className={styles.chartByTime}
                      title={bridgeSubnet.chart}
                      description={bridgeSubnet.description}
                      label={bridgeSubnet.label}
                      label1={bridgeSubnet.label1}
                      valueColor="#4ECDC4"
                      transactionsColor="#FF6F91"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  dexTvl && (
                    <ChartByTime
                      data={dexTvl.data}
                      className={styles.chartByTime}
                      title={dexTvl.chart}
                      description={dexTvl.description}
                      label={dexTvl.label}
                      label1={dexTvl.label1}
                      valueColor="#00B8A9"
                      transactionsColor="#F67280"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  dexVolume && (
                    <ChartByTime
                      data={dexVolume.data}
                      className={styles.chartByTime}
                      title={dexVolume.chart}
                      description={dexVolume.description}
                      label={dexVolume.label}
                      label1={dexVolume.label1}
                      valueColor="#B39CD0"
                      transactionsColor="#F8B195"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  dexFeeRatio && (
                    <ChartByTime
                      data={dexFeeRatio.data}
                      className={styles.chartByTime}
                      title={dexFeeRatio.chart}
                      description={dexFeeRatio.description}
                      label={dexFeeRatio.label}
                      label1={dexFeeRatio.label1}
                      valueColor="#355C7D"
                      transactionsColor="#F8B195"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  dexStable && (
                    <ChartByTime
                      data={dexStable.data}
                      className={styles.chartByTime}
                      title={dexStable.chart}
                      description={dexStable.description}
                      label={dexStable.label}
                      label1={dexStable.label1}
                      valueColor="#F67280"
                      transactionsColor="#C06C84"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  dexWhaleShare && (
                    <ChartByTime
                      data={dexWhaleShare.data}
                      className={styles.chartByTime}
                      title={dexWhaleShare.chart}
                      description={dexWhaleShare.description}
                      label={dexWhaleShare.label}
                      label1={dexWhaleShare.label1}
                      valueColor="#11998E"
                      transactionsColor="#38EF7D"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  gasUsed && (
                    <ChartByTime
                      data={gasUsed.data}
                      className={styles.chartByTime}
                      title={gasUsed.chart}
                      description={gasUsed.description}
                      label={gasUsed.label}
                      label1={gasUsed.label1}
                      valueColor="#F8B400"
                      transactionsColor="#6A0572"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  gasCost && (
                    <ChartByTime
                      data={gasCost.data}
                      className={styles.chartByTime}
                      title={gasCost.chart}
                      description={gasCost.description}
                      label={gasCost.label}
                      label1={gasCost.label1}
                      valueColor="#009FFD"
                      transactionsColor="#FFA400"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  gasPrice && (
                    <ChartByTime
                      data={gasPrice.data}
                      className={styles.chartByTime}
                      title={gasPrice.chart}
                      description={gasPrice.description}
                      label={gasPrice.label}
                      label1={gasPrice.label1}
                      valueColor="#2A9D8F"
                      transactionsColor="#E76F51"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  gasSpike && (
                    <ChartByTime
                      data={gasSpike.data}
                      className={styles.chartByTime}
                      title={gasSpike.chart}
                      description={gasSpike.description}
                      label={gasSpike.label}
                      label1={gasSpike.label1}
                      valueColor="#E63946"
                      transactionsColor="#457B9D"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  gasMaxSpike && (
                    <ChartByTime
                      data={gasMaxSpike.data}
                      className={styles.chartByTime}
                      title={gasMaxSpike.chart}
                      description={gasMaxSpike.description}
                      label={gasMaxSpike.label}
                      label1={gasMaxSpike.label1}
                      valueColor="#8D8741"
                      transactionsColor="#659DBD"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  gasTotalFee && (
                    <ChartByTime
                      data={gasTotalFee.data}
                      className={styles.chartByTime}
                      title={gasTotalFee.chart}
                      description={gasTotalFee.description}
                      label={gasTotalFee.label}
                      label1={gasTotalFee.label1}
                      valueColor="#FF6B6B"
                      transactionsColor="#FFD93D"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  poolHighVol && (
                    <ChartByTime
                      data={poolHighVol.data}
                      className={styles.chartByTime}
                      title={poolHighVol.chart}
                      description={poolHighVol.description}
                      label={poolHighVol.label}
                      label1={poolHighVol.label1}
                      valueColor="#11998E"
                      transactionsColor="#38EF7D"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  poolLiquidity && (
                    <ChartByTime
                      data={poolLiquidity.data}
                      className={styles.chartByTime}
                      title={poolLiquidity.chart}
                      description={poolLiquidity.description}
                      label={poolLiquidity.label}
                      label1={poolLiquidity.label1}
                      label2={poolLiquidity.label2}
                      valueColor="#11998E"
                      transactionsColor="#845EC2"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  poolLiquidityGTE && (
                    <ChartByTime
                      data={poolLiquidityGTE.data}
                      className={styles.chartByTime}
                      title={poolLiquidityGTE.chart}
                      description={poolLiquidityGTE.description}
                      label={poolLiquidityGTE.label}
                      label1={poolLiquidityGTE.label1}
                      label2={poolLiquidityGTE.label2}
                      label3={poolLiquidityGTE.label3}
                      valueColor="#11998E"
                      transactionsColor="#F9F871"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  poolSupply && (
                    <ChartByTime
                      data={poolSupply.data}
                      className={styles.chartByTime}
                      title={poolSupply.chart}
                      description={poolSupply.description}
                      label={poolSupply.label}
                      label1={poolSupply.label1}
                      label2={poolSupply.label2}
                      label3={poolSupply.label3}
                      valueColor="#11998E"
                      transactionsColor="#F9F871"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  poolTvl && (
                    <ChartByTime
                      data={poolTvl.data}
                      className={styles.chartByTime}
                      title={poolTvl.chart}
                      description={poolTvl.description}
                      label={poolTvl.label}
                      label1={poolTvl.label1}
                      label2={poolTvl.label2}
                      valueColor="#FF6B6B"
                      transactionsColor="#4ECDC4"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' }
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  poolVol && (
                    <ChartByTime
                      data={poolVol.data}
                      className={styles.chartByTime}
                      title={poolVol.chart}
                      description={poolVol.description}
                      label={poolVol.label}
                      label1={poolVol.label1}
                      valueColor="#10B981"
                      transactionsColor="#3CDFEF99"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  poolToken && (
                    <ChartByTime
                      data={poolToken.data}
                      className={styles.chartByTime}
                      title={poolToken.chart}
                      description={poolToken.description}
                      label={poolToken.label}
                      label1={poolToken.label1}
                      valueColor="#FF6B6B"
                      transactionsColor="#4ECDC4"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  poolRisingVol && (
                    <ChartByTime
                      data={poolRisingVol.data}
                      className={styles.chartByTime}
                      title={poolRisingVol.chart}
                      description={poolRisingVol.description}
                      label={poolRisingVol.label}
                      label1={poolRisingVol.label1}
                      label2={poolRisingVol.label2}
                      valueColor="#10B981"
                      transactionsColor="#3CDFEF99"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>
                {
                  poolStablecoin && (
                    <ChartByTime
                      data={poolStablecoin.data}
                      className={styles.chartByTime}
                      title={poolStablecoin.chart}
                      description={poolStablecoin.description}
                      label={poolStablecoin.label}
                      label1={poolStablecoin.label1}
                      label2={poolStablecoin.label2}
                      valueColor="#FF6B6B"
                      transactionsColor="#4ECDC4"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  stakeConcentration && (
                    <ChartByTime
                      data={stakeConcentration.data}
                      className={styles.chartByTime}
                      title={stakeConcentration.chart}
                      description={stakeConcentration.description}
                      label={stakeConcentration.label}
                      label1={stakeConcentration.label1}
                      valueColor="#FF6B6B"
                      transactionsColor="#4ECDC4"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  stakeTvl && (
                    <ChartByTime
                      data={stakeTvl.data}
                      className={styles.chartByTime}
                      title={stakeTvl.chart}
                      description={stakeTvl.description}
                      label={stakeTvl.label}
                      label1={stakeTvl.label1}
                      valueColor="#10B981"
                      transactionsColor="#3CDFEF99"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  stakeValidators && (
                    <ChartByTime
                      data={stakeValidators.data}
                      className={styles.chartByTime}
                      title={stakeValidators.chart}
                      description={stakeValidators.description}
                      label={stakeValidators.label}
                      label1={stakeValidators.label1}
                      label2={stakeValidators.label2}
                      valueColor="#00B8A9"
                      transactionsColor="#F67280"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  throughputBlock && (
                    <ChartByTime
                      data={throughputBlock.data}
                      className={styles.chartByTime}
                      title={throughputBlock.chart}
                      description={throughputBlock.description}
                      label={throughputBlock.label}
                      label1={throughputBlock.label1}
                      valueColor="#10B981"
                      transactionsColor="#3CDFEF99"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  throughputVariance && (
                    <ChartByTime
                      data={throughputVariance.data}
                      className={styles.chartByTime}
                      title={throughputVariance.chart}
                      description={throughputVariance.description}
                      label={throughputVariance.label}
                      label1={throughputVariance.label1}
                      label2={throughputVariance.label2}
                      valueColor="#F67280"
                      transactionsColor="#F9F871"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                      ]}
                      defaultPeriod="24H"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  throughputEfficiency && (
                    <ChartByTime
                      data={throughputEfficiency.data}
                      className={styles.chartByTime}
                      title={throughputEfficiency.chart}
                      description={throughputEfficiency.description}
                      label={throughputEfficiency.label}
                      label1={throughputEfficiency.label1}
                      label2={throughputEfficiency.label2}
                      label3={throughputEfficiency.label3}
                      valueColor="#10B981"
                      transactionsColor="#3CDFEF99"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  throughputTrend && (
                    <ChartByTime
                      data={throughputTrend.data}
                      className={styles.chartByTime}
                      title={throughputTrend.chart}
                      description={throughputTrend.description}
                      label={throughputTrend.label}
                      label1={throughputTrend.label1}
                      valueColor="#B39CD0"
                      transactionsColor="#F9F871"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  throughputValidation && (
                    <ChartByTime
                      data={throughputValidation.data}
                      className={styles.chartByTime}
                      title={throughputValidation.chart}
                      description={throughputValidation.description}
                      label={throughputValidation.label}
                      label1={throughputValidation.label1}
                      label2={throughputValidation.label2}
                      valueColor="#10B981"
                      transactionsColor="#3CDFEF99"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  tokenLaunch && (
                    <ChartByTime
                      data={tokenLaunch.data}
                      className={styles.chartByTime}
                      title={tokenLaunch.chart}
                      description={tokenLaunch.description}
                      label={tokenLaunch.label}
                      label1={tokenLaunch.label1}
                      label2={tokenLaunch.label2}
                      valueColor="#FF6B6B"
                      transactionsColor="#4ECDC4"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  tokenPrice && (
                    <ChartByTime
                      data={tokenPrice.data}
                      className={styles.chartByTime}
                      title={tokenPrice.chart}
                      description={tokenPrice.description}
                      label={tokenPrice.label}
                      label1={tokenPrice.label1}
                      label2={tokenPrice.label2}
                      valueColor="#FF6B6B"
                      transactionsColor="#4ECDC4"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  tokenPriceImpact && (
                    <ChartByTime
                      data={tokenPriceImpact.data}
                      className={styles.chartByTime}
                      title={tokenPriceImpact.chart}
                      description={tokenPriceImpact.description}
                      label={tokenPriceImpact.label}
                      label1={tokenPriceImpact.label1}
                      label2={tokenPriceImpact.label2}
                      valueColor="#10B981"
                      transactionsColor="#3CDFEF99"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  tokenSupply && (
                    <ChartByTime
                      data={tokenSupply.data}
                      className={styles.chartByTime}
                      title={tokenSupply.chart}
                      description={tokenSupply.description}
                      label={tokenSupply.label}
                      label1={tokenSupply.label1}
                      label2={tokenSupply.label2}
                      label3={tokenSupply.label3}
                      valueColor="#FF6B6B"
                      transactionsColor="#4ECDC4"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  tokenVolatility && (
                    <ChartByTime
                      data={tokenVolatility.data}
                      className={styles.chartByTime}
                      title={tokenVolatility.chart}
                      description={tokenVolatility.description}
                      label={tokenVolatility.label}
                      label1={tokenVolatility.label1}
                      valueColor="#10B981"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  tokenTrend && (
                    <ChartByTime
                      data={tokenTrend.data}
                      className={styles.chartByTime}
                      title={tokenTrend.chart}
                      description={tokenTrend.description}
                      label={tokenTrend.label}
                      label1={tokenTrend.label1}
                      label2={tokenTrend.label2}
                      label3={tokenTrend.label3}
                      valueColor="#B39CD0"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  transferVol && (
                    <ChartByTime
                      data={transferVol.data}
                      className={styles.chartByTime}
                      title={transferVol.chart}
                      description={transferVol.description}
                      label={transferVol.label}
                      label1={transferVol.label1}
                      valueColor="#F67280"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  transferNFT && (
                    <ChartByTime
                      data={transferNFT.data}
                      className={styles.chartByTime}
                      title={transferNFT.chart}
                      description={transferNFT.description}
                      label={transferNFT.label}
                      label1={transferNFT.label1}
                      valueColor="#F67280"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  userContract && (
                    <ChartByTime
                      data={userContract.data}
                      className={styles.chartByTime}
                      title={userContract.chart}
                      description={userContract.description}
                      label={userContract.label}
                      label1={userContract.label1}
                      label2={userContract.label2}
                      label3={userContract.label3}
                      valueColor="#FF6B6B"
                      transactionsColor="#4ECDC4"
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  userDaily && (
                    <ChartByTime
                      data={userDaily.data}
                      className={styles.chartByTime}
                      title={userDaily.chart}
                      description={userDaily.description}
                      label={userDaily.label}
                      label1={userDaily.label1}
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="relative grid border-b border-b-[0.5px] border-b-[#4C4C4C] py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  userNew && (
                    <ChartByTime
                      data={userNew.data}
                      className={styles.chartByTime}
                      title={userNew.chart}
                      description={userNew.description}
                      label={userNew.label}
                      label1={userNew.label1}
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  userHolder && (
                    <ChartByTime
                      data={userHolder.data}
                      className={styles.chartByTime}
                      title={userHolder.chart}
                      description={userHolder.description}
                      label={userHolder.label}
                      label1={userHolder.label1}
                      label2={userHolder.label2}
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }
              </div>

              <div className="mb-12 relative grid py-[40px] px-[100px] grid-cols-1 md:grid-cols-2 gap-12">
                {
                  uniqueContracts && (
                    <ChartByTime
                      data={uniqueContracts.data}
                      className={styles.chartByTime}
                      title={uniqueContracts.chart}
                      description={uniqueContracts.description}
                      label={uniqueContracts.label}
                      label1={uniqueContracts.label1}
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="30D"
                    />
                  )
                }

                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4C4C4C]"></div>

                {
                  whaleLiquidity && (
                    <ChartByTime
                      data={[
                        { date: '01/03', value1: 580000, value2: 230000 },
                        { date: '02/03', value1: 530000, value2: 210000 },
                        { date: '03/03', value1: 550000, value2: 200000 },
                        { date: '04/03', value1: 490000, value2: 190000 },
                        { date: '05/03', value1: 510000, value2: 180000 },
                        { date: '06/03', value1: 460000, value2: 170000 },
                        { date: '07/03', value1: 480000, value2: 160000 },
                        { date: '08/03', value1: 430000, value2: 150000 },
                        { date: '09/03', value1: 450000, value2: 140000 },
                        { date: '10/03', value1: 410000, value2: 130000 },
                        { date: '11/03', value1: 430000, value2: 120000 },
                        { date: '12/03', value1: 380000, value2: 110000 },
                        { date: '13/03', value1: 400000, value2: 100000 },
                        { date: '14/03', value1: 350000, value2: 90000 },
                      ]}
                      className={styles.chartByTime}
                      title="Whale vs Non-Whale Liquidity"
                      description="WHALE_VS_NON_WHALE.liquidity_usd per day"
                      label="Data"
                      label1="Whale Liquidity"
                      label2="Non-Whale Liquidity"
                      valueColor="#5271FF"
                      transactionsColor="#34D399"
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      periods={[
                        { value: '1H', label: '1H' },
                        { value: '24H', label: '24H' },
                        { value: '7D', label: '7D' },
                        { value: '30D', label: '30D' },
                      ]}
                      defaultPeriod="7D"
                    />
                  )
                }
              </div>
            </>
          )}

        {
          value === '1' && (
            <>
              {tokens && (
                <div className="flex flex-col mb-4 mx-4 sm:mx-8 lg:mx-12 text-white overflow-x-auto">
                  <TokensTable title="Tokens" data={tokens} />
                </div>
              )}
            </>
          )
        }

        {hashblockOpened && actualHashblock && (
          <HashblockInfo
            data={actualHashblock}
            onClose={() => handleHashblock()}
          />
        )}

        <OpenChat />
      </div >
    </>
  )
}

export default Avax
