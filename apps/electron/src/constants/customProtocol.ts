import { isDev } from '/@/constants/common'

/** Custom protocol for launching the application */
export const appProtocolName = isDev ? 'bqy-dev' : 'bqy'
/** Custom media protocol for browsing local resource files */
export const mediaProtocolName = 'bqy-media'
/** Custom API request protocol */
export const httpProtocolName = 'bqy-http'
