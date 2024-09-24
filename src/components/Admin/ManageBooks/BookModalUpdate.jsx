import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd"
import { useEffect, useState } from "react"
import { callFetchCategory, callUpdateBook, callUploadBookImg } from "../../../services/api"
import { v4 as uuidv4 } from 'uuid'

const BookModalUpdate = (props) => {
  const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props

  const [isSubmit, setIsSubmit] = useState(false)

  const [listCategory, setListCategory] = useState([])

  const [dataThumbnail, setDataThumbnail] = useState([])
  const [dataSlider, setDataSlider] = useState([])

  const [form] = Form.useForm()

  const [loadingThumbnail, setLoadingThumbnail] = useState(false)
  const [loadingSlider, setLoadingSlider] = useState(false)

  const [openPreview, setOpenPreview] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")

  const [imageUrl, setImageUrl] = useState("")

  const [initForm, setInitForm] = useState(null)

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

  useEffect(() => {
    if (dataUpdate?._id) {
      const arrThumbnail = [{
        uid: uuidv4(),
        name: dataThumbnail.thumbnail,
        status: 'done',
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`,
      }]

      const arrSlider = dataUpdate?.slider?.map(item => {
        return {
          uid: uuidv4(),
          name: item,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        }
      })

      const init = {
        _id: dataUpdate._id,
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        category: dataUpdate.category,
        quantity: dataUpdate.quantity,
        sold: dataUpdate.sold,
        thumbnail: { fileList: arrThumbnail },
        slider: { fileList: arrSlider }
      }
      setInitForm(init)
      setDataThumbnail(arrThumbnail)
      setDataSlider(arrSlider)
      form.setFieldsValue(init)
    }
    return () => {
      form.resetFields()
    }
  }, [dataUpdate])

  const onFinish = async (values) => {
    const { _id, mainText, author, price, sold, quantity, category } = values
    if (dataThumbnail.length === 0) {
      notification.error({
        message: 'Lỗi validate',
        description: 'Vui lòng upload ảnh thumbnail'
      })
      return
    }

    if (dataSlider.lenght === 0) {
      notification.error({
        message: 'Lỗi validate',
        description: 'Vui lòng upload ảnh slider'
      })
      return
    }

    const thumbnail = dataThumbnail[0].name
    const slider = dataSlider.map(item => item.name)

    setIsSubmit(true)
    const res = await callUpdateBook(_id, mainText, author, price, category, quantity, sold, thumbnail, slider)
    if (res && res.data) {
      message.success("Cập nhật sách thành công")
      form.resetFields()
      setDataThumbnail([])
      setDataSlider([])
      setOpenModalUpdate(false)
      await props.fetchBook()
    } else {
      notification.error({
        message: 'Đã có lỗi xảy ra',
        description: res.message
      })
    } setIsSubmit(false)
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.readAsDataURL(img)
    reader.addEventListener('load', () => callback(reader.result))
  }

  const handleChange = (info, type) => {
    if (info.file.status === 'uploading') {
      type ? setLoadingSlider(true) : setLoadingThumbnail(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoadingThumbnail(false)
        setImageUrl(url)
      })
    }
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('HÌnh ảnh phải nhỏ hơn 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file)
    // console.log("===check-res", res)
    // console.log("===check-file", file)
    if (res && res.data) {
      setDataThumbnail([{
        name: res.data.fileUploaded,
        uid: file.uid
      }])
      onSuccess("ok")
    } else {
      onError('Đã có lỗi khi tải file lên!')
    }
  }

  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file)
    if (res && res.data) {
      setDataSlider((dataSlider) => [...dataSlider, {
        name: res.data.fileUploaded,
        uid: file.uid
      }])
      onSuccess('ok')
    } else {
      onError('Đã có lỗi khi tải file lên!')
    }
  }

  const handlePreview = async (file) => {
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url)
      setOpenPreview(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    })
  }

  const handleRemoveFile = (file, type) => {
    if (type === 'thumbnail') {
      setDataThumbnail([])
    }

    if (type === 'slider') {
      const newSlider = dataSlider.filter(x => x.uid !== file.uid)
      setDataSlider(newSlider)
    }
  }

  return (
    <>
      <Modal
        title="Cập nhật sách"
        width={"50vw"}
        open={openModalUpdate}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpenModalUpdate(false)
          setDataUpdate(null)
          setInitForm(null)
          form.resetFields()
        }}
        maskClosable={false}
        confirmLoading={isSubmit}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Divider style={{ background: "#463655" }} />

        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
        >
          <Row gutter={24} >
            <Col hidden>
              <Form.Item
                hidden
                labelCol={{ span: 24 }}
                label="Id"
                name="_id"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên sách"
                name="mainText"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên sách!',
                  },
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
                  },
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
                  },
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
                  },
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
                  },
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
                  },
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
                  multiple={false}
                  maxCount={1}
                  onChange={handleChange}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
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
                  multiple
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, 'slider')}
                  onRemove={(file) => handleRemoveFile(file, 'slider')}
                  defaultFileList={initForm?.slider?.fileList ?? []}
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
      </Modal>
      <Modal
        open={openPreview}
        title={previewTitle}
        footer={null}
        onCancel={() => {
          setOpenPreview(false)
        }}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default BookModalUpdate