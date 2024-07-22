import { Button, Form, Input, message, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './register.scss'
import { callRegister } from '../../services/api'

const RegisterPage = () => {
    const navigate = useNavigate()
    const [isSubmit, setIsSubmit] = useState(false)

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values
        setIsSubmit(true)
        const res = await callRegister(fullName, email, password, phone)
        setIsSubmit(false)
        if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công!')
            navigate('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && res.message.length > 0 ? res.message[0] : res.message,
                duration: 5
            })
        }
    }

    return (
        <div className="container-register">
            <div className="wrapper-register">
                <div className="title-register">
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
                            <Button className='btn-register' type="primary" htmlType="submit" loading={isSubmit}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                        <p className='text-register'>Đã có tài khoản ?
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