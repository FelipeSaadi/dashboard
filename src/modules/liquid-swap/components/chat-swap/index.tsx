'use client'

import { useState } from "react"

import { Check, ChevronsUpDown } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Button } from "@/components/ui/button"
import { IconButton } from "@chakra-ui/react"
import { FaArrowDown } from "react-icons/fa6"

import { toast } from "sonner"

import { cn } from "@/lib/utils"
import SwapService from "@/lib/api/services/swap"
import { useWalletStore } from "@/store/wallet"
import { useActiveWallet } from "thirdweb/react"
import { getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb"
import type { Abi } from "viem"

import { useAvaxSwapContract } from "@/hook/use-swap"

interface Token {
  chainId: number;
  symbol: string;
  address: string;
  icon: string;
}

const tokens: Token[] = [
  {
    chainId: 43114,
    symbol: "AVAX",
    address: "0x0000000000000000000000000000000000000000",
    icon: "/swap/c-chain/avax.png"
  },
  {
    chainId: 43114,
    symbol: "USDC (AVAX)",
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    icon: "/swap/usdc.png"
  },
  {
    chainId: 43114,
    symbol: "USDT (AVAX)",
    address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    icon: "/swap/usdt.svg"
  },
  {
    chainId: 43114,
    symbol: "WAVAX",
    address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    icon: "/swap/c-chain/wavax.png"
  },
  {
    chainId: 43114,
    symbol: "WETH.e",
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    icon: "/swap/eth.png"
  },
  {
    chainId: 1,
    symbol: "WETH (ETH)",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    icon: "/swap/eth.png"
  },
  {
    chainId: 56,
    symbol: "USDC (BNB)",
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    icon: "/swap/usdc.png"
  },
  {
    chainId: 1,
    symbol: "USDC (ETH)",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    icon: "/swap/usdc.png"
  },
  {
    chainId: 43114,
    symbol: "WBTC.e",
    address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
    icon: "/swap/wbtc.png"
  },
  {
    chainId: 43114,
    symbol: "DAI.e",
    address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
    icon: "/swap/c-chain/dai.png"
  },
  {
    chainId: 43114,
    symbol: "Joe",
    address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
    icon: "/swap/c-chain/trader-joe.png"
  },
  {
    chainId: 43114,
    symbol: "PNG",
    address: "0x60781C2586D68229fde47564546784ab3fACA982",
    icon: "/swap/c-chain/pangolin.png"
  },
  {
    chainId: 43114,
    symbol: "Link.e",
    address: "0x5947BB275c521040051D82396192181b413227A3",
    icon: "/swap/c-chain/chainlink.png"
  },
  {
    chainId: 43114,
    symbol: "QI",
    address: "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5",
    icon: "/swap/c-chain/benqi.png"
  },
  {
    chainId: 43114,
    symbol: "AAVE.e",
    address: "0x63a72806098Bd3D9520cC43356dD78afe5D386D9",
    icon: "/swap/c-chain/aave.png"
  },
  {
    chainId: 43114,
    symbol: "UNI.e",
    address: "0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580",
    icon: "/swap/c-chain/uniswap.png"
  },
  {
    chainId: 43114,
    symbol: "SUSHI.e",
    address: "0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76",
    icon: "/swap/c-chain/sushiswap.png"
  },
  {
    chainId: 43114,
    symbol: "YAK",
    address: "0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7",
    icon: "/swap/c-chain/yieldyak.png"
  }
]

export const ChatSwap = () => {
  const [openCurrency1, setOpenCurrency1] = useState(false)
  const [openCurrency2, setOpenCurrency2] = useState(false)
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [token, setToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [openModal, setOpenModal] = useState(false)
  
  const authToken = useWalletStore((state) => state.authToken)
  const activeWallet = useActiveWallet();
  console.log("activeWallet", activeWallet)
  console.log("authToken", authToken)

  const CONTRACT_ADDRESS = '0xcAeFEc77F848504C2559801180d8284B5dBcD86E'
  const { swap } = useAvaxSwapContract(CONTRACT_ADDRESS)

  const handleSwapConvertion = (amount: string, isFromAmount: boolean) => {
    const token1 = tokens.find((t) => t.address === token)
    const token2 = tokens.find((t) => t.address === toToken)

    if ((token1?.symbol === "USDC (AVAX)" && token2?.symbol === "WETH (ETH)") 
      || (token1?.symbol === "WETH (ETH)" && token2?.symbol === "USDC (AVAX)")
      || (token1?.symbol === "USDC (AVAX)" && token2?.symbol === "USDC (BNB)")
      || (token1?.symbol === "USDC (BNB)" && token2?.symbol === "USDC (AVAX)")
      || (token1?.symbol === "USDC (AVAX)" && token2?.symbol === "USDC (ETH)")
      || (token1?.symbol === "USDC (ETH)" && token2?.symbol === "USDC (AVAX)")
    ) {
      const usdcPrice = 1;
      const wethPrice = 3580.17;

      const numericAmount = amount ? parseFloat(amount) : undefined;

      if (numericAmount === undefined || numericAmount === 0) {
        if (isFromAmount && toAmount !== "") {
          amount = toAmount;
          isFromAmount = false;
        } else if (!isFromAmount && fromAmount !== "") {
          amount = fromAmount;
          isFromAmount = true;
        } else {
          return;
        }
      }

      const amountValue = parseFloat(amount);

      if (isFromAmount) {
        if (token1?.symbol === "USDC (AVAX)" && token2?.symbol === "WETH (ETH)") {
          const convertedAmount = (amountValue * usdcPrice) / wethPrice;
          setToAmount(convertedAmount.toFixed(6));
        } else if (token1?.symbol === "WETH (ETH)" && token2?.symbol === "USDC (AVAX)") {
          const convertedAmount = (amountValue * wethPrice) / usdcPrice;
          setToAmount(convertedAmount.toFixed(6));
        } else if (token1?.symbol === "USDC (AVAX)" && token2?.symbol === "USDC (BNB)") {
          const convertedAmount = amountValue;
          setToAmount(convertedAmount.toString());
        } else if (token1?.symbol === "USDC (BNB)" && token2?.symbol === "USDC (AVAX)") {
          const convertedAmount = amountValue;
          setToAmount(convertedAmount.toString());
        }
        else if (token1?.symbol === "USDC (AVAX)" && token2?.symbol === "USDC (ETH)") {
          const convertedAmount = amountValue;
          setToAmount(convertedAmount.toString());
        }
        else if (token1?.symbol === "USDC (ETH)" && token2?.symbol === "USDC (AVAX)") {
          const convertedAmount = amountValue;
          setToAmount(convertedAmount.toString());
        }
      } else {
        if (token1?.symbol === "USDC (AVAX)" && token2?.symbol === "WETH (ETH)") {
          const convertedAmount = (amountValue * wethPrice) / usdcPrice;
          setFromAmount(convertedAmount.toFixed(6));
        } else if (token1?.symbol === "WETH (ETH)" && token2?.symbol === "USDC (AVAX)") {
          const convertedAmount = (amountValue * usdcPrice) / wethPrice;
          setFromAmount(convertedAmount.toFixed(6));
        } else if (token1?.symbol === "USDC (AVAX)" && token2?.symbol === "USDC (BNB)") {
          const convertedAmount = amountValue;
          setFromAmount(convertedAmount.toString());
        } else if (token1?.symbol === "USDC (BNB)" && token2?.symbol === "USDC (AVAX)") {
          const convertedAmount = amountValue;
          setFromAmount(convertedAmount.toString());
        } else if (token1?.symbol === "USDC (AVAX)" && token2?.symbol === "USDC (ETH)") {
          const convertedAmount = amountValue;
          setFromAmount(convertedAmount.toString());
        } else if (token1?.symbol === "USDC (ETH)" && token2?.symbol === "USDC (AVAX)") {
          const convertedAmount = amountValue;
          setFromAmount(convertedAmount.toString());
        }
      }
    }
  }

  const handleSubmit = async () => {
    setOpenModal(false)

    const token1 = tokens.find((t) => t.address === token)
    const token2 = tokens.find((t) => t.address === toToken)
    console.log("token1, token2", token1, token2)

    if (!authToken) {
      toast('You need to be authenticated to perform a swap', { duration: 3000 })
      return
    }

    if (!token1 || !token2) {
      toast('Select both tokens before swapping', { duration: 3000 })
      return
    }

    const amountStr = fromAmount?.trim()
    if (!amountStr) {
      toast('Enter an amount to swap', { duration: 3000 })
      return
    }

    if (!activeWallet) {
      toast('You need to be connected to a wallet to perform a swap', { duration: 3000 })
      return
    }

    try {
      const account = activeWallet.getAccount()
      const walletAddress = account?.address
      console.log("account", account)
      console.log("walletAddress", walletAddress)

      if (!walletAddress) {
        toast('You need to be connected to a wallet to perform a swap', { duration: 3000 })
        return
      }
      const pair = getPairString(token1, token2)
      if (!pair) {
        toast('This token pair is not supported for swapping', { duration: 3000 })
        return
      }
      const swapInput = {
        pair,
        tokenA: token1.address as `0x${string}`,
        amountInWei: BigInt(Math.floor(parseFloat(amountStr) * 1e6)), // assuming 6 decimals for USDC
        ensureLastSender: true,
        autoApprove: true
      }
      console.log("swapInput", swapInput)
      await swap(swapInput)
      toast('Swap executed successfully', { duration: 3000 })
    }
    catch (error) {
      console.log(error)
      toast('Swap has been failed', { duration: 3000 })
    }
  }

  const executeContractSwap = async (token1: Token, token2: Token, amountStr: string, walletAddress: string) => {
    try {
      const swapContractABI = [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_pair",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
            }
          ],
          "name": "makeSwap",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "amountOut",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_pair",
              "type": "string"
            }
          ],
          "name": "getMediumPrice",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "tokenA",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tokenB",
              "type": "address"
            }
          ],
          "name": "getPriceInUniswap",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "tokenA",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tokenB",
              "type": "address"
            }
          ],
          "name": "getPriceInPangolin",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_pair",
              "type": "string"
            }
          ],
          "name": "getTokenAddresses",
          "outputs": [
            {
              "internalType": "address",
              "name": "tokenA",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tokenB",
              "type": "address"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "balance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "feeds",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "pair",
                  "type": "string"
                },
                {
                  "internalType": "contract AggregatorV3Interface",
                  "name": "feed",
                  "type": "address"
                }
              ],
              "internalType": "struct Swap.PriceFeedInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "lastSender",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        },
        {
          "stateMutability": "payable",
          "type": "fallback"
        }
      ] as const satisfies Abi
      const account = activeWallet?.getAccount()
      if (!account) {
        throw new Error("No wallet account found")
      }
      const contractAddress = "0xcAeFEc77F848504C2559801180d8284B5dBcD86E"

    } catch(error) {
      console.error('Swap failed:', error)
      toast('Swap has been failed', { duration: 3000 })
      throw error
    }
  }

  // Helper function to determine the pair string
