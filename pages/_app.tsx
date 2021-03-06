import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../styles/antd.less'
import 'antd/dist/antd.css'
import { RecoilRoot } from 'recoil'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
