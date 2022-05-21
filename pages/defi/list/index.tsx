import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import DashboardLayout from '../../../components/common/DashboardLayout'
import DefiList from '../../../components/defi/list/DefiList'
import { DefaultResponse } from '../../../types/DefaultResponse'
import { Defi } from '../../../types/defi/Defi'

const DefiListPage: NextPage = ({ defiData, networkData }: any) => {
  const router = useRouter()
  return <DashboardLayout content={<DefiList defiData={defiData} networkData={networkData} />} path={router.asPath} />
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const defiResponse: DefaultResponse<Defi[]> = await axios.post(
    'http://server.crypto-crunch-tech.com:8080/api/v1/defi/svc',
    {
      size: 10000,
      sorts: { field: 'tvl', order: 'DESC' },
      filters: { tvlRange: 0, apyRange: 0, network: 'ALL' },
      exposureType: 'ADMIN',
    },
  )
  const networkResponse = await axios.get('http://server.crypto-crunch-tech.com:8080/api/v1/defi/svc/networks')

  // Pass data to the page via props
  return { props: { defiData: defiResponse.data, networkData: networkResponse.data } }
}

export default DefiListPage
