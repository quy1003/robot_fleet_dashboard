import { WS_EVENTS } from '../constants/config'

export interface Robot {
  robotId: string
  batteryPercentage: number
  wifiSignalStrength: number
  isCharging: boolean
  temperature: number
  memoryUsage: number
  timestamp: string
  lastSeen?: string
  status?: 'online' | 'offline' | 'warning'
}

export interface RobotData extends Robot {
  _id?: string
}

export type ApiResponseStatus = 'success' | 'error'

export interface ApiResponse<T> {
  status: ApiResponseStatus
  data?: T
  message?: string
  timestamp: string
}

export interface Alert {
  id: string
  robotId: string
  type: 'low_battery' | 'critical_battery' | 'offline'
  message: string
  timestamp: string
  acknowledged?: boolean
}

export interface WebSocketMessage {
  type: typeof WS_EVENTS[keyof typeof WS_EVENTS]
  robotId?: string
  data?: RobotData
  robots?: string[]
}