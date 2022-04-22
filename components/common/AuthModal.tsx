import { Button, Form, Input, message, Modal } from 'antd'
import { useState } from 'react'

const AuthModal = () => {
  const [visible, setVisible] = useState<boolean>(true)

  const handleOk = () => {
    window.history.back()
  }
  const handleCancel = () => {
    window.history.back()
  }

  const onFinish = (values: any) => {
    if (authUser(values)) {
      setVisible(false)
      localStorage.setItem('CRYPTO_ADMIN_LOGIN', 'Y')
    } else {
      message.warning('올바른 계정 정보가 아닙니다.')
    }
  }

  const authUser = (values: any) => {
    const userId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
    const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

    return values.userId === userId && values.password === password
  }

  return (
    <div>
      <Modal visible={visible} onOk={handleOk} onCancel={handleCancel} closable={false} footer={null}>
        <div>
          <Form name='basic' initialValues={{ remember: true }} autoComplete='off' onFinish={onFinish}>
            <Form.Item
              label='어드민 ID'
              name='userId'
              rules={[{ required: true, message: '어드민 계정을 입력하세요.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label='비밀번호' name='password' rules={[{ required: true, message: '패스워드를 입력하세요.' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
              <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
                로그인
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default AuthModal
