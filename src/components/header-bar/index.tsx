"use client"

import React, { FC, useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation'
import Image from "next/image";

import classes from "./index.module.css";

import { ChevronDown, ChevronUp } from "lucide-react";
import { IoHomeOutline } from "react-icons/io5";

import { Box, HStack, Button, Spacer, IconButton } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ConnectButton as ConnectButton2 } from "thirdweb/react"
import { CDPWallets } from "@/modules/ai-agents/components/cdp-wallets";
import { useChatStore } from "@/store/chat";
import { useWallet, wallets, client } from "@/hook/use-wallet"
import { Notification } from "./notifcation";

export const HeaderBar: FC = () => {
  const pathname = usePathname()
  const [walletType, setWalletType] = useState<"cdp" | "metamask">("metamask");
  const [showMenu, setShowMenu] = useState(false)
  const { handleConnect, handleDisconnect } = useWallet()
  const resetChat = useChatStore((state) => state.setResetChat)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  const isAiAgentsPage = pathname.includes('/ai-agents')

  const handleHome = () => {
    resetChat(true)
    router.push('/ai-agents')
  };

  const handleNavigate = (path: string) => {
    router.push(path)
    setShowMenu(false)
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Box className={classes.headerBar}>
      <HStack spacing={4} width="100%" px={4}>
        <Box >
          {/* <ArrowBackIcon 
            color="gray.200" 
            cursor="pointer" 
            onClick={handleBack}
          /> */}
        </Box>
        <Box className={classes.logo} flexShrink={0} display="flex" alignItems="center" onClick={handleHome}>
          <a>
            <img src="/assets/logo.png" alt="logo" width={40} height={40} />
          </a>
          <img src="/assets/logo-text.png" alt="logo" width={100} height={40} />
        </Box>
        <Spacer />
        <HStack spacing={4} width="fit-content">
          <div ref={menuRef} className="relative flex items-center flex-col">
            <Button variant="ghost" className="p-0 hover:bg-transparent text-muted-foreground hover:text-white font-normal" onClick={() => setShowMenu(!showMenu)}>
              <span>Explore</span>
              {
                showMenu ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )
              }
            </Button>
            <ul className={showMenu ? "absolute flex flex-col gap-4 w-40 text-center top-10 text-muted-foreground bg-backgroundPrimary border border-[0.5px] border-[#FFFFFF8F] rounded-[19px] p-4 z-10" : "hidden"}>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigate('/ai-agents')}>AI Agents</li>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigate('/wallet-tracking')}>Wallet Tracking</li>
              {/* <li className="cursor-pointer hover:text-white" onClick={() => handleNavigate('/liquid-swap')}>Liquid Swap</li> */}
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigate('/x-ai-agents')}>X AI Agents</li>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigate('/pano-view/avax')}>Pano-View</li>
            </ul>
          </div>
          <a href="https://docs.panoramablock.com" className="text-muted-foreground hover:text-white" target="_blank" rel="noopener noreferrer">
            <span>Docs</span>
          </a>
          {/* <a href="https://panorama.xyz/ai-agents/feedback" className="text-muted-foreground hover:text-white" target="_blank" rel="noopener noreferrer">
            <span>Feedback</span>
          </a> */}
        </HStack>
        <HStack spacing={4} flexShrink={0}>
          <IconButton
            aria-label="Send"
            onClick={handleHome}
            variant="outline"
            bgColor="transparent"
            borderRadius="full"
            color="white"
            _hover={{
              bgColor: "transparent",
              color: "grey",
            }}
            height={"48px"}
            width={"48px"}
            border="1px solid grey"
            icon={<IoHomeOutline size={24} />}
          />
          <Notification />
          {
            isAiAgentsPage ? (
              walletType === "cdp" ? <CDPWallets /> : <ConnectButton label="Connect Wallet" />
            ) : (
              <ConnectButton2 client={client} wallets={wallets} onConnect={handleConnect} onDisconnect={handleDisconnect} />
            )
          }

          {/* Wallet Selection */}
          {/* <ButtonGroup isAttached>
            <Button
              onClick={() => setWalletType("cdp")}
              bg={walletType === "cdp" ? "#56DBE0" : "ghost"}
              color={walletType === "cdp" ? "black" : "white"}
              sx={{
                "&:hover": {
                  transform: "none",
                  backgroundColor: "#63DAE0",
                  color: "black",
                },
                backgroundColor: walletType === "cdp" ? undefined : "gray.700",
              }}
            >
              CDP Managed Wallets
            </Button>
            <Button
              onClick={() => setWalletType("metamask")}
              bg={walletType === "metamask" ? "#56DBE0" : "gray.700"}
              color={walletType === "metamask" ? "black" : "white"}
              sx={{
                "&:hover": {
                  transform: "none",
                  backgroundColor: "#63DAE0",
                  color: "black",
                },
                backgroundColor:
                  walletType === "metamask" ? undefined : "gray.700",
              }}
            >
              Metamask
            </Button>
          </ButtonGroup> */}
        </HStack>
      </HStack>
    </Box>
  );
};
