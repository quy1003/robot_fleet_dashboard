import { List, Alert as AntAlert, Button } from 'antd'
import { Alert } from '../types/robot'

interface AlertsPanelProps {
  alerts: Alert[]
  onAcknowledge: (id: string) => void
}

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  return (
    <List
      style={{ maxHeight: '400px', overflow: 'auto' }}
      dataSource={alerts}
      locale={{ emptyText: 'No active alerts' }}
      renderItem={item => (
        <List.Item style={{ padding: '8px 0' }}>
          <AntAlert
            style={{ width: '100%' }}
            message={item.message}
            description={new Date(item.timestamp).toLocaleTimeString()}
            type={item.type === 'low_battery' ? 'warning' : 'error'}
            showIcon
            action={
              !item.acknowledged && (
                <Button size="small" type="primary" onClick={() => onAcknowledge(item.id)}>
                  Acknowledge
                </Button>
              )
            }
          />
        </List.Item>
      )}
    />
  )
}
