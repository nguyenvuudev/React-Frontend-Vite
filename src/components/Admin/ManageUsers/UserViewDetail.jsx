import { Badge, Descriptions, Drawer } from "antd"
import moment from "moment"
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant"

const UserViewDetail = (props) => {
  const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props

  const closeViewDetail = () => {
    setOpenViewDetail(false)
    setDataViewDetail(null)
  }

  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        width={"50vw"}
        onClose={closeViewDetail}
        open={openViewDetail}
      >
        <Descriptions
          title="Thông tin người dùng"
          bordered
          column={2}
        >
          <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>

          <Descriptions.Item label="Role" span={2}>
            <Badge status="processing" text={dataViewDetail?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(dataViewDetail?.createdAt).format(FORMAT_DATE_DISPLAY)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {moment(dataViewDetail?.updatedAt).format(FORMAT_DATE_DISPLAY)}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  )
}

export default UserViewDetail