'use client'

import styles from './styles.module.scss'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { WidgetVariant, widgetEventEmitter, WidgetEvents } from '@rango-dev/widget-embedded'
import { Swap } from '@/modules/liquid-swap/components/swap'
import { HeaderBar } from '@/components/header-bar'
import { ChakraProvider } from '@chakra-ui/react'
import { Dialog, DialogTitle, DialogContent, IconButton, Button } from '@mui/material'
import { Close } from '@mui/icons-material'

enum WalletEventTypes {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

const Widget = dynamic(
  () => import('@rango-dev/widget-embedded').then((module) => module.Widget),
  {
    ssr: false,
  }
)

const Page = () => {
  const [actual, setActual] = useState('Bitcoin')
  const [modalOpened, setModalOpened] = useState(false)
  const [chatOpened, setChatOpened] = useState(false)
  const [whaleOpened, setWhaleOpened] = useState(false)
  const [info, setInfo] = useState<any>()
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  const config = {
    variant: 'full-expanded' as WidgetVariant,
    theme: {
      borderRadius: 30,
      secondaryBorderRadius: 15,
      singleTheme: true,
      colors: {
        light: {
          primary: '#1cd5f1',
          secondary: '#419e9e',
          neutral: '#abd2d2',
          background: '#ffffff',
        },
      },
    },
    apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
    trezorManifest: {
      appUrl: 'https://widget.rango.exchange/',
      email: 'hi+trezorwidget@rango.exchange',
    },
    tonConnect: {
      manifestUrl:
        'https://raw.githubusercontent.com/rango-exchange/assets/refs/heads/main/manifests/tonconnect/manifest.json',
    },
  }

  useEffect(() => {
    const hasAcceptedDisclaimer = localStorage.getItem('liquidSwapDisclaimerAccepted')
    if (!hasAcceptedDisclaimer) {
      setDisclaimerOpen(true)
    }
  }, [])

  const handleAcceptDisclaimer = () => {
    // localStorage.setItem('liquidSwapDisclaimerAccepted', 'true')
    setDisclaimerOpen(false)
  }

  useEffect(() => {
    widgetEventEmitter.on(WidgetEvents.WalletEvent, (walletEvent) => {
      const { type, payload } = walletEvent;
      if (type === WalletEventTypes.CONNECT) {
        setWalletConnected(true)
      } else if (type === WalletEventTypes.DISCONNECT) {
        setWalletConnected(false)
      }
    });
    return () => widgetEventEmitter.off(WidgetEvents.WalletEvent);
  }, [widgetEventEmitter]);

  return (
    <>
      <ChakraProvider>
        <HeaderBar />
      </ChakraProvider>
      <div className={styles.home}>
        <Swap />
        <span className="mt-6 text-[#C7C7C7] text-[20px]">
          Liquid Swap is the initial feature of Liquid Path, an AI agent focusing on liquid staking/restaking protocols. Liquid Swap will provide the most efficient swap routes, while Liquid Path will focus on optimizing cross-chain yield opportunities.
          The product will expand to cover more yield strategies in DeFi and will eventually be integrated into the DeFi Vista product.
        </span>
      </div>
      <Dialog
        open={disclaimerOpen}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setDisclaimerOpen(false);
          }
        }}
      >
        <DialogTitle className="flex text-white bg-backgroundPrimary justify-between items-center py-6 px-8">
          Terms of Use - Third-Party Swap Router
        </DialogTitle>
        <DialogContent className='bg-backgroundPrimary py-8 px-8'>
          <div className="flex flex-col gap-6 text-white">
            <p className="text-gray-200 leading-relaxed">
              Panorama Block provides access to a third-party swap router within its application for user convenience. By using this feature, you acknowledge and agree that Panorama Block does not control, operate, or guarantee the functionality, accuracy, security, or availability of the third-party swap router.
            </p>
            <p className="text-gray-200 leading-relaxed">
              Panorama Block is not responsible for any errors, transaction failures, delays, smart contract vulnerabilities, or other issues that may result in loss of funds, incorrect execution, or unexpected behavior. Users assume full responsibility for their transactions and should conduct their own due diligence before proceeding.
            </p>
            <p className="text-gray-200 leading-relaxed">
              Panorama Block disclaims all liability for direct, indirect, incidental, consequential, or any other damages arising from the use of the swap router. Use at your own risk.
            </p>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleAcceptDisclaimer}
                variant="contained"
                className="bg-[#1cd5f1] hover:bg-[#19c0d9] text-black font-medium px-8 py-3 rounded-lg text-sm"
              >
                Proceed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex text-white justify-between items-center bg-backgroundPrimary py-6 px-8">
          About Liquid Swap
          <IconButton onClick={() => setInfoModalOpen(false)} size="small">
            <Close className='text-[#78c3ca]' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='bg-gradient-to-r from-[#177078] via-[#126067] to-[#0c4b51] py-8 px-8'>
          <div className="flex flex-col gap-8 text-white max-w-4xl mx-auto">
            <div className="space-y-6">
              <p className="text-gray-200 leading-relaxed">
                Liquid Swap is the initial feature of Liquid Path, an AI agent focusing on liquid staking/restaking protocols. It will provide the most efficient swap routes, while Liquid Path will focus on optimizing cross-chain yield opportunities.
              </p>
              <p className="text-gray-200 leading-relaxed">
                The product will expand to cover more yield strategies in DeFi and will eventually be integrated into the DeFi Vista product.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Page
