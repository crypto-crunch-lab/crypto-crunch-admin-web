import axios from 'axios'
import type { NextPage } from 'next'

import DashboardLayout from '../../../components/common/DashboardLayout'
import DefiList from '../../../components/defi/list/DefiList'

const DefiListPage: NextPage = ({ defiData, networkData, metaData }: any) => {
  return <DashboardLayout content={<DefiList defiData={defiData} networkData={networkData} metaData={metaData}/>}/>
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const defiResponse = await axios.post('http://server.crypto-crunch-tech.com:8080/api/v1/defi', { size: 10000 })
  const networkResponse = await axios.get('http://server.crypto-crunch-tech.com:8080/api/v1/defi/networks')
  const metaResponse = await axios.get('http://server.crypto-crunch-tech.com:8080/api/v1/defi/admin/meta')

  // Pass data to the page via props
  return { props: { defiData: defiResponse.data, networkData: networkResponse.data, metaData: metaResponse.data } }
}

export default DefiListPage
