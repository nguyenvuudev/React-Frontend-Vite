import React, { useEffect, useState } from 'react'
import { Table, Row, Col, Button, Popconfirm, message, notification } from 'antd'
import InputSearch from './InputSearch'
import { callDeleteUser, callFetchListUser } from '../../../services/api'
import {
  CloudUploadOutlined,
  DeleteFilled ,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditFilled 
} from '@ant-design/icons'
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant"
import UserModalCreate from './UserModalCreate'
import UserViewDetail from './UserViewDetail'
import moment from 'moment'
import UserImport from './data/UserImport'
import * as XLSX from 'xlsx'
import UserModalUpdate from './UserModalUpdate'



const UserTable = () => {
  const [listUser, setListUser] = useState([])
  const [current, setCurrent] = useState(1) // vị trí trang hiện tại là 1
  const [pageSize, setPageSize] = useState(6) // lấy ra số phần tử trong 1 trang 
  const [total, setTotal] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("") // lọc dữ liệu dựa trên các trường 
  const [sortQuery, setSortQuery] = useState("") // sắp xếp theo kiểu asc (h) desc

  const [openModalCreate, setOpenModalCreate] = useState(false)

  const [openViewDetail, setOpenViewDetail] = useState(false)
  const [dataViewDetail, setDataViewDetail] = useState(null)

  const [openModalImport, setOpenModalImport] = useState(false)

  const [openModalUpdate, setOpenModalUpdate] = useState(false)
  const [dataUpdate, setDataUpdate] = useState(null)

  useEffect(() => {
    fetchUser()
  }, [current, pageSize, filter, sortQuery])

  const fetchUser = async () => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (filter) {
      query += `&${filter}` // lưu trữ giá trị người dùng nhập vào ô tìm kiếm
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
          <a className='custom-link' href="#" onClick={() => {
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
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa user"}
              description={"Bạn có chắc chắn muốn xóa user này không?"}
              onConfirm={() => handleDeleteUser(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteFilled
                className='custom-icon-delete'
                />
              </span>
            </Popconfirm>
            <span style={{ cursor: "pointer", margin: '0 30px' }}>
              <EditFilled 
                className='custom-icon-edit'
                onClick={() => {
                  setOpenModalUpdate(true)
                  setDataUpdate(record)
                }}
              />
            </span>
          </>
        )
      },

    }
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
      <>
        <div className='custom-header-table'>
          <span>Table List User</span>
          <span style={{ display: 'flex', gap: 15 }}>
            <Button
              icon={<ExportOutlined />}
              type="primary"
              onClick={() => handleExport()}
            >Xuất</Button>

            <Button
              icon={<CloudUploadOutlined />}
              type="primary"
              onClick={() => setOpenModalImport(true)}
            >Tải lên</Button>

            <Button
              icon={<PlusOutlined />}
              type="dashed"
              onClick={() => setOpenModalCreate(true)}
            >
              Thêm mới

            </Button>

            <Button
              type='ghost'
              onClick={() => {
                setFilter("")
                setSortQuery("")
              }}>
              <ReloadOutlined />
            </Button>
          </span>
        </div>
      </>
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

  const handleExport = () => {
    if (listUser.length > 0) {
      console.log('====check leng listUser:', listUser.length);
      const workSheet = XLSX.utils.json_to_sheet(listUser) // Chuyển đổi dữ liệu json sang sheet(bảng tính)
      const workBook = XLSX.utils.book_new() // Tạo ra một book mới tương đương với một file Excel
      XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1") // Thêm wokSheet vừa tạo vào workBook
      XLSX.writeFile(workBook, "DataExcel.xlsx") // Ghi workBook ra file với tên DataExcel.xlsx
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
        <div className='custom-table-list'>
          <Col span={24}>
            <Table
              title={renderHeader}
              loading={isLoading}
              headerSplitColor={"black"}

              className="def"
              columns={columns}
              dataSource={listUser}
              onChange={onChange}
              rowKey="_id"
              pagination={
                {
                  className: "custom-pagination-table",
                  current: current,
                  pageSize: pageSize,
                  pageSizeOptions: [5, 10, 20, 50, 100],
                  showSizeChanger: true,
                  total: total,
                  showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} hàng</div>) }
                }
              }
            />
          </Col>
        </div>
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
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        fetchUser={fetchUser}
      />

      <UserModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchUser={fetchUser}
      />
    </>
  )
}

export default UserTable
