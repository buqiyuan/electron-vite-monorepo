export interface RenderMessage {
  /** 根据 ID 获取用户名 */
  getUsernameById: (userID: number) => string
  /** 获取系统信息 */
  getOsInfo: () => string
}
