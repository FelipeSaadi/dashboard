import React from 'react'
import Sidebar from '../sidebar/sidebar'
import Header from '../header/header'

interface LayoutProps {
  children: React.ReactNode
  sidebar?: {
    actual: string
    onChange: (coin: string) => void
    open: (page: string) => void
  }
  header: {
    onSubmit: (type: string, value: string) => void
  }
  noSidebar?: boolean
  noPadding?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, sidebar, header, noSidebar, noPadding }) => {
  return (
    <div className="flex flex-1 h-[100%] min-h-[100vh] bg-[#051718] md:ml-[320px]">
      {!noSidebar && <Sidebar
        actual={sidebar?.actual}
        onChange={sidebar?.onChange}
        open={sidebar?.open}
      />}
      <div className="flex flex-col flex-1 pb-20 overflow-hidden overflow-y-auto">
        <Header onSubmit={header.onSubmit} />
        <main className={noPadding ? '' : 'px-6'}>{children}</main>
      </div>
    </div>
  )
}

export default Layout
