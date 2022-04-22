import { Layout, Menu } from 'antd'
import { useEffect, useState } from 'react'

import AuthModal from './AuthModal'

const { Content, Footer, Sider } = Layout
const { SubMenu } = Menu

interface DashboardLayoutProps {
  content: any
}

const DashboardLayout = ({ content }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState<boolean>()
  const [isLogin, setLogin] = useState<boolean>()

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed)
  }

  useEffect(() => {
    setLogin(localStorage.getItem('CRYPTO_ADMIN_LOGIN') === 'Y')
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className='logo' />
        <Menu theme='dark' defaultSelectedKeys={['sub1']} mode='inline'>
          <SubMenu key='sub1' title={<span>디파이</span>}>
            <Menu.Item key='1'>디파이 리스트</Menu.Item>
          </SubMenu>
          <SubMenu key='sub2' title={<span>마켓</span>} />
        </Menu>
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
