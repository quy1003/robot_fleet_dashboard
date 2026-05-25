import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { RobotData } from '../types/robot'
import { APP_CONFIG } from '../constants/config'

interface RobotChartsProps {
  robots: RobotData[]
}

interface ChartPoint {
  time: string
  avgBattery: number
  avgTemp: number
}

export function RobotCharts({ robots }: RobotChartsProps) {
  const [data, setData] = useState<ChartPoint[]>([])

  useEffect(() => {
    if (robots.length === 0) return

    const avgBattery = robots.reduce((sum, r) => sum + r.batteryPercentage, 0) / robots.length
    const avgTemp = robots.reduce((sum, r) => sum + r.temperature, 0) / robots.length
    
    const newPoint = {
      time: new Date().toLocaleTimeString(),
      avgBattery: Number(avgBattery.toFixed(1)),
      avgTemp: Number(avgTemp.toFixed(1))
    }

    setData(prev => {
      if (prev.length > 0 && prev[prev.length - 1].time === newPoint.time) {
        const copy = [...prev]
        copy[copy.length - 1] = newPoint
        return copy
      }
      
      const newData = [...prev, newPoint]
      if (newData.length > APP_CONFIG.CHART.MAX_DATA_POINTS) newData.shift()
      return newData
    })
  }, [robots])

  return (
    <div style={{ height: 300, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="avgBattery" stroke="var(--color-chart-battery)" name="Avg Battery (%)" animationDuration={APP_CONFIG.CHART.ANIMATION_DURATION} />
          <Line yAxisId="right" type="monotone" dataKey="avgTemp" stroke="var(--color-chart-temp)" name="Avg Temp (°C)" animationDuration={APP_CONFIG.CHART.ANIMATION_DURATION} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
