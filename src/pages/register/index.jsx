import { Button, Form, Input } from 'antd'
import { Link } from 'react-router-dom'
import './register.scss'
import '../../index.css'

const RegisterPage = () => {

    const onFinish = (values) => {
        console.log('Success:', values)
    }

    return (
        <div className="container-register">
            <div className="wrapper-register">
                <div className="title-regiser">
                    Đăng ký tài khoản
                </div>
                <div className="form-control">
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Họ tên"
                            name="fullName"
                            rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Email không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item  >
                            <Button className='btn-regiser' type="primary" htmlType="submit" loading={false}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                        <p className='text-regiser'>Đã có tài khoản ?
                            <a>
                                <Link to='/login' > Đăng Nhập </Link>
                            </a>
                        </p>
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default RegisterPage