import React, { FC } from "react";
import { Box } from "@chakra-ui/react";
import { ChatMessage } from "@/lib/api/services/types";
import { MessageItem } from "../message-item";

export const MessageList: FC<{ messages: ChatMessage[] }> = ({ messages }) => {
  return (
    <Box
      width="100%"
      height="100%"
      // bg="var(--background-secondary-gradient)"
      p={4}
      paddingRight={6}
      sx={{
        overflowY: "scroll",
        overflowX: "hidden",
        height: "100%",
        "::-webkit-scrollbar": {
          width: "8px",
          backgroundColor: "transparent",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#111613",
          borderRadius: "4px",
        },
      }}
    >
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </Box>
  );
};
