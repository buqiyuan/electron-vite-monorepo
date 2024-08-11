export interface MainMessage {
  /** 新用户加入 */
  newUserJoin: (userID: number) => string
}
