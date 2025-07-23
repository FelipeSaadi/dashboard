"use client"

import React, { FC, useState } from "react";
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { Box, HStack, Spacer, Button, ButtonGroup, Text, IconButton } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CDPWallets } from "@/components/CDPWallets";
import classes from "./index.module.css";
import { IoHomeOutline } from "react-icons/io5";
import { HiMiniBellAlert } from "react-icons/hi2";
import { SettingsButton } from "@/components/Settings";
import { Workflows } from "@/components/Workflows";
import { ApiCredentialsButton } from "@/components/Credentials/Button";
import { useChatStore } from "@/store/chat";

export const HeaderBar: FC = () => {
  const [walletType, setWalletType] = useState<"cdp" | "metamask">("metamask");
  const resetChat = useChatStore((state) => state.setResetChat)
  const router = useRouter()

  const handleHome = () => {
    resetChat(true)
  };

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
        <Box className={classes.logo} flexShrink={0} display="flex" alignItems="center">
          <a>
            <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
          </a>
          <Image src="/assets/logo-text.jpg" alt="logo" width={100} height={40} />
        </Box>
        <Spacer />
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
            border="1px solid grey"
            icon={<IoHomeOutline width="24px" height="24px" />}
          />
          <IconButton
            aria-label="Alert"
            onClick={() => {}}
            variant="outline"
            bgColor="transparent"
            borderRadius="full"
            color="white"
            _hover={{
              bgColor: "transparent",
              color: "grey",
            }}
            border="1px solid grey"
            icon={<HiMiniBellAlert width="24px" height="24px" />}
          />
          <Workflows />
          <ApiCredentialsButton />
          <SettingsButton />
          {walletType === "cdp" ? <CDPWallets /> : <ConnectButton label="Connect Wallet" />}

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
