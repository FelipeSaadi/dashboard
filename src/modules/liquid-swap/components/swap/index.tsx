'use client'

import { useState, useEffect, useRef } from "react"

import { Check, ChevronsUpDown } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Button } from "@/components/ui/button"
import { IconButton } from "@chakra-ui/react"
import { FaArrowDown } from "react-icons/fa6"

import { useSwap } from "@/hook/use-swap";

import { toast } from "sonner"

import { cn } from "@/lib/utils"
import SwapService, { QuoteResponse } from "@/lib/api/services/swap"
import { useWalletStore } from "@/store/wallet"

interface Token {
  symbol: string;
  address: string;
  icon: string;
}

interface Network {
  chainId: number;
  name: string;
  tokens: Token[];
}

const networks: Network[] = [
  {
    chainId: 43114,
    name: "Avalanche",
    tokens: [
      {
        symbol: "AVAX",
        address: "0x0000000000000000000000000000000000000000",
        icon: "/swap/avax.png"
      },
      {
        symbol: "WAVAX",
        address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        icon: "/swap/wavax.png"
      },
      {
        symbol: "UNI",
        address: "0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580",
        icon: "/swap/uniswap.png"
      },
      {
        symbol: "USDC",
        address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        icon: "/swap/usdc.png"
      },
      {
        symbol: "USDT",
        address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
        icon: "/swap/usdt.svg"
      },
      {
        symbol: "AAVE",
        address: "0x8ce2dee54bb9921a2ae0a63dbb2df8ed88b91dd9",
        icon: "/swap/aave.png"
      },
      {
        symbol: "BTC.b",
        address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
        icon: "/swap/btc.png"
      },
      {
        symbol: "JOE",
        address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
        icon: "/swap/trader-joe.png"
      },
      {
        symbol: "MIM",
        address: "0x130966628846BFd36ff31a822705796e8cb8C18D",
        icon: "/swap/mim.png"
      }
    ]
  },
  {
    chainId: 1,
    name: "Ethereum",
    tokens: [
      {
        symbol: "USDC",
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        icon: "/swap/usdc.png"
      },
      {
        symbol: "USDT",
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        icon: "/swap/usdt.svg"
      },
      {
        symbol: "WBTC",
        address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        icon: "/swap/wbtc.png"
      },
      {
        symbol: "AAVE",
        address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        icon: "/swap/aave.png"
      },
      {
        symbol: "UNI",
        address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        icon: "/swap/uniswap.png"
      },
      {
        symbol: "LINK",
        address: "0x514910771af9ca656af840dff83e8264ecf986ca",
        icon: "/swap/chainlink.png"
      },
      {
        symbol: "LDO",
        address: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
        icon: "/swap/ldo.png"
      },
      {
        symbol: "USDe",
        address: "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
        icon: "/swap/usde.png"
      }
    ]
  },
  {
    chainId: 56,
    name: "Binance Smart Chain",
    tokens: [
      {
        symbol: "USDT",
        address: "0x55d398326f99059ff775485246999027b3197955",
        icon: "/swap/usdt.svg"
      },
      {
        symbol: "USDC",
        address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        icon: "/swap/usdc.png"
      },
      {
        symbol: "CAKE",
        address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
        icon: "/swap/cake.png"
      },
      {
        symbol: "ADA",
        address: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47",
        icon: "/swap/ada.png"
      },
      {
        symbol: "DOGE",
        address: "0xba2ae424d960c26247dd6c32edc70b295c744c43",
        icon: "/swap/doge.png"
      },
      {
        symbol: "XRP",
        address: "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe",
        icon: "/swap/xrp.png"
      },
      {
        symbol: "DOT",
        address: "0x7083609fce4d1d8dc0c979aab8c869ea2c873402",
        icon: "/swap/dot.png"
      },
      {
        symbol: "TUSD",
        address: "0x40af3827F39D0EAcBF4A168f8D4ee67c121D11c9",
        icon: "/swap/tusd.png"
      }
    ]
  },
  {
    chainId: 137,
    name: "Polygon",
    tokens: [
      {
        symbol: "USDT",
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        icon: "/swap/usdt.svg"
      },
      {
        symbol: "USDC",
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        icon: "/swap/usdc.png"
      },
      {
        symbol: "WETH",
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        icon: "/swap/eth.png"
      },
      {
        symbol: "DAI",
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        icon: "/swap/dai.png"
      },
      {
        symbol: "QUICK",
        address: "0xb5c064f955d8e7f38fe0460c556a72987494ee17",
        icon: "/swap/quick.png"
      },
      {
        symbol: "AAVE",
        address: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
        icon: "/swap/aave.png"
      },
      {
        symbol: "SAND",
        address: "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
        icon: "/swap/sand.png"
      }
    ]
  },
  {
    chainId: 42161,
    name: "Arbitrum",
    tokens: [
      {
        symbol: "ARB",
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        icon: "/swap/arb.png"
      },
      {
        symbol: "USDT",
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        icon: "/swap/usdt.svg"
      },
      {
        symbol: "USDC",
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        icon: "/swap/usdc.png"
      },
      {
        symbol: "ETH",
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        icon: "/swap/eth.png"
      },
      {
        symbol: "GMX",
        address: "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
        icon: "/swap/gmx.png"
      }
    ]
  },
  {
    chainId: 8453,
    name: "Base",
    tokens: [
      {
        symbol: "USDC",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        icon: "/swap/usdc.png"
      },
      {
        symbol: "ETH",
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        icon: "/swap/eth.png"
      },
      {
        symbol: "cbBTC",
        address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
        icon: "/swap/cb-btc.png"
      },
      {
        symbol: "AERO",
        address: "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
        icon: "/swap/aero.png"
      }
    ]
  },
  // {
  //   chainId: 146,
  //   name: "Sonic",
  //   tokens: [
  //     {
  //       symbol: "USDC",
  //       address: "0x29219dd400f2bf60e5a23d13be72b486d4038894",
  //       icon: "/swap/usdc.png"
  //     }
  //   ]
  // },
  {
    chainId: 10,
    name: "Optimism",
    tokens: [
      {
        symbol: "USDC",
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        icon: "/swap/usdc.png"
      },
      {
        symbol: "USDT",
        address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
        icon: "/swap/usdt.svg"
      },
      {
        symbol: "OP",
        address: "0x4200000000000000000000000000000000000042",
        icon: "/swap/op.png"
      }
    ]
  }
]

