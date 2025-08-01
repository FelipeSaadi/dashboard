'use client'

import React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import styles from './styles.module.scss'
import { DollarSignIcon } from 'lucide-react'

interface Asset {
  blockchain: string;
  symbol: string;
  address: string;
}

interface Amount {
  amount: string;
  decimals: number;
}

interface Token {
  asset: Asset;
  amount: Amount;
  price: number;
}

interface TokenDetailsModalProps {
  open: boolean;
  onClose: () => void;
  address: string;
  tokens: Token[];
}

const TokenDetailsModal: React.FC<TokenDetailsModalProps> = ({
  open,
  onClose,
  address,
  tokens,
}) => {
  const formatAmount = (token: Token) => {
    const amount = parseFloat(token.amount.amount) / Math.pow(10, token.amount.decimals)
    return amount.toFixed(2)
  }

  const formatValue = (token: Token) => {
    const amount = parseFloat(token.amount.amount) / Math.pow(10, token.amount.decimals)
    return token.price ? `$${(amount * token.price).toFixed(2)}` : 'N/A'
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={styles.dialog}
      slotProps={{
        paper: {
          className: styles.paper
        }
      }}
      sx={{
        '& .MuiDialog-container': {
          paddingLeft: 'calc(64px + 240px)',
          paddingRight: '64px',
        },
        '& .MuiDialog-paper': {
          margin: '0 auto',
          width: '100%',
        }
      }}
    >
      <DialogTitle className={styles.title}>
        <div className={styles.titleContent}>
          <h2>{address}</h2>
          <IconButton onClick={onClose} className={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className={styles.content}>
        <div className={styles.tokenList}>
          {tokens.length === 0 ? (
            <div className={styles.noTokens}>No tokens</div>
          ) : (
            tokens.map((token, index) => (
              <div key={`token-${index}`} className={styles.tokenItem}>
                <img src="/assets/money.svg" alt="Money" width={28} height={28} />
                <div className={styles.tokenInfo}>
                  <h3>{token.asset.symbol}</h3>
                  <div className={styles.tokenDetails}>
                    <span>{formatAmount(token)}</span>
                    <span>{formatValue(token)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TokenDetailsModal