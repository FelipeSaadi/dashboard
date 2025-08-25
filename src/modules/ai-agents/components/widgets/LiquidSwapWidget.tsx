"use client"

import React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { ChatSwap } from "@/modules/liquid-swap/components/chat-swap"

const theme = createTheme()

const LiquidSwapWidget: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatSwap />
    </ThemeProvider>
  )
}

export default LiquidSwapWidget 