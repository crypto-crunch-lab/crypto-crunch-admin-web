import { Button, Descriptions, Input, Select, Table } from 'antd'
import axios from 'axios'
import dotProp from 'dot-prop-immutable'
import numeral from 'numeral'
import { useEffect, useState } from 'react'

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
  },
  {
    title: 'APY',
    dataIndex: 'apy',
    key: 'apy',
    render: (data: number) => `${(data * 100).toFixed(3)}%`,
  },
  {
    title: 'TVL',
    dataIndex: 'tvl',
    key: 'tvl',
    render: (data: any) => numeral(data).format(','),
  },
]

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
  network?: string
  tvlRange: number
  apyRange: number
}

interface DefiListProps {
  data: any
}

const DefiList = ({ data }: DefiListProps) => {
  const initialRequest = {
    size: 10000,
    sorts: { field: 'tvl', order: 'DESC' },
    filters: { tvlRange: 0, apyRange: 0 },
  }

  const [list, setList] = useState<any[]>()
  const [request, setRequest] = useState<DefiSearchRequest>(initialRequest)

  const onChangeKeyword = (e: any) => {
    const keyword = e.target.value
    if (keyword && keyword.length > 0) {
      setRequest(dotProp.set(request, 'searchKeyword', e.target.value))
    }
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
    const res = await axios.post('/api/defi', request)
    if (res && res.data) {
      setList(res.data)
    }
  }

  useEffect(() => {
    setList(data)
  }, [data])

  return (
    <>
      <Descriptions
        title='디파이 리스트'
        bordered={true}
        style={{ marginBottom: '25px' }}
        contentStyle={{ background: 'white' }}
      >
        <Descriptions.Item label='현재 개수'>{data ? numeral(data.length).format(',') : '0'}</Descriptions.Item>
        <Descriptions.Item label='검색 결과 개수'>{list ? numeral(list.length).format(',') : '0'}</Descriptions.Item>
      </Descriptions>
      <Descriptions bordered={true} style={{ marginBottom: '50px' }} contentStyle={{ background: 'white' }}>
        <Descriptions.Item label='키워드'>
          <Input value={request.searchKeyword} onChange={(e) => onChangeKeyword(e)} />
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

export default DefiList
