import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import DashboardLayout from '../../../components/common/DashboardLayout'
import DefiPlatformList from '../../../components/defi/platform/DefiPlatformList'
import { DefaultResponse } from '../../../types/DefaultResponse'
import { DefiPlatform } from '../../../types/defi/DefiPlatform'

const DefiPlatformPage: NextPage = ({ platformData }: any) => {
  const router = useRouter()
  return <DashboardLayout content={<DefiPlatformList platformData={platformData} />} path={router.asPath} />
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const platformResponse: DefaultResponse<DefiPlatform[]> = await axios.get(
    'http://server.crypto-crunch-tech.com:8080/api/v1/defi/admin/platforms',
  )

  // Pass data to the page via props
  return { props: { platformData: platformResponse.data } }
}

export default DefiPlatformPage
