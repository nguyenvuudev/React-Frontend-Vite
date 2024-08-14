import React, { useEffect, useState } from 'react'
import { Table, Row, Col, Button, Popconfirm, message, notification } from 'antd'
import InputSearch from './InputSearch'
import { callDeleteUser, callFetchListUser } from '../../../services/api'
import { CloudUploadOutlined, DeleteTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'

const UserTable = () => {
  const [listUser, setListUser] = useState([])
  const [current, setCurrent] = useState(1) // vị trí trang hiện tại là 1
  const [pageSize, setPageSize] = useState(5) // lấy ra số phần tử trong 1 trang 
  const [total, setTotal] = useState(0)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [current, pageSize])

  const fetchUser = async (searchFilter) => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (searchFilter) {
      query += `&${searchFilter}`
    }
    const res = await callFetchListUser(query)
    if (res && res.data) {
      setListUser(res.data.result)
      setTotal(res.data.meta.total)
    }
    setIsLoading(false)
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
          <Popconfirm
            placement="leftTop"
            title={"Xác nhận xóa user"}
            description={"Bạn có chắc chắn muốn xóa user này không?"}
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <span style={{ cursor: "pointer" }}>
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </span>
          </Popconfirm>
        )
      }
    },
  ]

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current)
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize)
    }
    console.log('params', pagination, filters, sorter, extra)
  }

  const handleSearch = (query) => {
    fetchUser(query)
  }

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Table List User</span>
        <span style={{ display: 'flex', gap: 15 }}>
          <Button
            icon={<ExportOutlined />}
            type="primary"
          >Export</Button>

          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
          >Import</Button>

          <Button
            icon={<PlusOutlined />}
            type="primary"
          >Thêm mới</Button>
          <Button type='ghost' onClick={() => fetchUser()}>
            <ReloadOutlined />
          </Button>
        </span>
      </div>
    )
  }

  const handleDeleteUser = async (userId) => {
    const res = await callDeleteUser(userId)
    if (res && res.data) {
      message.success('Xóa user thành công')
      fetchUser()
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: res.message
      })
    }
  }

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}

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
