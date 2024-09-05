import { isRejected } from "@reduxjs/toolkit"
import { Descriptions, Divider, Drawer, Modal, Upload } from "antd"
import { useState } from "react"


const BookViewDetail = (props) => {
  const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props

  const onClose = () => {
    setOpenViewDetail(false)
    setDataViewDetail(null)
  }

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }
  ]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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

        <Divider orientation="left">Ảnh sách</Divider>

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