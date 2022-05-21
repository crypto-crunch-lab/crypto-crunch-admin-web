export interface Defi {
  id: string
  name: string
  platform: string
  network: string
  base: number
  reward: number
  apy: number
  tvl: number
  risk: number
  defiIconUrl: string
  platformIconUrl: string
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
