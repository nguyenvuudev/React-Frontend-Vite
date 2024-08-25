import { Table } from "antd"
import { useEffect, useState } from "react"
import { callFetchListBook } from "../../../services/api"
import Button from "antd/es/button"
import { ReloadOutlined } from "@ant-design/icons"


const BookTable = () => {

  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(7)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchBook()
  }, [current, pageSize])

  const fetchBook = async () => {
    let query = `current=${current}&pageSize=${pageSize}`
    const res = await callFetchListBook(query)
    if (res && res.data) {
      setListBook(res.data.result)
      setTotal(res.data.meta.total)
    }
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
      <Table
        title={renderHeader}
        columns={columns}
        dataSource={listBook}
        onChange={onChange}
      >

      </Table>
    </>
  )
}

export default BookTable