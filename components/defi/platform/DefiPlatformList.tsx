import { Button, Descriptions, message, Select, Table } from 'antd'
import axios from 'axios'
import dotProp from 'dot-prop-immutable'
import numeral from 'numeral'
import { useEffect, useState } from 'react'

import { DefaultResponse } from '../../../types/DefaultResponse'
import { DefiPlatform } from '../../../types/defi/DefiPlatform'
import { DefiConf } from '../DefiConf'

interface DefiPlatformListProps {
  platformData: DefaultResponse<DefiPlatform[]>
}

const DefiPlatformList = ({ platformData }: DefiPlatformListProps) => {
  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '특징',
      dataIndex: 'attributes',
      key: 'attributes',
      render: (data: any, record: any) => (
        <div>
          <Select
            style={{ width: '750px' }}
            mode='multiple'
            allowClear
            onChange={(values: string[]) => {
              if (attributeList.find((a) => a.id === record.id)) {
                setAttributeList(
                  attributeList.map((a) => {
                    if (a.id === record.id) {
                      return dotProp.set(a, 'attributes', values)
                    }
                    return a
                  }),
                )
              } else {
                setAttributeList(attributeList.concat({ id: record.id, attributes: values }))
              }
            }}
            defaultValue={data && data.length > 0 ? data : []}
          >
            {Object.entries(DefiConf.attribute).map(([key, value]: [string, any]) => (
              <Select.Option value={key}>{value}</Select.Option>
            ))}
          </Select>
          <Button
            onClick={async (e) => {
              const platform = dotProp.set(
                record,
                'attributes',
                attributeList.find((c) => c.id === record.id).attributes,
              )
              if (platform && platform.attributes) {
                update(platform)
              } else {
                message.warn('업데이트 실패')
              }
            }}
          >
            수정
          </Button>
        </div>
      ),
    },
  ]

  const [list, setList] = useState<DefiPlatform[]>()
  const [attributeList, setAttributeList] = useState<any[]>([])
  const [setting, setSetting] = useState<string>('ALL')

  const reset = async () => {
    const res = await axios.get('/api/defi/platforms')
    if (res && res.data) {
      setList(res.data.data)
    }
  }

  const search = async () => {
    await fetchList()
  }

  const fetchList = async () => {
    const res = await axios.get('/api/defi/platforms')
    if (res && res.data) {
      if (setting === 'Y') {
        setList(res.data.data.filter((d: DefiPlatform) => d.attributes && d.attributes.length > 0))
      } else if (setting === 'N') {
        setList(res.data.data.filter((d: DefiPlatform) => !d.attributes || d.attributes.length === 0))
      } else {
        setList(res.data.data)
      }
    }
  }

  const update = (platform: DefiPlatform) => {
    axios.post('/api/defi/platforms/update', platform).then((r) => {
      if (r && r.status === 200) {
        fetchList().then((r) => message.success('업데이트 성공'))
      } else {
        message.warn('업데이트 실패')
      }
    })
  }

  useEffect(() => {
    setList(platformData.data)
  }, [platformData])

  return (
    <>
      <Descriptions
        title='플랫폼 리스트'
        bordered={true}
        style={{ marginBottom: '25px' }}
        contentStyle={{ background: 'white' }}
      >
        <Descriptions.Item label='현재 개수'>
          {platformData ? numeral(platformData.data.length).format(',') : '0'}
        </Descriptions.Item>
        <Descriptions.Item label='검색 결과 개수'>{list ? numeral(list.length).format(',') : '0'}</Descriptions.Item>
      </Descriptions>
      <Descriptions bordered={true} style={{ marginBottom: '50px' }} contentStyle={{ background: 'white' }}>
        <Descriptions.Item label='특징 설정 여부'>
          <Select
            defaultValue={setting}
            value={setting}
            style={{ width: 200 }}
            allowClear
            onChange={(value) => setSetting(value)}
          >
            <Select.Option value='ALL'>전체</Select.Option>
            <Select.Option value='Y'>설정</Select.Option>
            <Select.Option value='N'>미설정</Select.Option>
          </Select>
        </Descriptions.Item>
      </Descriptions>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <Button type='primary' style={{ width: 100 }} size='large' onClick={search}>
          검색
        </Button>
        <Button style={{ width: 100, marginLeft: 10 }} size='large' onClick={reset}>
          초기화
        </Button>
      </div>
      <Table columns={columns} dataSource={list} />
    </>
  )
}

export default DefiPlatformList
