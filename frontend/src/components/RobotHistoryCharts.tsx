'use client'

import { Row, Col, Card } from 'antd'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RobotHistoryChartsProps {
  chartData: any[]
}

export function RobotHistoryCharts({ chartData }: RobotHistoryChartsProps) {
  return (
    <Row gutter={[16, 16]}>
      {/* Battery Chart */}
      <Col xs={24} lg={12}>
        <Card title="Battery Level History (%)" variant="borderless">
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="timeLabel" tickSize={8} dy={4} style={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} style={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="batteryPercentage" stroke="var(--color-success)" strokeWidth={2} fillOpacity={1} fill="url(#colorBattery)" name="Battery Level (%)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>

      {/* Wi-Fi Chart */}
      <Col xs={24} lg={12}>
        <Card title="Wi-Fi Signal Strength History (dBm)" variant="borderless">
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWifi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="timeLabel" tickSize={8} dy={4} style={{ fontSize: 11 }} />
                <YAxis domain={[-100, -20]} style={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="wifiSignalStrength" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorWifi)" name="Signal Strength (dBm)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>

      {/* Temperature Chart */}
      <Col xs={24} lg={12}>
        <Card title="CPU Temperature History (°C)" variant="borderless">
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-temp)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-chart-temp)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="timeLabel" tickSize={8} dy={4} style={{ fontSize: 11 }} />
                <YAxis style={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="temperature" stroke="var(--color-chart-temp)" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" name="Temperature (°C)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>

      {/* RAM Chart */}
      <Col xs={24} lg={12}>
        <Card title="RAM Usage History (%)" variant="borderless">
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#722ed1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#722ed1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="timeLabel" tickSize={8} dy={4} style={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} style={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="memoryUsage" stroke="#722ed1" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" name="Memory Usage (%)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    </Row>
  )
}
