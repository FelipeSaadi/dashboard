"use client"

import React, { FC, useEffect, useState } from "react";
import { useToast, Select, VStack, Box, Text, Spacer } from "@chakra-ui/react";
import {
  IconTrash,
  IconPencilPlus,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
} from "@tabler/icons-react";
import { getHttpClient } from "@/lib/api/services/constants";
import {
  createNewConversation,
  clearMessagesHistory,
} from "@/lib/api/services/apiHooks";
import styles from "./index.module.css";
import { getUserId } from "@/lib/api/services/userHooks";
import { MessageSquareText } from "lucide-react";
import { TrendingPrompts } from "../trending-prompts";

import { useChatStore } from "@/store/chat";
import { useRouter } from "next/navigation";
import Workflows from "../workflows";
import { SettingsButton } from "../settings";
import { ApiCredentialsButton } from "../credentials/Button";

export type LeftSidebarProps = {
  /** Whether the sidebar is currently open (expanded) or collapsed */
  isSidebarOpen: boolean;
  /** Callback to toggle the sidebar state */
  onToggleSidebar: (open: boolean) => void;

  /** Your existing props for conversation management */
  currentConversationId: string;
  onConversationSelect: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  setCurrentConversationId: (conversationId: string) => void;
};

export const LeftSidebar: FC<LeftSidebarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  currentConversationId,
  onConversationSelect,
  onDeleteConversation,
  setCurrentConversationId,
}) => {
  const [conversations, setConversations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-flash");
  const backendClient = getHttpClient();
  const toast = useToast();
  const router = useRouter()

  const messageToSend = useChatStore((state) => state.messageToSend)
  const readyToSend = useChatStore((state) => state.readyToSend)
  const setIsReadyToSend = useChatStore((state) => state.setIsReadyToSend)
  const resetChat = useChatStore((state) => state.resetChat)
  const setResetChat = useChatStore((state) => state.setResetChat)

  const modelOptions = [{ value: "gemini-flash", label: "Gemini Flash 1.5" }];

  // Decide which icon to show depending on whether the sidebar is open
  const ToggleIcon = isSidebarOpen ? IconChevronLeft : IconChevronRight;

  // Fetch existing conversations from your backend
  const fetchConversations = async () => {
    try {
      const userId = getUserId();
      const response = await getHttpClient().get("/chat/conversations", {
        params: {
          user_id: userId
        }
      });
      const conversationIds: string[] = response.data.conversation_ids;
      // Ensure "default" is always at the top if it exists
      conversationIds.sort((a, b) => {
        if (a === "default") return -1;
        if (b === "default") return 1;
        return a.localeCompare(b);
      });
      setConversations(conversationIds);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch conversations",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Create a new conversation
  const handleCreateNewConversation = async () => {
    setIsLoading(true);
    try {
      const response = await createNewConversation(getHttpClient());
      setConversations(prev => {
        const newConversations = [...prev, response];
        newConversations.sort((a, b) => {
          if (a === "default") return -1;
          if (b === "default") return 1;
          return a.localeCompare(b);
        });
        return newConversations;
      });
      onConversationSelect(response);
      setCurrentConversationId(response);
      toast({
        title: "Success",
        description: "New conversation created",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to create new conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await onDeleteConversation(conversationId);
      await fetchConversations();
      if (conversationId === currentConversationId) {
        onConversationSelect("default");
        setCurrentConversationId("default");
      }
      toast({
        title: "Success",
        description: "Conversation deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClearChatHistory = async () => {
    try {
      await clearMessagesHistory(backendClient);
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear chat history:", error);
    }
  };

  // On mount, fetch conversations
  useEffect(() => {
    const initializeChat = async () => {
      await fetchConversations();
      if (!currentConversationId) {
        onConversationSelect("default");
        setCurrentConversationId("default");
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (messageToSend && !readyToSend) {
      handleCreateNewConversation()
      setTimeout(() => {
        setIsReadyToSend(true)
      }, 1000);
    }
    setIsLoading(false);
  }, [messageToSend, readyToSend]);

  useEffect(() => {
    if (resetChat) {
      handleClearChatHistory();
      setResetChat(false);
    }
  }, [resetChat]);

  // Simple function to give each conversation a friendly name
  const formatConversationName = (id: string) => {
    if (id === "default") return "Main Chat";
    const parts = id.split("_");
    const number = parts.length > 1 ? parts[1] : id;
    return `Past chat conversation ${number}`;
  };

  return (
    <div
      className={`${styles.sidebarContainer} ${isSidebarOpen ? "" : styles.collapsed
        }`}
    >
      {/* Sidebar Content */}
      <div className={styles.sidebar}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <button
              className={styles.newChatButton}
              onClick={handleCreateNewConversation}
              disabled={isLoading}
            >
              {/* <IconPencilPlus size={16} /> */}
              <span>New chat</span>
            </button>

            {conversations.map((conversationId) => (
              <div
                key={conversationId}
                className={`${styles.conversationItem} ${currentConversationId === conversationId
                  ? styles.conversationActive
                  : ""
                  }`}
                onClick={() => {
                  onConversationSelect(conversationId);
                  setCurrentConversationId(conversationId);
                }}
              >
                <div className={styles.conversationItemContent}>
                  <img src="ai-agents/comment.svg" alt="" />
                  <span className={styles.conversationName}>
                    {formatConversationName(conversationId)}
                  </span>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.resetButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearChatHistory();
                    }}
                  >
                    <IconRefresh size={16} />
                  </button>
                  {conversationId !== "default" && (
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversationId);
                      }}
                    >
                      <IconTrash size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.divider}></div>

          <VStack spacing={4} className={styles.sidebarFooter} align="stretch">
            <Box display="flex" flexDirection="column" gap={2}>
              <TrendingPrompts />
              
              <Box display="flex" flexDirection="column" marginTop={8} marginBottom={6} gap={6}>
                <Workflows />
                <ApiCredentialsButton />
                <SettingsButton />
              </Box>
            </Box>
          </VStack>
        </div>
      </div>

      {/* Toggle Button on the right edge of the sidebar */}
      <button
        className={styles.toggleButton}
        onClick={() => onToggleSidebar(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <ToggleIcon size={20} />
      </button>
    </div>
  );
};
