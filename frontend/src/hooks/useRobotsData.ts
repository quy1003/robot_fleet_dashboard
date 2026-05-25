'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { notification } from 'antd'
import { useWebSocket } from './useWebSocket'
import { RobotData, Alert, ApiResponse, WebSocketMessage } from '../types/robot'
import { APP_CONFIG, ROBOT_STATUS } from '../constants/config'
import { RobotService } from '../services/robot.service'

interface AlertState {
  hasWarnedLowBattery: boolean
  hasWarnedCriticalBattery: boolean
  lowBatteryStartTime: number | null
}

export function useRobotsData() {
  const [robots, setRobots] = useState<Record<string, RobotData>>({})
  const [alerts, setAlerts] = useState<Alert[]>([])
  
  // Lưu trạng thái cảnh báo của từng robot (không trigger re-render thừa)
  const alertStates = useRef<Record<string, AlertState>>({})
  
  const { isConnected, lastMessage } = useWebSocket(APP_CONFIG.WS_URL)

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      const robotList = await RobotService.getLatestSnapshot()
      const initialRobots: Record<string, RobotData> = {}
      
      robotList.forEach((r: RobotData) => {
        initialRobots[r.robotId] = { 
          ...r, 
          status: r.batteryPercentage <= APP_CONFIG.THRESHOLDS.LOW_BATTERY ? ROBOT_STATUS.WARNING : ROBOT_STATUS.ONLINE 
        }
      })
      
      setRobots(initialRobots)
    } catch (error) {
      console.error('Failed to fetch initial robots data:', error)
    }
  }, [])

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  // Handle incoming websocket messages
  useEffect(() => {
    if (!lastMessage) return

    try {
      const parsed: WebSocketMessage = JSON.parse(lastMessage)
      
      if (parsed.type === 'telemetry' && parsed.data) {
        const data = parsed.data
        const robotId = data.robotId
        
        setRobots(prev => {
          const status = data.batteryPercentage <= APP_CONFIG.THRESHOLDS.LOW_BATTERY ? ROBOT_STATUS.WARNING : ROBOT_STATUS.ONLINE
          return {
            ...prev,
            [robotId]: { ...data, status }
          }
        })

        // Khởi tạo trạng thái cảnh báo nếu chưa có
        if (!alertStates.current[robotId]) {
          alertStates.current[robotId] = {
            hasWarnedLowBattery: false,
            hasWarnedCriticalBattery: false,
            lowBatteryStartTime: null
          }
        }

        const state = alertStates.current[robotId]
        const isLowBattery = data.batteryPercentage < 20 && !data.isCharging

        if (isLowBattery) {
          // Bắt đầu đếm giờ nếu chưa đếm
          if (state.lowBatteryStartTime === null) {
            state.lowBatteryStartTime = Date.now()
          }

          // Cảnh báo 1: Low Battery (Warning 🟡)
          if (!state.hasWarnedLowBattery) {
            state.hasWarnedLowBattery = true

            notification.warning({
              message: 'Cảnh báo Pin Yếu 🟡',
              description: `Robot ${robotId} is low battery! (${data.batteryPercentage}%)`,
              placement: 'topRight',
              duration: 5
            })

            setAlerts(prev => {
              const newAlert: Alert = {
                id: `low_${robotId}_${Date.now()}`,
                robotId,
                type: 'low_battery',
                message: `Robot ${robotId} is low battery! (${data.batteryPercentage}%)`,
                timestamp: new Date().toISOString(),
                acknowledged: false
              }
              return [newAlert, ...prev].slice(0, APP_CONFIG.ALERTS.MAX_HISTORY)
            })
          }

          // Cảnh báo 2: Critical Battery (Error 🔴) - liên tục >= 5 phút
          const timeElapsed = Date.now() - state.lowBatteryStartTime
          const threshold = 5 * 60 * 1000 // 5 phút (300000 ms)

          if (timeElapsed >= threshold && !state.hasWarnedCriticalBattery) {
            state.hasWarnedCriticalBattery = true

            notification.error({
              message: 'Cảnh báo Khẩn cấp 🔴',
              description: `Robot ${robotId} will be shut down soon! (Dưới 20% liên tục 5 phút)`,
              placement: 'topRight',
              duration: 10
            })

            setAlerts(prev => {
              const newAlert: Alert = {
                id: `critical_${robotId}_${Date.now()}`,
                robotId,
                type: 'critical_battery',
                message: `Robot ${robotId} will be shut down soon!`,
                timestamp: new Date().toISOString(),
                acknowledged: false
              }
              return [newAlert, ...prev].slice(0, APP_CONFIG.ALERTS.MAX_HISTORY)
            })
          }
        } else {
          // Reset trạng thái nếu pin >= 20% hoặc robot đang sạc
          if (state.hasWarnedLowBattery || state.hasWarnedCriticalBattery || state.lowBatteryStartTime !== null) {
            state.hasWarnedLowBattery = false
            state.hasWarnedCriticalBattery = false
            state.lowBatteryStartTime = null
            console.log(`[Alert System] Reset state for Robot ${robotId}`)
          }
        }
      }
    } catch (error) {
      console.error('Error parsing WS message:', error)
    }
  }, [lastMessage])

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a))
  }

  const robotList = Object.values(robots) as RobotData[]

  return {
    robots: robotList,
    alerts,
    isConnected,
    acknowledgeAlert
  }
}
