import { Col, Divider, Form, Input, InputNumber, message, Modal, Row, Select, Upload } from "antd"
import { useEffect, useState } from "react"
import { callCreateUser, callFetchCategory, callFetchListBook } from "../../../services/api"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"

const BookModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate } = props

  const [form] = Form.useForm()

  const [isSubmit, setIsSubmit] = useState(false)

  const [listCategory, setListCategory] = useState([])

  const [loadingThumbnail, setLoadingThumbnail] = useState(false)
  const [loadingSlider, setLoadingSlider] = useState(false)

  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callFetchCategory()
      if (res && res.data) {
        const data = res.data.map(item => {
          return { label: item, value: item }
        })
        setListCategory(data)
      }
    }
    fetchCategory()
  }, [])

  const onFinish = async (values) => {
    const { mainText, author, price, category, quantity, sold, thumbnail, slider } = values
    setIsSubmit(true)
    const res = callCreateBook(mainText, author, price, category, quantity, sold, thumbnail, slider)
    if (res && res.data) {
      message.success("Tạo sách mới thành công!")
      form.resetFields()
      setOpenModalCreate(false)
      await props.fetchBook()
    } else {
      notification.error({
        message: 'Đã có lỗi xảy ra',
        description: res.message
      })
    }
    setIsSubmit(false)
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.readAsDataURL(img)
    reader.addEventListener('load', () => callback(reader.result))
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Hình ảnh phải nhỏ hơn 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = (info, type) => {
    if (info.file.status === 'uploading') {
      type ? setLoadingSlider(true) : setLoadingThumbnail(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoadingThumbnail(false)
        setImageUrl(url)
      })
    }
  }

  const handleUploadFile = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      onSuccess("ok")
    }, 1000)
  }

  return (
    <>
      <Modal
        width={"50vw"}
        title="Thêm mới sách"
        open={openModalCreate}
        onOk={() => { form.submit() }}
        onCancel={() => {
          setOpenModalCreate(false)
          form.resetFields()
        }}
        confirmLoading={isSubmit}
        okText="Tạo mới"
        cancelText="Hủy"
        maskClosable={false}
      >
        <Divider style={{ background: "#463655" }} />

        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên sách"
                name="mainText"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên sách!',
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tác giả"
                name="author"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên tác giả!',
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập giá tiền!',
                  }
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="category"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn thể loại!',
                  }
                ]}
              >
                <Select
                  defaultValue={null}
                  placeholder="chọn thể loại"
                  showSearch
                  allowClear
                  options={listCategory}
                >

                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng!',
                  }
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đã bán"
                name="sold"
                initialValue={0}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng đã bán!',
                  }
                ]}
              >
                <InputNumber
                  min={0}
                  defaultValue={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Thumbnail"
                name="thumbnail"
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFile}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  <div>
                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Slider"
                name="slider"
              >
                <Upload
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  multiple
                  customRequest={handleUploadFile}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, 'slider')}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>

              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal >
    </>
  )
}

export default BookModalCreate