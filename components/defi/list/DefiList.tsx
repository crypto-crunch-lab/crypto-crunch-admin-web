import { Button, Descriptions, Input, message, Select, Switch, Table, Tag } from 'antd'
import axios from 'axios'
import dotProp from 'dot-prop-immutable'
import moment from 'moment'
import numeral from 'numeral'
import { useEffect, useState } from 'react'

import { Defi } from '../../../types/defi/Defi'
import { DefiNetwork } from '../../../types/defi/DefiNetwork'
import { DefiPlatform } from '../../../types/defi/DefiPlatform'
import { DefiConf } from '../DefiConf'

interface DefiSearchRequest {
  searchKeyword?: string
  size: number
  sorts: DefiSearchSort
  filters: DefiSearchFilter
  exposureType: string
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
}

const DefiList = ({ defiData, networkData }: DefiListProps) => {
  const initialRequest: DefiSearchRequest = {
    size: 10000,
    sorts: { field: 'tvl', order: 'DESC' },
    filters: { tvlRange: 0, apyRange: 0, network: 'ALL' },
    exposureType: 'ADMIN',
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
      key: 'platformName',
      render: (data: DefiPlatform) => (data.name ? data.name : ''),
    },
    {
      title: '네트워크',
      dataIndex: 'network',
      key: 'network',
      render: (data: DefiNetwork) => <Tag>{data.name}</Tag>,
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
      dataIndex: 'coinTypes',
      key: 'coinTypes',
      render: (data: any[]) => (
        <div>{data && data.length > 0 && data.map((d) => <Tag>{DefiConf.coinType[d]}</Tag>)}</div>
      ),
    },
    {
      title: '특징',
      dataIndex: 'platform',
      key: 'attributes',
      render: (data: DefiPlatform) => (
        <div>
          {data.attributes &&
            data.attributes.length > 0 &&
            data.attributes.map((d) => <Tag>{DefiConf.attribute[d]}</Tag>)}
        </div>
      ),
    },
    {
      title: '생성시간',
      dataIndex: 'syncYmdt',
      key: 'syncYmdt',
      render: (data: any) => moment(data).format('yyyy-MM-DD HH:mm:ss'),
    },
    {
      title: '수정시간',
      dataIndex: 'updateYmdt',
      key: 'updateYmdt',
      render: (data: any) => moment(data).format('yyyy-MM-DD HH:mm:ss'),
    },
    {
      title: '차트 수정시간',
      dataIndex: 'historyUpdateYmdt',
      key: 'historyUpdateYmdt',
      render: (data: any) => moment(data).format('yyyy-MM-DD HH:mm:ss'),
    },
    {
      title: '노출 여부',
      dataIndex: 'isService',
      key: 'isService',
      filters: [
        {
          text: 'Y',
          value: true,
        },
        {
          text: 'N',
          value: false,
        },
      ],
      onFilter: (value: any, record: Defi) => record.isService === value,
      render: (data: boolean, record: Defi) => (
        <Switch checked={data} onChange={() => onChangeToggle(record, 'isService')} />
      ),
    },
    {
      title: '추천 여부',
      dataIndex: 'isRecommend',
      key: 'isRecommend',
      filters: [
        {
          text: 'Y',
          value: true,
        },
        {
          text: 'N',
          value: false,
        },
      ],
      onFilter: (value: any, record: Defi) => record.isRecommend === value,
      render: (data: boolean, record: Defi) => (
        <Switch checked={data} onChange={() => onChangeToggle(record, 'isRecommend')} />
      ),
    },
  ]

  const [list, setList] = useState<any[]>()
  const [networkList, setNetworkList] = useState<any[]>()
  const [request, setRequest] = useState<DefiSearchRequest>(initialRequest)

  const onChangeKeyword = (e: any) => {
    const keyword = e.target.value
    if (keyword && keyword.length > 0) {
      setRequest(dotProp.set(request, 'searchKeyword', e.target.value))
    }
  }

  const onChangeToggle = (record: Defi, field: string) => {
    setList(
      list?.map((d: Defi) => {
        if (d.id === record.id) {
          // @ts-ignore
          return dotProp.set(d, field, !d[field])
        }
        return d
      }),
    )
    // @ts-ignore
    update(dotProp.set(record, field, !record[field]))
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

  const update = (defi: Defi) => {
    axios.post('/api/defi/update', defi).then((r) => {
      if (r && r.status === 200) {
        message.success('업데이트 성공')
      } else {
        message.warn('업데이트 실패')
      }
    })
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // eslint-disable-next-line no-prototype-builtins
    if (sorter.hasOwnProperty('column') && sorter.field && sorter.order) {
      setSorter(sorter.field, sorter.order === 'descend' ? 'DESC' : 'ASC')
    }
  }

  useEffect(() => {
    setList(defiData.data)
    setNetworkList(networkData.data)
  }, [defiData, networkData])

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
        <Descriptions.Item label='현재 개수'>
          {defiData.data ? numeral(defiData.data.length).format(',') : '0'}
        </Descriptions.Item>
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
        <Descriptions.Item label='노출 타입'>
          <Select
            defaultValue='ADMIN'
            value={request.exposureType}
            style={{ width: 200 }}
            allowClear
            onChange={(value) => setRequest(dotProp.set(request, 'exposureType', value))}
          >
            <Select.Option value='ADMIN'>어드민</Select.Option>
            <Select.Option value='SVC'>서비스</Select.Option>
            <Select.Option value='RECOMM'>추천</Select.Option>
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
