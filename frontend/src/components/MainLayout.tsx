'use client'

import { Layout } from 'antd'
import { RobotsDataProvider } from '../context/RobotsDataContext'
import { AppHeader } from './AppHeader'

const { Content } = Layout

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <RobotsDataProvider>
      <Layout style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
        <AppHeader />
        <Content style={{ padding: '24px' }}>
          {children}
        </Content>
      </Layout>
    </RobotsDataProvider>
  )
}
