'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button, Spin, Space, Tag, Empty } from 'antd'
import { ArrowLeftOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { APP_CONFIG } from '../../../constants/config'
import { RobotTelemetryStats } from '../../../components/RobotTelemetryStats'
import { RobotHistoryCharts } from '../../../components/RobotHistoryCharts'
import { useRobotDetail } from '../../../hooks/useRobotDetail'

export default function RobotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const { latestData, chartData, loading, isOnline, statusColor } = useRobotDetail(id)

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 16 }}>
        <Spin size="large" />
        <span style={{ color: 'var(--color-primary)' }}>Loading historical telemetry for the last 6 hours...</span>
      </div>
    )
  }

  // If no latest data
  if (!latestData) {
    return (
      <div style={{ padding: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/')} style={{ marginBottom: 16 }}>
          Back to Dashboard
        </Button>
        <Empty description="No data found for this Robot" />
      </div>
    )
  }

  // Show data realtime
  return (
    <div style={{ padding: '8px 8px 24px 8px' }}>
      {/* Header and Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <Space size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/')} type="primary" ghost>
            Back to Dashboard
          </Button>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
            Robot Monitor <span style={{ color: 'var(--color-primary)' }}>#{latestData.robotId}</span>
          </h2>
          <Tag color={statusColor} style={{ fontSize: '14px', padding: '4px 12px' }}>
            {isOnline ? (latestData.batteryPercentage <= APP_CONFIG.THRESHOLDS.LOW_BATTERY ? 'WARNING' : 'ONLINE') : 'OFFLINE'}
          </Tag>
        </Space>
        
        {latestData.isCharging && (
          <Tag color="blue" icon={<ThunderboltOutlined />} style={{ fontSize: '14px', padding: '4px 12px', animation: 'pulse 2s infinite' }}>
            Charging
          </Tag>
        )}
      </div>

      {/* Summary Stat Cards */}
      <RobotTelemetryStats 
        latestData={latestData} 
        isOnline={isOnline} 
        criticalTempThreshold={APP_CONFIG.THRESHOLDS.CRITICAL_TEMP} 
      />

      {/* Real-time Historical Charts */}
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 16 }}>Historical Telemetry Charts (Last 6 Hours)</h3>
      <RobotHistoryCharts chartData={chartData} />
    </div>
  )
}
