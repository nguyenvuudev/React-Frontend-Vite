import axios from "axios"

const baseBackendURL = import.meta.env.VITE_BACKEND_URL

const instance = axios.create({
  baseURL: baseBackendURL,
  withCredentials: true,
})

instance.interceptors.request.use(
  function (config) {
    return config

  }, function (error) {
    return Promise.reject(error)
  })

instance.interceptors.response.use(
  function (response) {
    console.log(response);
    return response && response.data ? response.data : response
    
  }, function (error) {
    return error?.response?.data ?? Promise.reject(error)
  })

export default instance