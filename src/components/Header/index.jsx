import './header.scss'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { TfiDrupal } from "react-icons/tfi"
import { IoSearch } from "react-icons/io5"
import { IoCart } from "react-icons/io5"
import { RxDividerVertical } from "react-icons/rx"
import { IoMdHome } from "react-icons/io"
import { FaSmileWink } from "react-icons/fa"
import { useNavigate } from 'react-router'
import { TfiMenu } from "react-icons/tfi"
import { Badge, Divider, Drawer, Dropdown, message, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { callLogout } from '../../services/api'
import { doLogoutAction } from '../../redux/account/accountSlice'

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  const user = useSelector(state => state.account.user)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    const res = await callLogout()
    if (res && res.data) {
      dispatch(doLogoutAction())
      message.success('Đăng xuất tài khoản thành công!')
      navigate('/')
    }
  }

  const items = [
    {
      label: <label
        style={{ cursor: 'pointer' }}
      >Quản lý tài khoản
      </label>,
      key: 'account',
    },
    {
      label: <label
        style={{ cursor: 'pointer' }}
      >Trang chủ
      </label>,
      key: 'account',
    },
    {
      label: <label
        style={{ cursor: 'pointer' }}
        onClick={() => handleLogout()}
      >Đăng xuất
      </label>,
      key: 'logout',
    },

  ]


  return (
    <>
      <div className='header-container'>
        <header className='page-header'>
          <div className='page-header__left'>
            <div className="page-header__toggle"
              onClick={() => { setOpenDrawer(true) }}>
              <TfiMenu className='icon-menu' />
            </div>
            <div className='page-header__logo'>
              <TfiDrupal className='motion icon-logo' />
              <span className='text-logo'> Anime Store </span>
            </div>
          </div>
          <div className='page-header__right'>
            <div className='page-header__top'>
              <div className='page-header__search'>
                <IoSearch className='icon-search' />
                <input className='input-search' type="text" placeholder='Tìm sách ở đây...' />
              </div>
              <div className='page-header__item'>
                <div className='item-block'>
                  <Badge
                    count={0}
                    showZero
                    size={"small"}
                  >
                    <IoCart className='icon-cart' />
                  </Badge>
                </div>
                <RxDividerVertical className='icon-divider' />
                <div className='element item-block'>
                  <IoMdHome className='icon-home' />
                  <span className='text-item'>Trang Chủ</span>
                </div>
                <div className='element item-block'>
                  <FaSmileWink className='icon-smile' />
                  {!isAuthenticated ?
                    <span onClick={() => navigate('/login')} className='text-item'>Tài Khoản</span>
                    :
                    <Dropdown menu={{ items }} trigger={['click']}>
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          Hi, {user?.fullName}
                          <DownOutlined />
                        </Space>
                      </a>
                    </Dropdown>
                  }
                </div>
              </div>
            </div>
            <div className='page-header__bottom'>
              <div className='page-header__text'>
                <span className='text-name'>Hài hước</span>
                <span className='text-name'>Phưu lưu</span>
                <span className='text-name'>Lãng mạn</span>
                <span className='text-name'>Thể thao</span>
                <span className='text-name'>kinh dị</span>
                <span className='text-name'>Trinh thám</span>
                <span className='text-name'>Khoa học</span>
              </div>
              <div className='page-header__link'>
                <div>Địa chỉ: <a href="https://www.google.com/maps/place/%C4%90%E1%BB%8Bnh+C%C3%B4ng+H%E1%BA%A1,+%C4%90%E1%BB%8Bnh+C%C3%B4ng,+Ho%C3%A0ng+Mai,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam/@20.9802336,105.8308214,17z/data=!4m15!1m8!3m7!1s0x3135acf587927d3f:0x407ca203a0891b89!2zxJDhu4tuaCBDw7RuZywgSG_DoG5nIE1haSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!3b1!8m2!3d20.9831371!4d105.8319653!16s%2Fg%2F1hb_dxp_9!3m5!1s0x3135ac5f2e796c85:0xe7932cfaaf696f27!8m2!3d20.9808944!4d105.8326992!16s%2Fg%2F1hc1r8ny0?hl=vi-VN&entry=ttu"> Định Công-Hoàng Mai-Hà Nội</a></div>
              </div>
            </div>
          </div>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p>Trang chủ</p>
        <Divider />

        <p>Thể loại</p>
        <Divider />

        <p>Đăng xuất</p>
        <Divider />
      </Drawer>
    </>
  )
}

export default Header

