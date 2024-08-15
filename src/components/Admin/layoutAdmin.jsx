import React, { lazy, useState } from 'react'
import {
  AppstoreOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Dropdown, Space, message, Avatar } from 'antd'
import { Outlet } from "react-router-dom"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import './LayoutAdmin.scss'
import { useDispatch, useSelector } from 'react-redux'
import { TfiDrupal } from 'react-icons/tfi'
import { callLogout } from '../../services/api'
import { doLogoutAction } from '../../redux/account/accountSlice'
import { Typography } from "antd"

const { Content, Footer, Sider } = Layout

const items = [
  {
    label: <Link to='/admin'>Dashboard</Link>,
    key: 'dashboard',
    icon: <AppstoreOutlined />
  },
  {
    label: <span>Manage Users</span>,
    // key: 'user',
    icon: <UserOutlined />,
    children: [
      {
        label: <Link to='/admin/user'>CRUD</Link>,
        key: 'crud',
        icon: <TeamOutlined />,
      },
      {
        label: 'Files1',
        key: 'file1',
        icon: <TeamOutlined />,
      }
    ]
  },
  {
    label: <Link to='/admin/book'>Manage Books</Link>,
    key: 'book',
    icon: <ExceptionOutlined />
  },
  {
    label: <Link to='/admin/order'>Manage Orders</Link>,
    key: 'order',
    icon: <DollarCircleOutlined />
  },
]

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const user = useSelector(state => state.account.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const res = await callLogout()
    if (res && res.data) {
      dispatch(doLogoutAction())
      message.success('Đăng xuất tài khoản thành công!')
      navigate('/')
    }
  }

  const itemsDropdown = [
    {
      label: <label
        style={{ cursor: 'pointer' }}
      >Quản lý tài khoản</label>,
      key: 'account',
    },
    {
      label: <Link to='/'>Trang chủ</Link>,
      key: 'home'
    },
    {
      label: <label
        style={{ cursor: 'pointer' }}
        onClick={() => handleLogout()}
      >Đăng xuất</label>,
      key: 'logout',
    },
  ]

  // const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`
  const urlAvatar = 'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2147'

  return (
    <Layout style={{ minHeight: '100vh' }} className="layout-admin">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 80,
            margin: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#ffffff',
            flexDirection: 'column',
          }}
        >
          <TfiDrupal
            style={{
              fontSize: collapsed ? '50px' : '60px',
              filter: 'drop-shadow(2px 2px 3px rgba(0, 0, 0, 1.0))',
            }}
          />
          {!collapsed && (
            <Typography style={{ fontSize: '20px', color: '#ffffff' }}>
              Anime Store
            </Typography>
          )}
        </div>
        <Menu
          defaultSelectedKeys={[activeMenu]}
          mode="inline"
          items={items}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>
      <Layout>
        <div className='admin-header'>
          <span>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </span>
          <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
            <span onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar src={urlAvatar} />
                {user?.fullName}
              </Space>
            </span>
          </Dropdown>
        </div>
        <Content>
          <Outlet />
        </Content>
        <Footer style={{ padding: 0, position: 'relative' }}>
          React Frontend Vite &copy; Nguyenvuudev <HeartTwoTone />
        </Footer>
      </Layout>
    </Layout>
  )
}

export default LayoutAdmin
