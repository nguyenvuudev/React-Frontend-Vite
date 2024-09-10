import { Descriptions, Divider, Drawer, Modal, Upload } from "antd"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'


const BookViewDetail = (props) => {
  const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props

  const onClose = () => {
    setOpenViewDetail(false)
    setDataViewDetail(null)
  }

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])

  useEffect(() => { 
    if (dataViewDetail) {
      let imgThumbnail = {}, imgSlider = []
      if (dataViewDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(), // chuyển thành một chuỗi ký tự dài 128 bit
          name: dataViewDetail.thumbnail,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`
        }
      }
      if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
        dataViewDetail.slider.map(item => {
          imgSlider.push({
            uid: uuidv4, // chuyển thành một chuỗi ký tự dài 128 bit
            name: item,
            status: 'done',
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
          })
        })
      }
      setFileList([imgThumbnail, ...imgSlider])
    }
  }, [dataViewDetail])

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file) => {
    setPreviewImage(file.url)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        width={"50vw"}
        open={openViewDetail}
        onClose={onClose}
      >
        <Descriptions
          title="Thông tin sách"
          bordered
          column={2}
        >
          <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên sách">{dataViewDetail?.mainText}</Descriptions.Item>
          <Descriptions.Item label="Tác giả">{dataViewDetail?.author}</Descriptions.Item>
          <Descriptions.Item label="Giá tiền">{dataViewDetail?.price}</Descriptions.Item>
          <Descriptions.Item label="Thể loại">{dataViewDetail?.category}</Descriptions.Item>
          <Descriptions.Item label="Số lượng">{dataViewDetail?.quantity}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{dataViewDetail?.createdAt}</Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">{dataViewDetail?.updatedAt}</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Hình ảnh</Divider>

        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={
            { showRemoveIcon: false }
          }
        >

        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

      </Drawer>
    </>
  )
}

export default BookViewDetail