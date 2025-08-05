'use client'

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { IconButton } from "@chakra-ui/react"
import { FaArrowDown } from "react-icons/fa6";

const tokens = [
  {
    name: "AVAX",
    icon: "/swap/avax.png"
  },
  {
    name: "ETH",
    icon: "/swap/eth.png"
  },
  {
    name: "BTC",
    icon: "/swap/btc.png"
  }
]

export const Swap = () => {
  const [fromAmount, setFromAmount] = useState(1500);
  const [toAmount, setToAmount] = useState(1500);
  const [token, setToken] = useState("ETH");
  const [toToken, setToToken] = useState("");

  return (
    <div>
      <h1 className="w-fit ml-2 text-2xl text-muted-foreground font-regular">Liquid Swap</h1>
      <div className="mt-6 p-4 bg-backgroundPrimary shadow-[0_0_36.5px_10px_rgba(0,0,0,0.25)] rounded-lg">
        <div className="relative flex flex-col">
          <div className="flex flex-col gap-4 border rounded-lg border-[#4C4C4C] p-4">
            <h2 className="text-lg text-gray-400">Sell</h2>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Input
                  value={fromAmount}
                  onChange={(e) => setFromAmount(Number(e.target.value))}
                  type="number"
                  className={`max-w-[150px] w-fit h-fit !text-[42px] outline-gray-400 !outline-none border-none rounded-lg`}
                  placeholder="Enter amount" />
                <span className="text-gray-400">wei</span>
              </div>
              <SelectGroup>
                <Select value={token} onValueChange={setToken}>
                  <SelectTrigger className="w-fit p-2 rounded-[30px] border-[1px] border-solid border-[#4C4C4C]">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] text-white ">
                    {tokens.map((token) => (
                      <SelectItem key={token.name} value={token.name}>
                        <div className="flex items-center gap-2">
                          <img
                            src={token.icon}
                            alt={token.name}
                            width={24}
                            height={24}
                          />
                          <span>{token.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SelectGroup>
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
              <div className="flex items-center gap-2">
                <Input
                  value={toAmount}
                  onChange={(e) => setToAmount(Number(e.target.value))}
                  type="number"
                  className="max-w-[150px] w-fit h-fit !text-[42px] outline-gray-400 !outline-none border-none rounded-lg"
                  placeholder="Enter amount" />
                  <span className="text-gray-400">wei</span>
              </div>
              <SelectGroup>
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-fit rounded-[30px] bg-[#00FDFF] data-[state=placeholder]:text-[#000000] text-[#000000]">
                    <SelectValue placeholder="Select token" className="placeholder:text-[#000000]" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#00FDFF] text-[#000000]">
                    {tokens.map((token) => (
                      <SelectItem key={token.name} value={token.name} className="focus:bg-[#00000025]">
                        <div className="flex items-center gap-2">
                          <img
                            src={token.icon}
                            alt={token.name}
                            width={24}
                            height={24}
                          />
                          <span>{token.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SelectGroup>
            </div>
          </div>
        </div>
        <Button className="w-full h-[56px] mt-6 bg-[#5DD2D480] hover:bg-[#5DD2D460] rounded-[30px]">Start</Button>
      </div>
    </div>
  )
}