export const Swap = () => {
  const [openCurrency1, setOpenCurrency1] = useState(false)
  const [openCurrency2, setOpenCurrency2] = useState(false)
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [fromAmountUsd, setFromAmountUsd] = useState<string>("");
  const [toAmountUsd, setToAmountUsd] = useState<string>("");
  const [fromWeiAmount, setFromWeiAmount] = useState<string>("");
  const [toWeiAmount, setToWeiAmount] = useState<string>("");
  const [fromChainId, setFromChainId] = useState<number>(0)
  const [toChainId, setToChainId] = useState<number>(0)
  const [token, setToken] = useState<{ symbol: string, address: string, icon: string }>();
  const [toToken, setToToken] = useState<{ symbol: string, address: string, icon: string }>();
  const [openModal, setOpenModal] = useState(false)
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null)
  const [openNetwork1, setOpenNetwork1] = useState(false)
  const [openNetwork2, setOpenNetwork2] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const conversionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const authToken = useWalletStore((state) => state.authToken)
  const wallet = useWalletStore((state) => state.wallet)

  const { prepareAndSign } = useSwap(authToken as string)

  const handleSwapConvertion = (amount: string) => {
    const token1 = token?.symbol
    const token2 = toToken?.symbol

    if (!token1 || !token2) return;

    setIsLoading(true)

    try {

      if (conversionTimeoutRef.current) {
        clearTimeout(conversionTimeoutRef.current)
      }

      conversionTimeoutRef.current = setTimeout(async () => {
        const response: QuoteResponse = await SwapService.getQuote(authToken as string, fromChainId, toChainId, token?.address as string, toToken?.address as string, amount)

        if (response) {
          const toAmountConverted = Number(response.quote.estimatedReceiveAmount) / 10 ** 18
          const toAmountFixed = toAmountConverted > 1 ? toAmountConverted.toFixed(2) : toAmountConverted.toFixed(18)

          setFromAmount(response.quote.amountHuman);
          setFromWeiAmount(response.quote.amount);
          setFromAmountUsd(response.quote.amountUsd);
          setToAmount(toAmountFixed);
          setToWeiAmount(response.quote.estimatedReceiveAmount);
          setToAmountUsd(response.quote.estimatedReceiveAmountUsd);
        }
      }, 500);
    }
    catch (error) {
      console.log(error)
      console.error(new Error('Failed to get quote'))
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (isLoading) return

    if (!fromAmount || !toAmount || !fromWeiAmount || !toWeiAmount || !token || !toToken || !fromChainId || !toChainId) return

    setOpenModal(false)
    setIsLoading(true)

    try {
      const response = await prepareAndSign({
        fromChainId: fromChainId,
        toChainId: toChainId,
        fromToken: token?.address as string,
        toToken: toToken?.address as string,
        amountWei: fromWeiAmount,
        receiver: wallet as string,
      })

      if (response) {
        toast('Swap has been successfully executed', {
          duration: 3000,
        })
      } else {
        toast('Swap has been failed', {
          duration: 3000,
        })
      }
    }
    catch (error) {
      console.log(error)
      toast('Swap has been failed', {
        duration: 3000,
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSwitchChain = () => {
    const tempChainId = fromChainId
    const tempToken = token

    setFromChainId(toChainId)
    setToChainId(tempChainId)
    setToken(toToken)
    setToToken(tempToken)
  }

  useEffect(() => {
    if (fromChainId && toChainId && token && toToken) {
      handleSwapConvertion(fromAmount)
    }
  }, [fromChainId, toChainId, token, toToken])

  useEffect(() => {
    return () => {
      if (conversionTimeoutRef.current) {
        clearTimeout(conversionTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div>
      <h1 className="w-fit ml-2 text-2xl text-muted-foreground font-regular">Liquid Swap</h1>
      <div className="mt-6 p-4 bg-backgroundPrimary shadow-[0_0_36.5px_10px_rgba(0,0,0,0.25)] rounded-lg">
        <div className="relative flex flex-col">
          <div className="flex flex-col gap-4 border rounded-lg border-[#4C4C4C] p-4">
            <h2 className="text-lg text-gray-400">Sell</h2>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={fromAmount}
                    onChange={(e) => {
                      const regex = /^[0-9]*\.?[0-9]*$/;

                      if (e.target.value === "" || regex.test(e.target.value)) {
                        setActiveField("from");
                        setFromAmount(e.target.value);
                        handleSwapConvertion(e.target.value);
                      }
                    }}
                    onFocus={() => setActiveField("from")}
                    type="text"
                    className="h-fit !text-[42px] outline-gray-400 !outline-none border-none rounded-lg"
                    placeholder="" />
                </div>
                <span>{fromAmountUsd} USD</span>
              </div>
              <Popover open={openNetwork1} onOpenChange={setOpenNetwork1}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openNetwork1}
                    className="w-fit p-2 rounded-[30px] border-[1px] bg-backgroundPrimary border-solid border-[#4C4C4C] hover:bg-backgroundPrimary hover:text-white"
                  >
                    {fromChainId
                      ? <>
                        <span>{networks.find((n) => n.chainId === fromChainId)?.name}</span>
                      </>
                      : "Select a network"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-backgroundPrimary text-white border-solid border-[#4C4C4C]">
                  <Command className="bg-backgroundPrimary border-none outline-none text-white">
                    <CommandInput placeholder="Search token..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No network found.</CommandEmpty>
                      <CommandGroup className="text-white">
                        {networks.map((n) => (
                          <CommandItem
                            key={n.chainId}
                            value={n.name}
                            onSelect={() => {
                              setFromChainId(n.chainId)
                              setOpenNetwork1(false)
                              setToken(undefined)
                            }}
                          >
                            {n.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                fromChainId === n.chainId ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Popover open={openCurrency1} onOpenChange={setOpenCurrency1}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCurrency1}
                    className="w-fit p-2 rounded-[30px] border-[1px] bg-backgroundPrimary border-solid border-[#4C4C4C] hover:bg-backgroundPrimary hover:text-white"
                  >
                    {token
                      ? <>
                        <img
                          src={token.icon}
                          alt={token.symbol}
                          width={24}
                          height={24}
                        />
                        <span>{token.symbol}</span>
                      </>
                      : "Select token"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-backgroundPrimary text-white border-solid border-[#4C4C4C]">
                  <Command className="bg-backgroundPrimary border-none outline-none text-white">
                    <CommandInput placeholder="Search token..." className="h-9" />
                    <CommandList>
                      {fromChainId ? (
                        <CommandEmpty>No token found.</CommandEmpty>
                      ) : (
                        <CommandEmpty>Select a chain first.</CommandEmpty>
                      )}
                      {
                        fromChainId > 0 && (
                          <CommandGroup className="text-white">
                            {networks.find((n) => n.chainId === fromChainId)?.tokens.map((t) => (
                              <CommandItem
                                key={t.address}
                                value={t.symbol}
                                onSelect={() => {
                                  setToken(t)
                                  setOpenCurrency1(false)
                                }}
                              >
                                <img
                                  src={t.icon}
                                  alt={t.symbol}
                                  width={24}
                                  height={24}
                                />
                                {t.symbol}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    token?.address === t.address ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )
                      }
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <IconButton
              disabled={isLoading}
              onClick={() => handleSwitchChain()}
              className="h-[56px] w-[56px] bg-backgroundSecondary hover:bg-backgroundPrimary hover:opacity-85 border border-[3px] border-backgroundPrimary rounded-[12px]" aria-label="Start">
              <FaArrowDown className="w-6 h-6 text-white" />
            </IconButton>
          </div>
          <div className="p-4 flex flex-col gap-4 bg-[#202020] rounded-lg">
            <h2 className="text-lg text-gray-400">Buy</h2>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="w-full flex items-center gap-2">
                  <span
                    className={`h-fit outline-gray-400 !outline-none border-none rounded-lg ${toAmount.length > 5 ? '!text-[32px]' : '!text-[42px]'}`}
                  >
                    {toAmount}
                  </span>
                </div>
                <span>{toAmountUsd} USD</span>
              </div>
              <div className="flex items-center gap-2">
                <Popover open={openNetwork2} onOpenChange={setOpenNetwork2}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openNetwork2}
                      className="w-fit p-2 rounded-[30px] border-[1px] bg-backgroundPrimary border-solid border-[#4C4C4C] hover:bg-backgroundPrimary hover:text-white"
                    >
                      {toChainId
                        ? <>
                          <span>{networks.find((n) => n.chainId === toChainId)?.name}</span>
                        </>
                        : "Select a network"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 bg-backgroundPrimary text-white border-solid border-[#4C4C4C]">
                    <Command className="bg-backgroundPrimary border-none outline-none text-white">
                      <CommandInput placeholder="Search token..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No network found.</CommandEmpty>
                        <CommandGroup className="text-white">
                          {networks.map((n) => (
                            <CommandItem
                              key={n.chainId}
                              value={n.name}
                              onSelect={() => {
                                setToChainId(n.chainId)
                                setOpenNetwork2(false)
                                setToToken(undefined)
                              }}
                            >
                              {n.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  toChainId === n.chainId ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover open={openCurrency2} onOpenChange={setOpenCurrency2}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCurrency2}
                      className="w-fit rounded-[30px] bg-[#00FDFF] data-[state=placeholder]:text-[#000000] text-[#000000] hover:bg-[#00FDFF]"
                    >
                      {toToken
                        ? <>
                          <img
                            src={toToken.icon}
                            alt={toToken.symbol}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span>{toToken.symbol}</span>
                        </>
                        : "Select token"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 bg-backgroundPrimary text-white border-solid border-[#4C4C4C]">
                    <Command className="bg-backgroundPrimary border-none outline-none text-white">
                      <CommandInput placeholder="Search token..." className="h-9" />
                      <CommandList>
                        {toChainId ? (
                          <CommandEmpty>No token found.</CommandEmpty>
                        ) : (
                          <CommandEmpty>Select a chain first.</CommandEmpty>
                        )}
                        {
                          toChainId > 0 && (
                            <CommandGroup className="text-white">
                              {networks.find((n) => n.chainId === toChainId)?.tokens.map((t) => (
                                <CommandItem
                                  key={t.address}
                                  value={t.symbol}
                                  onSelect={() => {
                                    setToToken(t)
                                    setOpenCurrency2(false)
                                  }}
                                >
                                  <img
                                    src={t.icon}
                                    alt={t.symbol}
                                    width={24}
                                    height={24}
                                  />
                                  {t.symbol}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      toToken?.address === t.address ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )
                        }
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setOpenModal(true)}
          className="w-full h-[56px] mt-6 bg-[#5DD2D480] hover:bg-[#5DD2D460] rounded-[30px]">Start</Button>
      </div>
      <Dialog
        open={openModal}
        maxWidth="sm"
        fullWidth
        onClose={() => setOpenModal(false)}
      >
        <DialogTitle className="flex text-white bg-backgroundPrimary justify-between items-center py-6 px-8">
          SWAP
        </DialogTitle>
        <DialogContent className='bg-backgroundPrimary py-8 px-8'>
          <div className="flex flex-col gap-6 text-white">
            <p className="text-gray-200 leading-relaxed">
              You are about to swap. This action is irreversible.
            </p>
            <div className="flex justify-end gap-8 mt-4">
              <Button
                disabled={isLoading}
                onClick={() => handleSubmit()}
                variant="default"
                className=" bg-[#5DD2D480] hover:bg-[#5DD2D460] text-white font-medium px-8 py-3 rounded-lg text-sm"
              >
                Proceed
              </Button>
              <Button
                onClick={() => setOpenModal(false)}
                variant="default"
                className="bg-transparent text-white border border-[#4C4C4C] font-medium px-8 py-3 rounded-lg text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}