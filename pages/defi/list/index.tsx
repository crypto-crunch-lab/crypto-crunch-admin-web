import axios from 'axios'
import type { NextPage } from 'next'

import DashboardLayout from '../../../components/common/DashboardLayout'
import DefiList from '../../../components/defi/list/DefiList'

const DefiListPage: NextPage = ({ data }: any) => {
  return <DashboardLayout content={<DefiList data={data} />} />
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const { data } = await axios.post('http://server.crypto-crunch-tech.com:8080/api/v1/defi', { size: 10000 })

  // Pass data to the page via props
  return { props: { data } }
}

export default DefiListPage
