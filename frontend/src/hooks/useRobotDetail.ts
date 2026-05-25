'use client'

import { useState, useEffect, useRef } from 'react'
import { useRobots } from '../context/RobotsDataContext'
import { RobotData } from '../types/robot'
import { APP_CONFIG } from '../constants/config'
import { RobotService } from '../services/robot.service'

export function useRobotDetail(id: string) {
  const { robots } = useRobots()
  const [history, setHistory] = useState<RobotData[]>([])
  const [loading, setLoading] = useState(true)
  
  const currentRobotRealtime = robots.find(robot => robot.robotId === id)
  const lastProcessedTimestamp = useRef<string | null>(null)

  // Downsampling algorithm: Keeps rendering fast by restricting chart data points
  const downsampleData = (data: RobotData[], maxPoints = APP_CONFIG.CHART.MAX_DETAIL_CHART_POINTS): RobotData[] => {
    if (data.length <= maxPoints) return data
    const step = Math.ceil(data.length / maxPoints)
    return data.filter((_, idx) => idx % step === 0 || idx === data.length - 1)
  }

  // 1. Fetch historical data on mount using the new RobotService
  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true)
        const historyData = await RobotService.getHistory(id, APP_CONFIG.HISTORY.HOURS)
        setHistory(historyData)
        if (historyData.length > 0) {
          lastProcessedTimestamp.current = historyData[historyData.length - 1].timestamp
        }
      } catch (err) {
        console.error('Error in fetchHistory hook flow:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchHistory()
    }
  }, [id])

  // 2. Sync WebSocket messages into the history state
  useEffect(() => {
    if (!currentRobotRealtime) return

    const currentTimestamp = currentRobotRealtime.timestamp
    if (lastProcessedTimestamp.current && new Date(currentTimestamp).getTime() <= new Date(lastProcessedTimestamp.current).getTime()) {
      return
    }

    lastProcessedTimestamp.current = currentTimestamp
    setHistory(prev => {
      // Limit memory retention to the exact hours defined in config
      const since = Date.now() - APP_CONFIG.HISTORY.HOURS * 3600 * 1000
      const filtered = prev.filter(p => new Date(p.timestamp).getTime() >= since)
      return [...filtered, currentRobotRealtime]
    })
  }, [currentRobotRealtime])

  const latestData = currentRobotRealtime || (history.length > 0 ? history[history.length - 1] : null)
  const isOnline = currentRobotRealtime !== undefined

  // Downsample & format for Recharts using constant configs
  const downsampled = downsampleData(history, APP_CONFIG.CHART.MAX_DETAIL_CHART_POINTS)
  const chartData = downsampled.map(item => ({
    ...item,
    timeLabel: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }))

  const statusColor = isOnline 
    ? (latestData && latestData.batteryPercentage <= APP_CONFIG.THRESHOLDS.LOW_BATTERY ? 'orange' : 'green')
    : 'red'

  return {
    latestData,
    chartData,
    loading,
    isOnline,
    statusColor
  }
}
