import { Button, Form, Input, message, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './login.scss'
import '../../index.css'
import { callLogin } from '../../services/api'
import { useDispatch } from 'react-redux'
import { doLoginAction } from '../../redux/account/accountSlice'

const LoginPage = () => {
    const navigate = useNavigate()
    const [isSubmit, setIsSubmit] = useState(false)

    const dispatch = useDispatch()

    const onFinish = async (values) => {
        const { username, password } = values
        setIsSubmit(true)
        const res = await callLogin(username, password)
        setIsSubmit(false)
        if (res?.data) {
            console.log('check res: ', res);
            localStorage.setItem('access_token', res.data.access_token)
            dispatch(doLoginAction(res.data.user))
            message.success('Đăng nhập tài khoản thành công!')
            navigate('/')
        } else {
            message.error('Thông tin đăng nhập chưa chính xác')
            navigate('/login')
        }
    }

    return (
        <div className="container-login">
            <div className="wrapper-login">
                <div className="title-login">
                    Đăng nhập
                </div>
                <div className="form-control">
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                    >

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="username"
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

                        <Form.Item  >
                            <Button className='btn-login' type="primary" htmlType="submit" loading={isSubmit}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                        <p className='text-login'>Chưa có tài khoản ?
                            <a>
                                <Link to='/register' > Đăng ký </Link>
                            </a>
                        </p>
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default LoginPage