'use client'

import { Row, Col, Card } from 'antd'
import { useRobots } from '../context/RobotsDataContext'
import { RobotTable } from '../components/RobotTable'
import { RobotCharts } from '../components/RobotCharts'
import { AlertsPanel } from '../components/AlertsPanel'
import { SummaryCards } from '../components/SummaryCards'

export default function Dashboard() {
  const { robots, alerts, acknowledgeAlert } = useRobots()

  // Get unack alerts amount
  const unackedAlerts = alerts.filter(alert => !alert.acknowledged).length

  return (
    <Row gutter={[16, 16]}>
      {/* Summary Cards */}
      <SummaryCards />

      {/* Main Content */}
      <Col xs={24} lg={16}>
        <Card title="Fleet Status (Real-time)" style={{ marginBottom: 16 }}>
          <RobotTable robots={robots} />
        </Card>
        
        <Card title="Average Fleet Telemetry">
          <RobotCharts robots={robots} />
        </Card>
      </Col>

      {/* Sidebar */}
      <Col xs={24} lg={8}>
        <Card title={`Active Alerts (${unackedAlerts})`}>
          <AlertsPanel alerts={alerts} onAcknowledge={acknowledgeAlert} />
        </Card>
      </Col>
    </Row>
  )
}