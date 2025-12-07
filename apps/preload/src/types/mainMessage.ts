import type { AppUpdateState } from '@repo/shared-types/updater'

export interface MainMessage {
  /** Broadcast when a new user joins */
  'newUserJoin': (userID: number) => string
  /** Pushes update status to the renderer */
  'app:updateState': (state: AppUpdateState) => void
  /** OAuth login callback payload */
  'oauth2:google-callback': (query: string) => void
  /** Invite users into a project */
  'invite:to-project': (query: string) => void
  /** Request the renderer to open a page */
  'open:page': (query: string) => void
}
