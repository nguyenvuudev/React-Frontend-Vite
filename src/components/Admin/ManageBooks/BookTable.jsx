import { Table } from "antd"
import { useEffect, useState } from "react"
import { callFetchListBook } from "../../../services/api"


const BookTable = () => {

  const [listBook, setListBook] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(7)

  useEffect(() => {
    fetchBook()
  }, [current, pageSize])

  const fetchBook = async () => {
    let query = `current=${current}&pageSize=${pageSize}`
    const res = await callFetchListBook(query)
    if (res && res.data) {
      setListBook(res.data.result)
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


  return (
    <>
      <Table
        columns={columns}
        dataSource={listBook}
        onChange={onChange}
      >

      </Table>
    </>
  )
}

export default BookTable