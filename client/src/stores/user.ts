import { defineStore } from 'pinia'
import type { User } from '../../typings'
import { getUserInfo, LoginPassword, LoginEmail, registerUser, ForgotPassword } from '@/api/user'
import type {
  RegisterPayload,
  LoginPasswordPayload,
  LoginEmailPayload,
  ForgotPasswordPayload,
} from '@/api/user'
import { ref, type Ref } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { type PersistenceOptions } from 'pinia-plugin-persistedstate'

// 定义认证响应数据的接口
interface AuthResponse {
  user_id: string
  username: string
  access_token: string
  is_active: boolean
  email?: string
}

// 添加初始化方法
const initialUserState = {
  user_id: '',
  username: '',
  email: '',
  access_token: '',
  is_admin: false,
  is_active: false,
  ip_address: '',
}

// 修改 Store 的类型定义
interface UserStore {
  userInfo: Ref<Partial<User>>
  isLoggedIn: Ref<boolean>
  isInitialized: Ref<boolean>
  getInfo: () => Promise<User>
  register: (payload: RegisterPayload) => Promise<boolean>
  loginbypassword: (payload: LoginPasswordPayload) => Promise<boolean>
  loginbyemail: (payload: LoginEmailPayload) => Promise<boolean>
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<boolean>
  initialize: () => Promise<void>
  logout: () => void
}

export const useUserStore = defineStore<'user', UserStore>(
  'user',
  () => {
    const userInfo = ref<Partial<User>>({
      ...initialUserState,
      // avatar: '',
    })
    const isLoggedIn = ref(false)
    const isInitialized = ref(false)

    const initialize = async () => {
      if (isInitialized.value) return
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          userInfo.value = { ...initialUserState }
          isLoggedIn.value = false
          return
        }

        // 添加重试逻辑
        let retry = 0
        while (retry < 1) {
          try {
            await getInfo()
            break
          } catch (error) {
            if (retry >= 1) throw error
            retry++
          }
        }
      } catch (error) {
        localStorage.removeItem('access_token')
        userInfo.value = { ...initialUserState }
        isLoggedIn.value = false
        throw error
      } finally {
        isInitialized.value = true
      }
    }

    // 获取用户信息
    const getInfo = async () => {
      try {
        const res = await getUserInfo()

        if (!res.data?.user_id) {
          throw new Error('INVALID_USER_ID')
        }

        userInfo.value = {
          user_id: res.data.user_id,
          username: res.data.username || '未命名用户',
          access_token: res.data.access_token,
        }

        isLoggedIn.value = true
        return res.data
      } catch (error: unknown) {
        // 细化错误处理
        const err = error as Error
        if (err.message.includes('401')) {
          ElMessage.error('登录凭证已过期')
        } else if (err.message.includes('INVALID_USER_ID')) {
          ElMessage.error('用户数据格式异常')
        } else {
          ElMessage.error('获取用户信息失败')
        }

        localStorage.removeItem('access_token')
        userInfo.value = { ...initialUserState }
        isLoggedIn.value = false
        throw error
      }
    }

    // 注册
    const register = async (payload: RegisterPayload) => {
      try {
        const res = await registerUser(payload)
        if (res.code === 200 && res.data) {
          const data = res.data as unknown as AuthResponse
          localStorage.setItem('access_token', data.access_token)
          userInfo.value = {
            user_id: data.user_id,
            username: data.username,
            access_token: data.access_token,
            is_active: data.is_active,
          }
          isLoggedIn.value = true
          router.push('/')
          return true
        }
        throw new Error(res.message || '注册失败')
      } catch (error) {
        throw error
      }
    }

    // 密码登录
    const loginbypassword = async (payload: LoginPasswordPayload) => {
      try {
        const res = await LoginPassword(payload)
        if (res.code === 200 && res.data) {
          const data = res.data as unknown as AuthResponse
          localStorage.setItem('access_token', data.access_token)
          await initialize()
          userInfo.value = {
            user_id: data.user_id,
            username: data.username,
            access_token: data.access_token,
            is_active: data.is_active,
          }
          isLoggedIn.value = true
          router.push('/')
          return true
        }
        throw new Error(res.message || '登录失败')
      } catch (error) {
        throw error
      }
    }

    // 邮箱登录
    const loginbyemail = async (payload: LoginEmailPayload) => {
      try {
        const res = await LoginEmail(payload)
        if (res.code === 200 && res.data) {
          const data = res.data as unknown as AuthResponse
          localStorage.setItem('access_token', data.access_token)
          userInfo.value = {
            user_id: data.user_id,
            username: data.username,
            access_token: data.access_token,
            is_active: data.is_active,
          }
          isLoggedIn.value = true
          router.push('/')
          return true
        }
        throw new Error(res.message || '登录失败')
      } catch (error) {
        throw error
      }
    }

    const forgotPassword = async (payload: ForgotPasswordPayload) => {
      try {
        const res = await ForgotPassword(payload)
        if (res.code === 200 && res.data) {
          const data = res.data as unknown as AuthResponse
          localStorage.setItem('access_token', data.access_token)
          userInfo.value = {
            user_id: data.user_id,
            username: data.username,
            access_token: data.access_token,
            is_active: data.is_active,
          }
          isLoggedIn.value = true
          router.push('/')
          return true
        }
        throw new Error(res.message || '密码修改失败')
      } catch (error) {
        throw error
      }
    }

    const logout = () => {
      localStorage.removeItem('access_token')
      userInfo.value = { ...initialUserState }
      isLoggedIn.value = false
      router.push('/')
    }

    return {
      userInfo,
      getInfo,
      register,
      loginbypassword,
      loginbyemail,
      forgotPassword,
      initialize,
      isLoggedIn,
      isInitialized,
      logout
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage,
      paths: ['userInfo', 'isLoggedIn'],
    } as PersistenceOptions,
  }
)
