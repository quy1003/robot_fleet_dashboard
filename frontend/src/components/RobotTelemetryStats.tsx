'use client'

import { Row, Col, Card, Statistic, Progress } from 'antd'
import { ThunderboltOutlined, WifiOutlined, AlertOutlined, DashboardOutlined } from '@ant-design/icons'
import { RobotData } from '../types/robot'

interface RobotTelemetryStatsProps {
  latestData: RobotData
  isOnline: boolean
  criticalTempThreshold: number
}

export function RobotTelemetryStats({ latestData, isOnline, criticalTempThreshold }: RobotTelemetryStatsProps) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      {/* Battery Level */}
      <Col xs={12} sm={6}>
        <Card variant="borderless" className="stat-card">
          <Statistic
            title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ThunderboltOutlined /> Battery Level</span>}
            value={latestData.batteryPercentage}
            suffix="%"
            valueStyle={{ color: latestData.batteryPercentage <= 20 ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 700 }}
          />
          <Progress 
            percent={latestData.batteryPercentage} 
            showInfo={false} 
            status={latestData.batteryPercentage <= 20 ? 'exception' : 'normal'}
            strokeColor={latestData.batteryPercentage <= 20 ? 'var(--color-error)' : 'var(--color-success)'}
          />
        </Card>
      </Col>
      
      {/* Wi-Fi Signal */}
      <Col xs={12} sm={6}>
        <Card variant="borderless" className="stat-card">
          <Statistic
            title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><WifiOutlined /> Wi-Fi Signal</span>}
            value={latestData.wifiSignalStrength}
            suffix=" dBm"
            valueStyle={{ color: latestData.wifiSignalStrength < -70 ? 'var(--color-error)' : 'var(--color-primary)', fontWeight: 700 }}
          />
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 8 }}>
            Signal: {latestData.wifiSignalStrength >= -60 ? 'Excellent' : latestData.wifiSignalStrength >= -75 ? 'Good' : 'Poor'}
          </div>
        </Card>
      </Col>

      {/* CPU Temperature */}
      <Col xs={12} sm={6}>
        <Card variant="borderless" className="stat-card">
          <Statistic
            title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertOutlined /> CPU Temperature</span>}
            value={latestData.temperature}
            suffix=" °C"
            valueStyle={{ color: latestData.temperature > criticalTempThreshold ? 'var(--color-error)' : 'var(--color-chart-temp)', fontWeight: 700 }}
          />
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 8 }}>
            Safety Limit: {criticalTempThreshold}°C
          </div>
        </Card>
      </Col>

      {/* RAM Usage */}
      <Col xs={12} sm={6}>
        <Card variant="borderless" className="stat-card">
          <Statistic
            title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DashboardOutlined /> RAM Usage</span>}
            value={latestData.memoryUsage}
            suffix="%"
            valueStyle={{ color: latestData.memoryUsage > 80 ? 'var(--color-error)' : '#722ed1', fontWeight: 700 }}
          />
          <Progress 
            percent={latestData.memoryUsage} 
            showInfo={false} 
            strokeColor="#722ed1"
          />
        </Card>
      </Col>
    </Row>
  )
}
