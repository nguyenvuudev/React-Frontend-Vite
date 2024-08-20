import React, { useEffect, useState } from 'react'
import { Table, Row, Col, Button, Popconfirm, message, notification } from 'antd'
import InputSearch from './InputSearch'
import { callDeleteUser, callFetchListUser } from '../../../services/api'
import { CloudUploadOutlined, DeleteTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant"
import UserModalCreate from './UserModalCreate'
import UserViewDetail from './UserViewDetail'
import moment from 'moment'
import UserImport from './data/UserImport'



const UserTable = () => {
  const [listUser, setListUser] = useState([])
  const [current, setCurrent] = useState(1) // vị trí trang hiện tại là 1
  const [pageSize, setPageSize] = useState(5) // lấy ra số phần tử trong 1 trang 
  const [total, setTotal] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("") // lọc dữ liệu dựa trên các trường 
  const [sortQuery, setSortQuery] = useState("") // sắp xếp theo kiểu asc (h) desc

  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openViewDetail, setOpenViewDetail] = useState(false)
  const [dataViewDetail, setDataViewDetail] = useState(null)

  const [openModalImport, setOpenModalImport] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [current, pageSize, filter, sortQuery])

  const fetchUser = async () => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (filter) {
      query += `&${filter}`
    }
    if (sortQuery) {
      query += `&${sortQuery}`
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
      render: (text, record, index) => { // record: lấy toàn bộ data trên một hàng
        return (
          <a href="#" onClick={() => {
            setOpenViewDetail(true)
            setDataViewDetail(record)
          }}
          >{record._id}</a>
        )
      }
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
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (text, record, index) => {
        return (
          <>
            {moment(record.updatedAt).format(FORMAT_DATE_DISPLAY)}
          </>
        )
      }

    },
    {
      title: 'Hành động',
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
      setCurrent(1)
    }
    // console.log('params', pagination, filters, sorter, extra)

    if (sorter && sorter.field) {
      const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
      setSortQuery(q)
    }
  }



  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Table List User</span>
        <span style={{ display: 'flex', gap: 15 }}>
          <Button
            icon={<ExportOutlined />}
            type="primary"
          >Xuất</Button>

          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => setOpenModalImport(true)}
          >Tải lên</Button>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >Thêm mới</Button>
          <Button type='ghost' onClick={() => {
            setFilter("")
            setSortQuery("")
          }}>
            <ReloadOutlined />
          </Button>
        </span>
      </div>
    )
  }

  const handleSearch = (query) => {
    setFilter(query)
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
          <InputSearch
            handleSearch={handleSearch}
            setFilter={setFilter}
          />
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
                total: total,
                showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} hàng</div>) }
              }
            }
          />
        </Col>
      </Row>

      <UserModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchUser={fetchUser}
      />

      <UserViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <UserImport
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
      />
    </>
  )
}

export default UserTable
