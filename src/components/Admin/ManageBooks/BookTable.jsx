import { Col, Row, Table } from "antd"
import { useEffect, useState } from "react"
import { callFetchListBook } from "../../../services/api"
import Button from "antd/es/button"
import { ReloadOutlined } from "@ant-design/icons"
import InputSearch from "./InputSearch"
import BookViewDetail from "./BookViewDetail"
import BookModalCreate from "./BookModalCreate"


const BookTable = () => {

  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [total, setTotal] = useState(0)

  const [isLoading, setIsLoading] = useState("")
  const [filter, setFilter] = useState("")
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt") // những quyển sách khi mà được thêm mới vào sẽ được đẩy lên đầu tiên

  const [openModalCreate, setOpenModalCreate] = useState(false)

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
      sorter: true
    },
    {
      title: 'Hành động',
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

    if (sorter && sorter.field) {
      const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
      setSortQuery(q)
    }
  }

  const handleSearch = (query) => {
    setFilter(query)
  }

  const renderHeader = () => {
    return (
      <>
        <div className="custom-header-table">
          <span>Danh mục sách</span>
          <div style={{ display: 'flex', gap: 15 }}>
            <Button
              type="primary"
            >
              Xuất
            </Button>
            <Button
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
              pagination={{
                className: "custom-pagination-table",
                total: total
              }}
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
    </>
  )
}

export default BookTable