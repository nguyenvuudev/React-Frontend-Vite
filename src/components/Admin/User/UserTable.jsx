import React, { useEffect, useState } from 'react'
import { Table, Row, Col } from 'antd'
import InputSearch from './InputSearch'
import { callFetchListUser } from '../../../services/api'

const UserTable = () => {
  const [listUser, setListUser] = useState([])
  const [current, setCurrent] = useState(1) // vị trí trang hiện tại là 1
  const [pageSize, setPageSize] = useState(5) // lấy ra số phần tử trong 1 trang 
  const [total, setTotal] = useState(0) 

  useEffect(() => {
    fetchUser()
  }, [current, pageSize])

  const fetchUser = async () => {
    const query = `current=${current}&pageSize=${pageSize}`
    const res = await callFetchListUser(query)
    if (res && res.data) {
      setListUser(res.data.result)
      setTotal(res.data.meta.total)
    }
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'fullName',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: true,
    },
    {
      title: 'Action',
      render: (text, record, index) => {
        return (
          <><button>Delete</button></>
        )
      }
    },
  ]

  // let data = [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     chinese: 98,
  //     math: 60,
  //     english: 70,
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     chinese: 98,
  //     math: 66,
  //     english: 89,
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     chinese: 98,
  //     math: 90,
  //     english: 70,
  //   },
  //   {
  //     key: '4',
  //     name: 'Jim Red',
  //     chinese: 88,
  //     math: 99,
  //     english: 89,
  //   },
  // ]

  // Fake data
  // data = data.concat(data).concat(data).concat(data).concat(data)
  // data = data.concat(data)

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current)
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize)
    }
    console.log('params', pagination, filters, sorter, extra)
  }

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch />
        </Col>
        <Col span={24}>
          <Table
            className="def"
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            rowKey="_id"
            pagination={
              {
                current: current,
                pageSize: pageSize,
                showSizeChanger: true,
                total: total
              }
            }
          />
        </Col>
      </Row>
    </>
  )
}

export default UserTable
