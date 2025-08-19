'use client'

import React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import styles from './styles.module.scss'
import { Button } from '@/components/ui/button'

interface TrackAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (blockchain: string, address: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

const blockchains = [
  "ETH",
  "BSC",
  "ARBITRUM",
  "POLYGON",
  "ZKSYNC",
  "STARKNET",
  "OPTIMISM",
  "AVAX_CCHAIN",
  "POLYGONZK",
  "BASE",
  "LINEA",
  "MODE",
  "TRON",
  "BTC",
  "SCROLL",
  "BLAST",
  "COSMOS",
  "OSMOSIS",
  "NEUTRON",
  "NOBLE",
  "DYDX",
  "SOLANA",
  "CRONOS",
  "BNB",
  "FANTOM",
  "AURORA",
  "MAYA",
  "THOR",
  "BOBA",
  "MOONBEAM",
  "MOONRIVER",
  "OKC",
  "BOBA_BNB",
  "BOBA_AVALANCHE",
  "LTC",
  "BCH",
  "HARMONY",
  "EVMOS",
  "HECO",
  "METIS",
  "SIF",
  "BRISE",
  "STARGAZE",
  "FUSE",
  "CRYPTO_ORG",
  "CHIHUAHUA",
  "BANDCHAIN",
  "COMDEX",
  "REGEN",
  "IRIS",
  "EMONEY",
  "GNOSIS",
  "JUNO",
  "AXELAR",
  "STRIDE",
  "KCC",
  "MARS",
  "TERRA",
  "TELOS",
  "BITSONG",
  "AKASH",
  "KI",
  "PERSISTENCE",
  "MEDIBLOC",
  "KUJIRA",
  "SENTINEL",
  "INJECTIVE",
  "SECRET",
  "KONSTELLATION",
  "STARNAME",
  "BITCANNA",
  "UMEE",
  "DESMOS",
  "LUMNETWORK",
  "TERRA_CLASSIC",
  "CELO",
  "DASH",
  "SHIMMER",
  "XLAYER",
  "IOTA",
  "POLKADOT",
  "DOGE",
  "GOERLI",
  "GOERLI_ARBITRUM",
  "GOERLI_OPTIMISM"
].sort()

const TrackAddressModal: React.FC<TrackAddressModalProps> = ({
  open,
  onClose,
  onSubmit,
  error,
  isLoading = false,
}) => {
  const [selectedBlockchain, setSelectedBlockchain] = React.useState('')
  const [newAddress, setNewAddress] = React.useState('')

  const handleSubmit = () => {
    onSubmit(selectedBlockchain, newAddress)
    setSelectedBlockchain('')
    setNewAddress('')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onBackdropClick={() => null}
      PaperProps={{
        className: styles.paper,
      }}
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: '16px', sm: '32px' },
          width: { xs: 'calc(100% - 32px)', sm: '100%' },
          maxWidth: { xs: '100%', sm: '600px' },
          background: 'var(--background-primary)',
          border: '0.5px solid #FFFFFF8F',
          borderRadius: '16px',
        }
      }}
    >
      <DialogTitle className="flex justify-between items-center p-6">
        <span className="text-white text-xl font-semibold">Track New Address</span>
        <IconButton
          onClick={onClose}
          className="text-white hover:text-gray-300"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.content}>
        <div className="flex flex-row gap-4 py-4">
          <FormControl className="flex-1">
            <InputLabel id="blockchain-select-label" sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              '&.Mui-focused': {
                color: 'white',
              },
            }}>
              Select Blockchain
            </InputLabel>
            <Select
              labelId="blockchain-select-label"
              value={selectedBlockchain}
              onChange={(e) => setSelectedBlockchain(e.target.value)}
              className={styles.formField}
              sx={{
                color: 'white',
                borderRadius: '50px',
                height: '48px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: 'var(--background-primary)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    marginTop: '8px',
                    '& .MuiMenuItem-root': {
                      color: 'white',
                      padding: '12px 16px',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&.Mui-selected': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                    },
                  },
                },
              }}
            >
              {blockchains.map((blockchain) => (
                <MenuItem key={blockchain} value={blockchain}>
                  {blockchain}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className={`${styles.formField} flex-1 flex`}
            label="Enter Wallet Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                borderRadius: '50px',
                height: '48px',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: 'white',
                },
              },
            }}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!selectedBlockchain || !newAddress || isLoading}
          className="mt-4 w-full text-[18px] text-white font-bold p-5 bg-[#5AD4D5] hover:bg-[#5AD4D5]/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-[#4C4C4C]"
        >
          {isLoading ? 'Tracking Address...' : 'Track Address'}
        </Button>
        {error && (
          <div className="mt-2 text-red-400 text-sm text-center">{error}</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TrackAddressModal