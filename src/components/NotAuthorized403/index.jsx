import React from 'react'
import { Button, Result } from 'antd'
const NotAuthorized403 = () => (
  <Result
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }}
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      < Button type="primary" >
        <a href="/login">Back Home</a>
      </Button >
    }
  />
)

export default NotAuthorized403;