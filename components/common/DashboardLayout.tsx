import { Layout, Menu } from 'antd'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import { ATOMS } from '../../states'

import AuthModal from './AuthModal'

const { Content, Footer, Sider } = Layout
const { SubMenu } = Menu

interface DashboardLayoutProps {
  content: any
  path: string
}

const DashboardLayout = ({ content, path }: DashboardLayoutProps) => {
  const router = useRouter()
  const { menuState, subMenuState } = ATOMS

  const [menuSeq, setMenuSeq] = useRecoilState(menuState)
  const [subMenuSeq, setSubMenuSeq] = useRecoilState(subMenuState)
  const [isLogin, setLogin] = useState<boolean>()

  const mapRouterPath = () => {
    switch (path) {
      case '/defi/list':
        setMenuSeq('0-0')
        break
      case '/defi/platform':
        setMenuSeq('0-1')
        break
      default:
        break
    }
  }

  useEffect(() => {
    setLogin(localStorage.getItem('CRYPTO_ADMIN_LOGIN') === 'Y')
    mapRouterPath()
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className='logo' />
        {menuSeq !== '' && (
          <Menu
            theme='dark'
            defaultSelectedKeys={['0-0']}
            selectedKeys={[menuSeq]}
            defaultOpenKeys={['0']}
            openKeys={[subMenuSeq]}
            mode='inline'
          >
            <SubMenu key='0' title={<span>디파이</span>}>
              <Menu.Item
                key='0-0'
                onClick={() => {
                  setMenuSeq('0-0')
                  setSubMenuSeq('0')
                  router.push('/defi/list')
                }}
              >
                디파이 리스트
              </Menu.Item>
              <Menu.Item
                key='0-1'
                onClick={() => {
                  setMenuSeq('0-1')
                  setSubMenuSeq('0')
                  router.push('/defi/platform')
                }}
              >
                플랫폼 리스트
              </Menu.Item>
            </SubMenu>
            <SubMenu key='1' title={<span>마켓</span>} />
          </Menu>
        )}
      </Sider>
      <Layout>
        {/* <Header style={{ background: '#fff', padding: 0 }}></Header> */}
        <Content style={{ margin: '40px 16px' }}>{content}</Content>
        <Footer style={{ textAlign: 'center' }}>Crypto Crunch ©2022</Footer>
      </Layout>
      {!isLogin && <AuthModal />}
    </Layout>
  )
}

export default DashboardLayout
