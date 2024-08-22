import { Button, Divider, Form, Input, message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { callUpdateUser } from '../../../services/api'

const UserModalUpdate = (props) => {
  const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props

  const [isSubmit, setIsSubmit] = useState(false)

  const [form] = Form.useForm()

  const onFinish = async (values) => {
    const { _id, fullName, email, phone } = values
    setIsSubmit(true)
    const res = await callUpdateUser(_id, fullName, email, phone)
    if (res && res.data) {
      message.success('Cập nhật người dùng thành công!')
      setOpenModalUpdate(false)
      await props.fetchUser()
    } else {
      notification.error({
        message: 'Đã có lỗi xảy ra',
        description: res.message
      })
    }
    setIsSubmit(false)
  }

  useEffect(() => {
    form.setFieldsValue(dataUpdate) // đặt giá trị các trường form với giá trị của dataUpdate
  }, [dataUpdate]/**danh sách dependencies */)

  return (
    <Modal
      title="Cập nhật người dùng"
      open={openModalUpdate}
      onCancel={() => {
        setOpenModalUpdate(false)
        setDataUpdate(null)
      }}
      onOk={() => { form.submit() }}
      maskClosable={false}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >

      <Divider />

      <Form
        form={form}
        name="basic"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          hidden={true}
          labelCol={{ span: 24 }}
          label="Id"
          name="_id"
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Tên hiển thị"
          name="fullName"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên hiển thị!',
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Email"
          name="email"
        >
          <Input disabled />
        </Form.Item>


        <Form.Item
          labelCol={{ span: 24 }}
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại!',
            }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserModalUpdate