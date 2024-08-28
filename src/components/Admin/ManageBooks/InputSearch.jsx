import { Button, Col, Form, Input, Row } from "antd"

const InputSearch = (props) => {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    let query = ""
    if (values.mainText) {
      query += `&mainText=/${values.mainText}/i`
    }
    if (values.author) {
      query += `&author=/${values.author}/i`
    }
    if (values.category) {
      query += `&category=/${values.category}/i`
    }
    if (query) {
      props.handleSearch(query)
    }
  }

  return (
    <>
      <div className="custom-input-search">
        <Form
          form={form}
          style={{ padding: '24px' }}
          onFinish={onFinish}
        >
          <Row gutter={24} /*24px */>
            <Col
              span={8} // chiếm 8/24 gird
            >
              <Form.Item
                labelCol={{ span: 24 }} // chiếm toàn bộ chiều rộng của cột chứa nó
                label={'Tên sách'}
                name={'mainText'}
              >
                <Input placeholder="tên sách..." />
              </Form.Item>
            </Col>
            <Col
              span={8} // chiếm 8/24 gird
            >
              <Form.Item
                labelCol={{ span: 24 }} // chiếm toàn bộ chiều rộng của cột chứa nó
                label={'Tấc giả'}
                name={'author'}
              >
                <Input placeholder="tác giả..." />
              </Form.Item>
            </Col>
            <Col
              span={8} // chiếm 8/24 gird
            >
              <Form.Item
                labelCol={{ span: 24 }} // chiếm toàn bộ chiều rộng của cột chứa nó
                label={'Thể loại'}
                name={'category'}
              >
                <Input placeholder="thể loại..." />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                htmlType="submit"
              >
                Tìm kiếm
              </Button>
              <Button
                style={{ margin: '0 8px' }}
                onClick={() => form.resetFields()}
              >
                Xóa
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  )
}

export default InputSearch