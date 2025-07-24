

import { HiOutlineSparkles   } from "react-icons/hi"
import styles from "./index.module.css"

import { Box, Text } from "@chakra-ui/react"

import { useChatStore } from "@/store/chat"

const Prompts = [
  {
    'id': '1',
    'text': 'What is the Fully Diluted Valuation in AVAX?'
  },
  {
    'id': '2',
    'text': 'The number of Activities Addresses in AVAX?'
  },
  {
    'id': '3',
    'text': 'What is the current AVAX Price?'
  },
]

export const TrendingPrompts = () => {
  const setMessageToSend = useChatStore((state) => state.setMessageToSend)

  const handlePromptClick = (prompt: string) => {
    setMessageToSend(prompt)
  }

  return (
    <>  
      <Box p={4} display="flex" alignItems="center" gap={2}>
        <HiOutlineSparkles   size={20} />
        <Text fontSize="md" fontWeight="bold" color="white">
          Trending Prompts
        </Text>
      </Box>
      {Prompts.map((prompt) => (
        <div
          key={prompt.id}
          className={`${styles.trendingItem}`}
          onClick={() => {
            handlePromptClick(prompt.text)
          }}
        >
          <div className={styles.trendingItemContent}>
            <span className={styles.trendingName}>
              {prompt.text}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}