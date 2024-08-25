import { Col, Row, Table } from "antd"
import { useEffect, useState } from "react"
import { callFetchListBook } from "../../../services/api"
import Button from "antd/es/button"
import { ReloadOutlined } from "@ant-design/icons"
import InputSearch from "./InputSearch"


const BookTable = () => {

  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(7)
  const [total, setTotal] = useState(0)

  const [isLoading, setIsLoading] = useState("")

  useEffect(() => {
    fetchBook()
  }, [current, pageSize])

  const fetchBook = async (searchFilter) => {
    setIsLoading(true)
    let query = `current=${current}&pageSize=${pageSize}`
    if (searchFilter) {
      query += `&${searchFilter}`
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
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
    },
    {
      title: 'Hành động',
    },
  ]

  const onChange = (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current)
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize)
      setCurrent(1)
    }
  }

  const handleSearch = (query) => {
    fetchBook(query)
  }

  const renderHeader = () => {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          />
        </Col>
        <Col span={24}>
          <Table
            loading={isLoading}
            title={renderHeader}
            columns={columns}
            dataSource={listBook}
            onChange={onChange}
            pagination={{
              total: total
            }}
          >

          </Table>
        </Col>
      </Row>
    </>
  )
}

export default BookTable