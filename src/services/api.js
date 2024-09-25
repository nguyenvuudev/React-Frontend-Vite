import axios from "../utils/axios-customize"

export const callRegister = (fullName, email, password, phone) => {
  return axios.post('/api/v1/user/register', { fullName, email, password, phone })
}

export const callLogin = (username, password) => {
  return axios.post('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
  return axios.get('/api/v1/auth/account')
}

export const callLogout = () => {
  return axios.post('/api/v1/auth/logout')
}

export const callFetchListUser = (query) => {
  // current=1&pageSize=3
  return axios.get(`/api/v1/user?${query}`)
}

export const callDeleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`)

  // return {
  //   data: null // test case false
  // }
}

export const callCreateUser = (fullName, email, password, phone) => {
  return axios.post('/api/v1/user', { fullName, email, password, phone })
}

export const callBulkCreateUser = (data) => {
  return axios.post('/api/v1/user/bulk-create', data)
}

export const callUpdateUser = (_id, fullName, email, phone) => {
  return axios.put('/api/v1/user', { _id, fullName, email, phone })
}

export const callCreateBook = (mainText, author, price, category, quantity, sold, thumbnail, slider) => {
  return axios.post('/api/v1/book', { mainText, author, price, category, quantity, sold, thumbnail, slider })
}

export const callFetchListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`)
}

export const callFetchCategory = () => {
  return axios.get('/api/v1/database/category')
}

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData()
  bodyFormData.append('fileImg', fileImg)
  return axios({
    method: 'post',
    url: '/api/v1/file/upload',
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book"
    },
  })
}

export const callUpdateBook = (_id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
  return axios.put(`/api/v1/book/${_id}`, { thumbnail, slider, mainText, author, price, sold, quantity, category })
}

export const callDeleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`)
}