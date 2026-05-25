import { Table, Tag, Progress, Space } from 'antd'
import { useRouter } from 'next/navigation'
import { RobotData } from '../types/robot'
import { APP_CONFIG, ROBOT_STATUS } from '../constants/config'

interface RobotTableProps {
  robots: RobotData[]
}

export function RobotTable({ robots }: RobotTableProps) {
  const router = useRouter()
  const columns = [
    {
      title: 'Robot ID',
      dataIndex: 'robotId',
      key: 'robotId',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: RobotData) => {
        let color = 'green'
        if (record.status === ROBOT_STATUS.WARNING) color = 'orange'
        if (record.status === ROBOT_STATUS.OFFLINE) color = 'red'
        return <Tag color={color}>{record.status?.toUpperCase() || 'ONLINE'}</Tag>
      },
    },
    {
      title: 'Battery',
      dataIndex: 'batteryPercentage',
      key: 'battery',
      render: (val: number, record: RobotData) => (
        <Space>
          <Progress percent={val} size="small" status={val <= APP_CONFIG.THRESHOLDS.LOW_BATTERY ? 'exception' : 'normal'} style={{ width: 100 }} />
          {record.isCharging && <Tag color="blue">Charging</Tag>}
        </Space>
      ),
    },
    {
      title: 'Temperature',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (val: number) => (
        <span style={{ color: val > APP_CONFIG.THRESHOLDS.CRITICAL_TEMP ? 'var(--color-error)' : 'inherit' }}>
          {val.toFixed(1)} °C
        </span>
      ),
    },
    {
      title: 'Wi-Fi Signal',
      dataIndex: 'wifiSignalStrength',
      key: 'wifi',
      render: (val: number) => `${val} dBm`,
    },
    {
      title: 'Last Updated',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (val: string) => new Date(val).toLocaleTimeString(),
    },
  ]

  return (
    <Table 
      columns={columns} 
      dataSource={robots} 
      rowKey="robotId" 
      pagination={false}
      size="small"
      onRow={(record) => ({
        onClick: () => {
          router.push(`/robots/${record.robotId}`)
        },
        style: { cursor: 'pointer' }
      })}
    />
  )
}
