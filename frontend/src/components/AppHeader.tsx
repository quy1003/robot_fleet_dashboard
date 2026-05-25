'use client'

import { Layout, Typography, Tag } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useRobots } from '../context/RobotsDataContext'

const { Header } = Layout
const { Title } = Typography

export function AppHeader() {
  const { isConnected } = useRobots()

  return (
    <Header style={{ background: 'var(--color-bg-header)', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Title level={3} style={{ color: 'var(--color-text-white)', margin: 0 }}>
        🤖 Robot Fleet Dashboard
      </Title>
      <div>
        {isConnected ? (
          <Tag icon={<SyncOutlined spin />} color="success">
            Live Connected
          </Tag>
        ) : (
          <Tag color="error">
            Disconnected
          </Tag>
        )}
      </div>
    </Header>
  )
}
