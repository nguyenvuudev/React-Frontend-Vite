import { InboxOutlined } from '@ant-design/icons'
import { message, Modal, Table, Upload } from 'antd'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'

const { Dragger } = Upload

const UserImport = (props) => {
  const { openModalImport, setOpenModalImport } = props

  const [dataExcel, setDataExcel] = useState([])

  const dummyRequest = ({ file, onSuccess }) => { // giả định tải file lên thành công
    setTimeout(() => {
      onSuccess("ok")
    }, 1000)
  }

  const propsUpload = {
    name: 'file',
    multiple: true,
    accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    maxCount: 1,
    customRequest: dummyRequest,
    onChange(info) {
      console.log("=== check info: ", info)
      const { status } = info.file
      console.log('nvd_checkStatus: ', status)
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj
          const reader = new FileReader()

          // reader.onload is method of FileReader()
          reader.onload = function (e) { // call back function
            const data = new Uint8Array(reader.result) // Chuyển đổi sữ liệu của file sang dạng số nhị phân
            const workBook = XLSX.read(data, { type: 'array' }) // Chuyển dữ liệu vào thư viện
            const wokSheet = workBook.Sheets[workBook.SheetNames[0]] // Lấy vị trí sheet đầu tiên trong excel

            const jsonData = XLSX.utils.sheet_to_json(wokSheet, { // Chuyển sang định dạng json
              header: ["fullName", "email", "phone"],
              range: 1 // bỏ qua hàng đầu tiên của bảng
            })
            if (jsonData && jsonData.length > 0) {
              setDataExcel(jsonData)
            }
          }
          reader.readAsArrayBuffer(file) 
        }

        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const columns = [
    {
      title: 'Tên hiển thị',
      dataIndex: 'fullName'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone'
    }
  ]

  return (
    <>
      <Modal
        title="Tải lên tệp dữ liệu người dùng"
        width={'50vw'}
        open={openModalImport}
        onOk={() => setOpenModalImport(false)}
        onCancel={() => setOpenModalImport(false)}
        maskClosable={false}
        okButtonProps={{
          disabled: true
        }}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
        <div style={{ paddingTop: 20 }}>
          <Table
            title={() => <span>Dữ liệu tải lên:</span>}
            columns={columns}
            dataSource={dataExcel}
          >
          </Table>
        </div>
      </Modal>
    </>
  )
}

export default UserImport