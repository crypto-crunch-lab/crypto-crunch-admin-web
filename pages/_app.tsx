import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../styles/antd.less'
import 'antd/dist/antd.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp
