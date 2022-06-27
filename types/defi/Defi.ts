import { DefiNetwork } from './DefiNetwork'
import { DefiPlatform } from './DefiPlatform'

export interface Defi {
  id: string
  name: string
  platform: DefiPlatform
  network: DefiNetwork
  base: number
  reward: number
  apy: number
  tvl: number
  risk: number
  defiIconUrl: string
  detailUrl: string
  coinTypes: any[]
  apySeries: any[]
  tvlSeries: any[]
  syncYmdt: string
  updateYmdt: string
  historyUpdateYmdt: string
  isService: boolean
  isRecommend: boolean
}
