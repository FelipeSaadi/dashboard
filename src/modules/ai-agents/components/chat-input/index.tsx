"use client"

import React, { FC, useState, useEffect, useRef } from "react";
import {
  Textarea,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  IconButton,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { SendIcon } from "../custom-icon/SendIcon";
import PrefilledOptions from "./PrefilledOptions";
import styles from "./index.module.css";

import { ArrowUp, WalletMinimal, X } from "lucide-react";
import { FaWallet } from "react-icons/fa";
import { FaXTwitter  } from "react-icons/fa6";
import { MdOutlineSwapCalls } from "react-icons/md";
import { IoBarChartSharp } from "react-icons/io5";
import { PiBagSimpleFill } from "react-icons/pi";
import { PiSquaresFourFill } from "react-icons/pi";

import { Features } from "./features";

type Command = {
  command: string;
  description: string;
  name: string;
};

type ChatInputProps = {
  onSubmit: (message: string, file: File | null) => Promise<void>;
  disabled: boolean;
  hasMessages?: boolean;
  isSidebarOpen?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'localhost:8080'

const features = [
  {
    title: "Wallet Tracking",
    icon: <img src="ai-agents/wallet.svg" alt="" />,
    description: "Real-time wallet monitoring",
    url: "/wallet-tracking",
  },
  {
    title: "AI Agents on X",
    icon: <img src="ai-agents/x.svg" alt="" />,
    description: "See what AI agents are saying on X",
    url: "/x-ai-agents"
  },
  {
    title: "Liquid Swap",
    icon: <img src="ai-agents/swap.svg" alt="" />,
    description: "Swap your assets",
    url: "/liquid-swap"
  },
  {
    title: "Pano View",
    icon: <img src="ai-agents/pano-view.svg" alt="" />,
    description: "Unified on-chain analytics",
    url: "/pano-view/avax",
  },
  {
    title: "AI Marketplace",
    icon: <img src="ai-agents/market.svg" alt="" />,
    description: "Coming Soon!",
    // url: "/ai-marketplace",
    url: null
  },
  {
    title: "Portfolio",
    icon: <img src="ai-agents/portfolio.svg" alt="" />,
    description: "View your positions & balance",
    // url: "/portfolio",
    url: null
  },
]

export const ChatInput: FC<ChatInputProps> = ({
  onSubmit,
  disabled,
  hasMessages = false,
  isSidebarOpen = false,
}) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const inputGroupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const commandsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/agents/commands`)
      .then((res) => res.json())
      .then((data) => setCommands(data.commands))
      .catch((error) => console.error("Error fetching commands:", error));
  }, []);

  useEffect(() => {
    if (inputGroupRef.current && message.startsWith("/")) {
      const rect = inputGroupRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top,
        left: rect.left - 400,
        width: rect.width,
      });
    }
  }, [message, showCommands]);

  const filteredCommands = message.startsWith("/")
    ? commands.filter((cmd) =>
        cmd.command.toLowerCase().includes(message.slice(1).toLowerCase())
      )
    : [];

  useEffect(() => {
    setShowCommands(message.startsWith("/") && filteredCommands.length > 0);
    setSelectedCommandIndex(0);
  }, [message, filteredCommands.length]);

  useEffect(() => {
    if (commandsRef.current && showCommands) {
      const selectedElement = commandsRef.current.querySelector(
        `[data-index="${selectedCommandIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }
    }
  }, [selectedCommandIndex, showCommands]);

  const handleCommandSelect = (command: Command) => {
    setMessage(`/${command.command} `);
    setShowCommands(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommands) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedCommandIndex((prev) =>
            Math.min(prev + 1, filteredCommands.length - 1)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedCommandIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Tab":
        case "Enter":
          e.preventDefault();
          handleCommandSelect(filteredCommands[selectedCommandIndex]);
          break;
        case "Escape":
          setShowCommands(false);
          break;
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const agentSupportsFileUploads = true;

  const handleSubmit = async () => {
    if (!message && !file) return;
    await onSubmit(message, file);
    setMessage("");
    setFile(null);
  };

  const handlePrefilledSelect = async (selectedMessage: string) => {
    await onSubmit(selectedMessage, null);
  };

  return (
    <>
      {showCommands && (
        <Box
          ref={commandsRef}
          position="fixed"
          top={`${dropdownPosition.top - 210}px`}
          left={`${dropdownPosition.left}px`}
          right={0}
          mx="auto"
          width={`${dropdownPosition.width}px`}
          bg="var(--background-secondary)"
          borderRadius="8px"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
          maxH="200px"
          overflowY="auto"
          border="1px solid #454945"
          zIndex={1000}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#2A2E2A",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#454945",
              borderRadius: "4px",
            },
          }}
        >
          <VStack spacing={0} align="stretch">
            {filteredCommands.map((cmd, index) => (
              <Box
                key={cmd.command}
                data-index={index}
                px={4}
                py={3}
                bg={index === selectedCommandIndex ? "#454945" : "transparent"}
                _hover={{ bg: "#404540" }}
                cursor="pointer"
                onClick={() => handleCommandSelect(cmd)}
                transition="background-color 0.2s"
                borderBottom="1px solid #454945"
                _last={{ borderBottom: "none" }}
              >
                <Text fontWeight="bold" fontSize="sm" color="#59f886">
                  /{cmd.command}
                </Text>
                <Text fontSize="xs" color="#A0A0A0">
                  {cmd.name} - {cmd.description}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      <div className={`${styles.container} ${hasMessages ? "" : styles.noMessages}`}>
        {!hasMessages && (
          <Features features={features} />
        )}
        <div className={styles.flexContainer}>
          <InputGroup ref={inputGroupRef} className={styles.inputGroup}>
            {agentSupportsFileUploads && (
              <InputLeftAddon className={styles.fileAddon}>
                <input
                  type="file"
                  className={styles.hiddenInput}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <IconButton
                  aria-label="Attach file"
                  icon={<AttachmentIcon />}
                  className={disabled ? styles.disabledIcon : ""}
                  disabled={disabled}
                  onClick={() =>
                    document
                      .querySelector('input[type="file"]')
                      ?.dispatchEvent(new MouseEvent("click"))
                  }
                />
              </InputLeftAddon>
            )}
            <Textarea
              ref={inputRef}
              className={styles.messageInput}
              onKeyDown={handleKeyDown}
              disabled={disabled || file !== null}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type / for commands or enter your message..."
              rows={1}
              resize="none"
              overflow="hidden"
              minHeight="unset"
            />
            <InputRightAddon className={styles.rightAddon}>
              <IconButton
                className={styles.sendButton}
                disabled={disabled}
                aria-label="Send"
                onClick={handleSubmit}
                icon={<ArrowUp width="24px" height="24px" />}
              />
            </InputRightAddon>
          </InputGroup>
        </div>
      </div>
    </>
  );
};