const getPairString = (token1: Token, token2: Token): string | null => {
  // Map your tokens to the supported pairs in your contract
  const supportedPairs = {
    "AVAX/USD": ["AVAX", "USDC (AVAX)"],
    "BTC/USD": ["WBTC.e", "USDC (AVAX)"],
    "ETH/USD": ["WETH.e", "USDC (AVAX)"],
    "USDC/USD": ["USDC (AVAX)", "USDC (AVAX)"],
    "USDT/USD": ["USDT (AVAX)", "USDC (AVAX)"],
    "DAI/USD": ["DAI.e", "USDC (AVAX)"],
    "LINK/USD": ["Link.e", "USDC (AVAX)"]
  }

  for (const [pair, [t1, t2]] of Object.entries(supportedPairs)) {
    if ((token1.symbol === t1 && token2.symbol === t2) || 
        (token1.symbol === t2 && token2.symbol === t1)) {
      return pair
    }
  }
  
  return null
}

  const convertToUSD = (token: string, amount: string) => {
    const tokenInfo = tokens.find((t) => t.address === token)

    if (tokenInfo?.symbol === "AVAX") {
      return `${(parseFloat(amount) * 21.66).toFixed(2)} USD`
    }
    else if (tokenInfo?.symbol === "USDC (AVAX)") {
      return `${parseFloat(amount)} USD`
    }
    else if (tokenInfo?.symbol === "USDC (BNB)") {
      return `${parseFloat(amount)} USD`
    }
    else if (tokenInfo?.symbol === "WETH.e") {
      return `${(parseFloat(amount) * 3580.17).toFixed(2)} USD`
    }
    else {
      return `USD`
    }
  }

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

                      if (e.target.value === "") {
                        setFromAmount("")
                      } else if (regex.test(e.target.value)) {
                        setFromAmount(e.target.value)
                        handleSwapConvertion(e.target.value, true)
                      }
                    }}
                    type="text"
                    className="h-fit !text-[42px] outline-gray-400 !outline-none border-none rounded-lg"
                    placeholder="" />
                </div>
                <span>{convertToUSD(token, fromAmount)}</span>
              </div>
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
                          src={tokens.find((t) => t.address === token)?.icon}
                          alt={tokens.find((t) => t.address === token)?.symbol}
                          width={24}
                          height={24}
                        />
                        <span>{tokens.find((t) => t.address === token)?.symbol}</span>
                      </>
                      : "Select token"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-backgroundPrimary text-white border-solid border-[#4C4C4C]">
                  <Command className="bg-backgroundPrimary border-none outline-none text-white">
                    <CommandInput placeholder="Search token..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No token found.</CommandEmpty>
                      <CommandGroup className="text-white">
                        {/* using chainId filter because this swap works only on avalanche */}
                        {tokens.filter((t) => t.chainId === 43114).map((t) => (
                          <CommandItem
                            key={t.address}
                            value={t.symbol}
                            onSelect={() => {
                              setToken(t.address)
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
                                token === t.symbol ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <IconButton className="h-[56px] w-[56px] bg-backgroundSecondary hover:bg-backgroundPrimary hover:opacity-85 border border-[3px] border-backgroundPrimary rounded-[12px]" aria-label="Start">
              <FaArrowDown className="w-6 h-6 text-white" />
            </IconButton>
          </div>
          <div className="p-4 flex flex-col gap-4 bg-[#202020] rounded-lg">
            <h2 className="text-lg text-gray-400">Buy</h2>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={toAmount}
                    onChange={(e) => {
                      const regex = /^[0-9]*\.?[0-9]*$/;

                      if (e.target.value === "") {
                        setToAmount("")
                      } else if (regex.test(e.target.value)) {
                        setToAmount(e.target.value)
                        handleSwapConvertion(e.target.value, false)
                      }
                    }}
                    type="text"
                    className="h-fit !text-[42px] outline-gray-400 !outline-none border-none rounded-lg"
                    placeholder="" />
                </div>
                <span>{convertToUSD(toToken, toAmount)}</span>
              </div>
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
                          src={tokens.find((t) => t.address === toToken)?.icon}
                          alt={tokens.find((t) => t.address === toToken)?.symbol}
                          width={24}
                          height={24}
                        />
                        <span>{tokens.find((t) => t.address === toToken)?.symbol}</span>
                      </>
                      : "Select token"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-backgroundPrimary text-white border-solid border-[#4C4C4C]">
                  <Command className="bg-backgroundPrimary border-none outline-none text-white">
                    <CommandInput placeholder="Search token..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No token found.</CommandEmpty>
                      <CommandGroup className="text-white">
                        {tokens.map((t) => (
                          <CommandItem
                            key={t.address}
                            value={t.symbol}
                            onSelect={() => {
                              setToToken(t.address)
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
                                toToken === t.symbol ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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