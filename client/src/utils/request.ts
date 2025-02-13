import axios, { type Method } from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import type { Result } from '../../typings'

const baseUrl = import.meta.env.VITE_API_BASEURL || '/api' // 根据实际部署环境调整
const http = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
})
http.interceptors.request.use((request) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    // 仅保留标准Authorization头
    request.headers.Authorization = `Bearer ${token}`
    // 如果需要跨域携带cookie（前后端同域时自动携带）
    request.withCredentials = true
  }
  return request
})
http.interceptors.response.use(
  (res) => {
    return res.data
  },
  ({ response }) => {
    if (response.data.code !== 200) {
      ElMessage.warning({ message: response.data.msg })
    }
    if (response.data.code === 1001007 || response.data.code === 1001008) {
      void router.push('/login')
    } else {
      /* empty */
    }
    return response.data
  },
)
const requestWithToken = async <T>(url: string, method: Method, data?: any): Promise<Result<T>> => {
  if (method === 'get' || method === 'GET') {
    return await http({ url, method, params: data })
  } else {
    return await http({ url, method, data })
  }
}
export default requestWithToken
