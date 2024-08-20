import { InboxOutlined } from '@ant-design/icons'
import { Modal, Table, Upload } from 'antd'
import React from 'react'

const { Dragger } = Upload

const UserImport = (props) => {
  const { openModalImport, setOpenModalImport } = props

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
      console.log("===info: ", info)
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
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
          >
          </Table>
        </div>
      </Modal>
    </>
  )
}

export default UserImport