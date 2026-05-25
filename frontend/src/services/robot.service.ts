import { ApiResponse, RobotData } from '../types/robot'
import { APP_CONFIG, API_STATUS } from '../constants/config'

export const RobotService = {
  /**
   * Lấy dữ liệu lịch sử telemetry của robot trong số giờ chỉ định
   * Trả về mảng rỗng nếu xảy ra lỗi (Graceful fallback)
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
   * Lấy snapshot dữ liệu mới nhất của tất cả các robot
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
