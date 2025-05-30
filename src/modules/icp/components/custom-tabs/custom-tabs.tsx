"use client"

import React from 'react'
import styles from './custom-tabs-styles.module.scss'
import { Box, Tab, Tabs } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'
import { ICPAreaChart } from '../icp-area-chart/icp-area-chart'
import { ByTimeChart } from '@/components/by-time-chart/by-time-chart'
// import { TokenChart } from '../token-chart/token-chart'
// import { FeeChart } from '../fee-chart/fee-chart'
// import { WalletChart } from '../wallet-chart/wallet-chart'

type Data = {
  tvl?: any
  burned?: any
  supply?: any
}

type Props = {
  labels: string[]
  data: Data
}

const CustomTabs: React.FC<Props> = ({ labels, data }: Props) => {
  const [value, setValue] = React.useState('0')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <div className={styles.tabs}>
      <TabContext value={value}>
        <Box className={styles.box} sx={{ display: 'flex', height: '60px', padding: '8px', borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            sx={{
              marginBottom: '4px',
              '.Mui-selected': {
                color: `#3BEBFC !important`,
              },
            }}
            slotProps={{ indicator: { style: { background: '#3BEBFC' } } }}
            value={value}
            onChange={handleChange}
            aria-label="chart tabs"
          >
            {labels.map((label: string, index: number) => {
              return <Tab autoCapitalize='false' className={styles.tab} label={label} value={index.toString()} key={`tab - ${index}`} />
            })}
          </Tabs>
        </Box>

        <TabPanel className={styles.panel} sx={{ display: value === '0' ? 'flex' : 'none', width: '100%', height: '100%' }} value='0' key={`panel - 0`}>
          <ByTimeChart
            className={styles.chartByTime}
            data={data.tvl}
            dataSeries={[{
              key: "volume",
              label: "Volume",
              color: "#3CDFEF99",
              yAxisId: "left"
            }]}
            autoAdjustDomain={true}
            domainPadding={0.2}
          />
        </TabPanel>

        <TabPanel className={styles.panel} sx={{ display: value === '1' ? 'flex' : 'none', width: '100%', height: '100%' }} value='1' key={`panel - 1`}>
          <ByTimeChart
            className={styles.chartByTime}
            data={data.supply}
            dataSeries={[{
              key: "supply",
              label: "Supply",
              color: "#3CDFEF99",
              yAxisId: "left"
            }]}
            autoAdjustDomain={true}
            domainPadding={0.2}
          />
        </TabPanel>

        <TabPanel className={styles.panel} sx={{ display: value === '2' ? 'flex' : 'none', width: '100%', height: '100%' }} value='2' key={`panel - 2`}>
          <ByTimeChart
            className={styles.chartByTime}
            data={data.burned}
            dataSeries={[{
              key: "burned",
              label: "Burned",
              color: "#3CDFEF99",
              yAxisId: "left"
            }]}
            autoAdjustDomain={true}
            domainPadding={0.2}
          />
        </TabPanel>
      </TabContext>
    </div >
  )
}

export default CustomTabs
