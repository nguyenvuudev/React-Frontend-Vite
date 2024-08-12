import axios from "axios"

const baseBackendURL = import.meta.env.VITE_BACKEND_URL

const instance = axios.create({
  baseURL: baseBackendURL,
  withCredentials: true, // set cookies
})

// Sending the bearer token with axios
instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

const handleRefreshToken = async () => {
  const res = await instance.get('/api/v1/auth/refresh')
  if (res && res.data) return res.data.access_token
  else null

  // console.log('===check res: ', res); 
}

const NO_RETRY_HEADER = 'x-no-retry'

instance.interceptors.request.use(
  function (config) {
    // console.log('===check config: ', config);
    return config

  }, function (error) {
    return Promise.reject(error)
  })

instance.interceptors.response.use(
  function (response) {
    // console.log('===check response: ', response);
    return response && response.data ? response.data : response

  },

  // Retry (gọi lại API khi hết hạn hoặc bị lỗi)
  async function (error) {
    if (error.config
      && error.response
      && +error.response.status === 401
      && !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken()
      error.config.headers[NO_RETRY_HEADER] = 'true'
      if (access_token) {
        error.config.headers['Authorization'] = `Bearer ${access_token}`
        localStorage.setItem('access_token', access_token)
        return instance.request(error.config)
      }
    }

    // Chuyển người dùng về trang login khi hết hạn refresh token
    if (error.config
      && error.response
      && +error.response.status === 400
      && error.config.url === '/api/v1/auth/refresh'
    ) {
      window.location.href = '/login'
    }

      return error?.response?.data ?? Promise.reject(error)
  })

export default instance