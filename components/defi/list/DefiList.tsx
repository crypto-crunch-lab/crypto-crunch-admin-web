import { Button, Descriptions, Input, message, Select, Table, Tag } from 'antd'
import axios from 'axios'
import dotProp from 'dot-prop-immutable'
import numeral from 'numeral'
import { useEffect, useState } from 'react'

import { DefiConf } from '../DefiConf'

interface DefiSearchRequest {
  searchKeyword?: string
  size: number
  sorts: DefiSearchSort
  filters: DefiSearchFilter
}

interface DefiSearchSort {
  field?: string
  order?: string
}

interface DefiSearchFilter {
  network: string
  tvlRange: number
  apyRange: number
}

interface DefiListProps {
  defiData: any
  networkData: any
  metaData: any
}

const DefiList = ({ defiData, networkData, metaData }: DefiListProps) => {
  const initialRequest = {
    size: 10000,
    sorts: { field: 'tvl', order: 'DESC' },
    filters: { tvlRange: 0, apyRange: 0, network: 'ALL' },
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'age',
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '플랫폼',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: '네트워크',
      dataIndex: 'network',
      key: 'network',
      render: (data: string) => <Tag>{data}</Tag>,
    },
    {
      title: 'APY',
      dataIndex: 'apy',
      key: 'apy',
      sorter: true,
      render: (data: number) => `${(data * 100).toFixed(3)}%`,
    },
    {
      title: 'TVL',
      dataIndex: 'tvl',
      key: 'tvl',
      sorter: true,
      render: (data: any) => `$${numeral(data).format(',')}`,
    },
    {
      title: '코인 유형',
      dataIndex: 'coinType',
      key: 'coinType',
      render: (data: any, record: any) =>
        DefiConf.coinType[data] || (
          <div>
            <Select
              // value={request.filters.network}
              style={{ width: 150 }}
              allowClear
              onChange={(value: string) => {
                const update = { id: record.id, coinType: value }
                setCoinTypeList(coinTypeList.concat(update))
              }}
            >
              {meta &&
                meta.coinTypeMap &&
                Object.entries(meta.coinTypeMap).map(([key, value]: [string, any]) => (
                  <Select.Option value={key}>{value}</Select.Option>
                ))}
            </Select>
            <Button
              onClick={(e) => {
                let defi = record
                defi = dotProp.set(defi, 'coinType', coinTypeList.find((c) => c.id === record.id).coinType)
                if (defi && defi.coinType) {
                  update(defi)
                } else {
                  message.warn('업데이트 실패')
                }
              }}
            >
              등록
            </Button>
          </div>
        ),
    },
    {
      title: '특징',
      dataIndex: 'attributes',
      key: 'attributes',
      render: (data: any, record: any) =>
        DefiConf.attribute[data] || (
          <div>
            <Select
              // value={request.filters.network}
              style={{ width: 150 }}
              allowClear
              onChange={(value: string) => {
                const update = { id: record.id, attribute: value }
                setAttributeList(attributeList.concat(update))
              }}
            >
              {meta &&
                meta.attributeTypeMap &&
                Object.entries(meta.attributeTypeMap).map(([key, value]: [string, any]) => (
                  <Select.Option value={key}>{value}</Select.Option>
                ))}
            </Select>
            <Button
              onClick={async (e) => {
                let defi = record
                defi = dotProp.set(
                  defi,
                  'attributes',
                  defi.attributes
                    ? defi.attributes.concat(attributeList.find((c) => c.id === record.id).attribute)
                    : [attributeList.find((c) => c.id === record.id).attribute],
                )
                if (defi && defi.attributes) {
                  const res = await update(defi)
                } else {
                  message.warn('업데이트 실패')
                }
              }}
            >
              등록
            </Button>
          </div>
        ),
    },
  ]

  const [list, setList] = useState<any[]>()
  const [networkList, setNetworkList] = useState<any[]>()
  const [meta, setMeta] = useState<any>()
  const [request, setRequest] = useState<DefiSearchRequest>(initialRequest)
  const [coinTypeList, setCoinTypeList] = useState<any[]>([])
  const [attributeList, setAttributeList] = useState<any[]>([])

  const onChangeKeyword = (e: any) => {
    const keyword = e.target.value
    if (keyword && keyword.length > 0) {
      setRequest(dotProp.set(request, 'searchKeyword', e.target.value))
    }
  }

  const setSorter = (field: string, order: any) => {
    let sort = request.sorts
    sort = dotProp.set(sort, 'field', field)
    sort = dotProp.set(sort, 'order', order)
    setRequest(dotProp.set(request, 'sorts', sort))
  }

  const setFilter = (key: string, value: any) => {
    const filter = request.filters
    setRequest(dotProp.set(request, 'filters', dotProp.set(filter, key, value)))
  }

  const reset = async () => {
    setRequest(initialRequest)
    const res = await axios.post('/api/defi', initialRequest)
    if (res && res.data) {
      setList(res.data)
    }
  }

  const search = async () => {
    await fetchList()
  }

  const fetchList = async () => {
    const res = await axios.post('/api/defi', request)
    if (res && res.data) {
      setList(res.data)
    }
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // eslint-disable-next-line no-prototype-builtins
    if (sorter.hasOwnProperty('column') && sorter.field && sorter.order) {
      setSorter(sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC')
    }
  }

  const update = (defi: any) => {
    axios.post('/api/defi/update', defi).then((r) => {
      if (r && r.status === 200) {
        message.success('업데이트 성공').then((r) => fetchList().then((r) => r))
      }
    })
  }

  useEffect(() => {
    setList(defiData)
    setNetworkList(networkData)
    setMeta(metaData)
  }, [defiData, networkData, metaData])

  useEffect(() => {
    fetchList().then((r) => r)
  }, [request.sorts])

  return (
    <>
      <Descriptions
        title='디파이 리스트'
        bordered={true}
        style={{ marginBottom: '25px' }}
        contentStyle={{ background: 'white' }}
      >
        <Descriptions.Item label='현재 개수'>{defiData ? numeral(defiData.length).format(',') : '0'}</Descriptions.Item>
        <Descriptions.Item label='검색 결과 개수'>{list ? numeral(list.length).format(',') : '0'}</Descriptions.Item>
      </Descriptions>
      <Descriptions bordered={true} style={{ marginBottom: '50px' }} contentStyle={{ background: 'white' }}>
        <Descriptions.Item label='네트워크'>
          <Select
            defaultValue={networkData[0]}
            value={request.filters.network}
            style={{ width: 200 }}
            allowClear
            onChange={(value) => setFilter('network', value)}
          >
            {networkList && networkList.map((n) => <Select.Option value={n}>{n}</Select.Option>)}
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label='TVL'>
          <Select
            defaultValue={0}
            value={request.filters.tvlRange}
            style={{ width: 200 }}
            allowClear
            onChange={(value) => setFilter('tvlRange', value)}
          >
            <Select.Option value={0}>TVL 0 이상</Select.Option>
            <Select.Option value={1}>TVL 10K 이상</Select.Option>
            <Select.Option value={2}>TVL 100K 이상</Select.Option>
            <Select.Option value={3}>TVL 1M 이상</Select.Option>
            <Select.Option value={4}>TVL 10M 이상</Select.Option>
            <Select.Option value={5}>TVL 100M 이상</Select.Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label='APY'>
          <Select
            defaultValue={0}
            value={request.filters.apyRange}
            style={{ width: 200 }}
            allowClear
            onChange={(value) => setFilter('apyRange', value)}
          >
            <Select.Option value={0}>APY 0 이상</Select.Option>
            <Select.Option value={1}>APY 10% 이상</Select.Option>
            <Select.Option value={2}>APY 30% 이상</Select.Option>
            <Select.Option value={3}>APY 50% 이상</Select.Option>
            <Select.Option value={4}>APY 100% 이상</Select.Option>
            <Select.Option value={5}>APY 200% 이상</Select.Option>
            <Select.Option value={6}>APY 500% 이상</Select.Option>
            <Select.Option value={7}>APY 1000% 이상</Select.Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label='키워드'>
          <Input value={request.searchKeyword} onChange={(e) => onChangeKeyword(e)} />
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
      <Table columns={columns} dataSource={list} onChange={handleTableChange} />
    </>
  )
}

export default DefiList
