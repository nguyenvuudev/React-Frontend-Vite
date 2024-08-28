import { Button, Col, Form, Input, Row, theme } from 'antd'

const InputSearch = (props) => {
    const { token } = theme.useToken()
    const [form] = Form.useForm()

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    }

    const onFinish = (values) => {
        let query = ""
        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i` // lấy tương đối
        }
        if (values.email) {
            query += `&email=/${values.email}/i`
        }
        if (values.phone) {
            query += `&phone=/${values.phone}/i`
        }
        if (query) {
            props.handleSearch(query)
        }
    }

    return (
        <>
            <div className='custom-input-search'>
                <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={8} >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                name={`fullName`}
                                label={`Tên`}
                            >
                                <Input placeholder="tên..." />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                name={`email`}
                                label={`Email`}
                            >
                                <Input placeholder="email..." />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                name={`phone`}
                                label={`Số điện thoại`}
                            >
                                <Input placeholder="số điện thoại..." />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">
                                Tìm kiếm
                            </Button>
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={() => {
                                    form.resetFields()
                                    props.setFilter()
                                }}
                            >
                                Xóa
                            </Button>
                            {/* <a
                        style={{ fontSize: 12 }}
                        onClick={() => {
                            setExpand(!expand)
                        }}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />} Collapse
                    </a> */}
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    )
}

export default InputSearch