import { Col, message, notification, Popconfirm, Row, Table } from "antd"
import { useEffect, useState } from "react"
import { callDeleteBook, callFetchListBook } from "../../../services/api"
import Button from "antd/es/button"
import { DeleteFilled, EditFilled, ExportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import InputSearch from "./InputSearch"
import BookViewDetail from "./BookViewDetail"
import BookModalCreate from "./BookModalCreate"
import '../Scss/ViewDetail.scss'
import '../Scss/ModalCommon.scss'
import moment from "moment"
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant"
import BookModalUpdate from "./BookModalUpdate"
import * as XLSX from 'xlsx'

const BookTable = () => {

  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [total, setTotal] = useState(0)

  const [isLoading, setIsLoading] = useState("")
  const [filter, setFilter] = useState("")
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt") // những quyển sách khi mà được thêm mới vào sẽ được đẩy lên đầu tiên

  const [openModalCreate, setOpenModalCreate] = useState(false)

  const [openModalUpdate, setOpenModalUpdate] = useState(false)
  const [dataUpdate, setDataUpdate] = useState(null)

  const [openViewDetail, setOpenViewDetail] = useState(false)
  const [dataViewDetail, setDataViewDetail] = useState("")

  useEffect(() => {
    fetchBook()
  }, [current, pageSize, filter, sortQuery])

  const fetchBook = async () => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (filter) {
      query += `&${filter}`
    }
    if (sortQuery) {
      query += `&${sortQuery}`
    }

    const res = await callFetchListBook(query)
    if (res && res.data) {
      setListBook(res.data.result)
      setTotal(res.data.meta.total)
    }
    setIsLoading(false)
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      render: (text, record, index) => {
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
      title: 'Tên sách',
      dataIndex: 'mainText',
      sorter: true
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      sorter: true
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      sorter: true
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      sorter: true,
      render: (text, record, index) => {
        return (
          <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)}</>
        )
      }
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
              title="Xác nhận xóa sách"
              description="Bạn có chắc chắn muốn xóa sách này không?"
              onConfirm={() => handleDeleteBook(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteFilled
                  className='custom-icon-delete'
                />
              </span>
            </Popconfirm>
            <span style={{ cursor: "pointer", margin: "0 30px" }}>
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
      }
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

    if (sorter && sorter.field) {
      const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
      setSortQuery(q)
    }
  }

  const handleSearch = (query) => {
    setFilter(query)
  }

  const handleDeleteBook = async (bookId) => {
    const res = await callDeleteBook(bookId)
    if (res && res.data) {
      message.success("Xóa sách thành công")
      fetchBook()
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message
      })
    }
  }
  const renderHeader = () => {
    return (
      <>
        <div className="custom-header-table">
          <span>Danh mục sách</span>
          <div style={{ display: 'flex', gap: 15 }}>
            <Button
              icon={<ExportOutlined />}
              type="primary"
              onClick={() => handleExport()}
            >
              Xuất
            </Button>
            <Button
              icon={<PlusOutlined />}
              type="dashed"
              onClick={() => setOpenModalCreate(true)}
            >
              Thêm mới
            </Button>
            <Button
              type="ghost"
              onClick={() => {
                setFilter("")
                setSortQuery("")
              }}
            >
              <ReloadOutlined />
            </Button>
          </div>
        </div>
      </>
    )
  }

  const handleExport = () => {
    if (listBook.length > 0) {
      // Loại bỏ các trường thumbnail và slider khỏi từng phần tử trong listBook
      const modifiedListBook = listBook.map(({ thumbnail, slider, ...rest }) => rest)

      const workSheet = XLSX.utils.json_to_sheet(modifiedListBook) // Chuyển đổi dữ liệu json sang sheet(bảng tính)
      const workBook = XLSX.utils.book_new() // Tạo ra một book mới tương đương với một file Excel
      XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1") // Thêm workSheet vừa tạo vào workBook
      XLSX.writeFile(workBook, "DataBookExcel.xlsx") // Ghi workBook ra file với tên DataExcel.xlsx
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
        <div className="custom-table-list">
          <Col span={24}>
            <Table
              loading={isLoading}
              title={renderHeader}
              columns={columns}
              dataSource={listBook}
              onChange={onChange}
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
            >

            </Table>
          </Col>
        </div>
      </Row>

      <BookModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchBook={fetchBook}
      />

      <BookViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <BookModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchBook={fetchBook}
      />
    </>
  )
}

export default BookTable