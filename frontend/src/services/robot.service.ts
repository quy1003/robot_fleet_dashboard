import { ApiResponse, RobotData } from '../types/robot'
import { APP_CONFIG, API_STATUS } from '../constants/config'

export const RobotService = {
  /**
   * Fetch historical telemetry data for the robot within specified hours
   * Returns empty array on error (Graceful fallback)
   */
  async getHistory(robotId: string, hours = APP_CONFIG.HISTORY.HOURS): Promise<RobotData[]> {
    try {
      const res = await fetch(`${APP_CONFIG.API_URL}/robots/${robotId}/history?hours=${hours}`)
      
      if (!res.ok) {
        console.error(`HTTP Error while fetching history for robot ${robotId}: status ${res.status}`)
        return []
      }
      
      const result: ApiResponse<RobotData[]> = await res.json()
      
      if (result.status === API_STATUS.SUCCESS && Array.isArray(result.data)) {
        return result.data
      }
      
      console.warn(`API responded with status: ${result.status} or invalid data structure.`, result.message)
      return []
    } catch (error) {
      console.error(`Failed to fetch history for robot ${robotId}:`, error)
      return []
    }
  },

  /**
   * Fetch the latest data snapshot for all robots
   */
  async getLatestSnapshot(): Promise<RobotData[]> {
    try {
      const res = await fetch(`${APP_CONFIG.API_URL}/robots`)
      
      if (!res.ok) {
        console.error(`HTTP Error while fetching latest snapshots: status ${res.status}`)
        return []
      }
      
      const result: ApiResponse<RobotData[]> = await res.json()
      
      if (result.status === API_STATUS.SUCCESS && Array.isArray(result.data)) {
        return result.data
      }
      
      console.warn(`API responded with status: ${result.status} or invalid data structure.`, result.message)
      return []
    } catch (error) {
      console.error('Failed to fetch latest robots snapshot:', error)
      return []
    }
  }
}
