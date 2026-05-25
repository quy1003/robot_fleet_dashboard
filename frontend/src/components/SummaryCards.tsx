'use client'

import { Col, Card, Statistic } from 'antd'
import { CheckCircleOutlined, AlertOutlined } from '@ant-design/icons'
import { useRobots } from '../context/RobotsDataContext'
import { APP_CONFIG, ROBOT_STATUS } from '../constants/config'

export function SummaryCards() {
  const { robots, alerts } = useRobots()

  const onlineRobots = robots.filter(r => r.status !== ROBOT_STATUS.OFFLINE).length
  const lowBatteryCount = robots.filter(r => r.batteryPercentage <= APP_CONFIG.THRESHOLDS.LOW_BATTERY).length
  const unackedAlerts = alerts.filter(a => !a.acknowledged).length

  return (
    <>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic 
            title="Total Active Robots" 
            value={onlineRobots} 
            prefix={<CheckCircleOutlined style={{ color: 'var(--color-success)' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic 
            title="Low Battery Robots" 
            value={lowBatteryCount} 
            valueStyle={{ color: lowBatteryCount > 0 ? 'var(--color-error)' : 'var(--color-success-dark)' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic 
            title="Unacknowledged Alerts" 
            value={unackedAlerts} 
            prefix={<AlertOutlined />}
            valueStyle={{ color: unackedAlerts > 0 ? 'var(--color-warning-dark)' : 'var(--color-success-dark)' }}
          />
        </Card>
      </Col>
    </>
  )
}
