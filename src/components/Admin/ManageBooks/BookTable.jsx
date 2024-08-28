import { Col, Row, Table } from "antd"
import { useEffect, useState } from "react"
import { callFetchListBook } from "../../../services/api"
import Button from "antd/es/button"
import { ReloadOutlined } from "@ant-design/icons"
import InputSearch from "./InputSearch"


const BookTable = () => {

  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)

  const [isLoading, setIsLoading] = useState("")
  const [filter, setFilter] = useState("")
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt") // những quyển sách khi mà được thêm mới vào sẽ được đẩy lên đầu tiên

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
      sorter: true
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

  const onChange = (pagination, filters, sorter) => {
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
          <span>Table List Book</span>
          <div style={{ display: 'flex', gap: 15 }}>
            <Button
              type="primary"
            >
              Thêm mới
            </Button>
            <Button
              type="primary"
            >
              Xuất
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
    </>
  )
}

export default BookTable