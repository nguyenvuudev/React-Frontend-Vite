import { Button, Result } from 'antd'

const NotFound404 = () => (
  <Result
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }}
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      < Button type="primary" >
        <a href="/">Back Home</a>
      </Button >
    }
  />
);
export default NotFound404