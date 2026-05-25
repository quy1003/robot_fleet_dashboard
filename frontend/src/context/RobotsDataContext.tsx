'use client'

import React, { createContext, useContext } from 'react'
import { useRobotsData } from '../hooks/useRobotsData'
import { RobotData, Alert } from '../types/robot'

interface RobotsDataContextType {
  robots: RobotData[]
  alerts: Alert[]
  isConnected: boolean
  acknowledgeAlert: (id: string) => void
}

const RobotsDataContext = createContext<RobotsDataContextType | undefined>(undefined)

export function RobotsDataProvider({ children }: { children: React.ReactNode }) {
  const { robots: robotsRecord, alerts, isConnected, acknowledgeAlert } = useRobotsData()
  
  // Convert Record<string, RobotData> to RobotData[]
  const robots = Object.values(robotsRecord)

  return (
    <RobotsDataContext.Provider value={{ robots, alerts, isConnected, acknowledgeAlert }}>
      {children}
    </RobotsDataContext.Provider>
  )
}

export function useRobots() {
  const context = useContext(RobotsDataContext)
  if (!context) {
    throw new Error('useRobots must be used within a RobotsDataProvider')
  }
  return context
}
