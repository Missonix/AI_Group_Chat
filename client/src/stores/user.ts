import { defineStore } from 'pinia'
import type { User } from '../../typings'
import { getUserInfo, LoginPassword, LoginEmail, registerUser, ForgotPassword } from '@/api/user'
import type {
  RegisterPayload,
  LoginPasswordPayload,
  LoginEmailPayload,
  ForgotPasswordPayload,
} from '@/api/user'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { computed } from 'vue'

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

export const useUserStore = defineStore(
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
    // 在getInfo方法中添加容错处理
    const getInfo = async () => {
      try {
        const res = await getUserInfo()

        // 增加字段验证
        if (!res.data?.user_id) {
          throw new Error('INVALID_USER_ID')
        }

        // 标准化用户信息结构
        userInfo.value = {
          user_id: res.data.user_id,
          username: res.data.username || '未命名用户',
          access_token: res.data.access_token,
        }

        isLoggedIn.value = true
        return res.data
      } catch (error) {
        // 细化错误处理
        if (error.message.includes('401')) {
          ElMessage.error('登录凭证已过期')
        } else if (error.message.includes('INVALID_USER_ID')) {
          ElMessage.error('用户数据格式异常')
        } else {
          ElMessage.error('获取用户信息失败')
        }

        // 清理无效状态
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
        if (res.code === 200) {
          localStorage.setItem('access_token', res.data.access_token)
          // 直接设置状态避免二次初始化
          userInfo.value.user_id = res.data.user_id
          userInfo.value.username = res.data.username
          userInfo.value.access_token = res.data.access_token
          userInfo.value.is_active = res.data.is_active
          isLoggedIn.value = true
          // 跳转到首页
          router.push('/')
          return true
        }
        throw new Error(res.message || '注册失败')
      } catch (error) {
        throw error // 抛出错误由组件处理
      }
    }

    // 密码登录
    const loginbypassword = async (payload: LoginPasswordPayload) => {
      try {
        const res = await LoginPassword(payload)
        if (res.code === 200) {
          localStorage.setItem('access_token', res.data.access_token)
          await initialize()
          userInfo.value.user_id = res.data.user_id
          userInfo.value.username = res.data.username
          userInfo.value.access_token = res.data.access_token
          userInfo.value.is_active = res.data.is_active
          isLoggedIn.value = true
          // 跳转到首页
          router.push('/')
          return true
        }
        throw new Error(res.message || '登录失败')
      } catch (error) {
        throw error // 抛出错误由组件处理
      }
    }

    // 邮箱登录
    const loginbyemail = async (payload: LoginEmailPayload) => {
      try {
        const res = await LoginEmail(payload)
        if (res.code === 200) {
          // 修改前：res.data.refresh_token
          // 修改后：res.data.data.refresh_token
          localStorage.setItem('access_token', res.data.access_token)
          userInfo.value.user_id = res.data.user_id
          userInfo.value.username = res.data.username
          userInfo.value.access_token = res.data.access_token
          userInfo.value.is_active = res.data.is_active
          isLoggedIn.value = true
          // 跳转到首页
          router.push('/')
          return true
        }
        throw new Error(res.message || '登录失败')
      } catch (error) {
        throw error // 抛出错误由组件处理
      }
    }

    const forgotPassword = async (payload: ForgotPasswordPayload) => {
      try {
        const res = await ForgotPassword(payload)
        if (res.code === 200) {
          localStorage.setItem('access_token', res.data.access_token)
          userInfo.value.user_id = res.data.user_id
          userInfo.value.username = res.data.username
          userInfo.value.access_token = res.data.access_token
          userInfo.value.is_active = res.data.is_active
          isLoggedIn.value = true
          // 跳转到首页
          router.push('/')
          return true
        }
        throw new Error(res.message || '密码修改失败')
      } catch (error) {
        throw error // 抛出错误由组件处理
      }
    }

    return {
      userInfo,
      getInfo,
      register,
      loginbypassword,
      loginbyemail,
      forgotPassword,
      initialize,
      isLoggedIn, // 添加此行
      isInitialized, // 可选添加（若需持久化）
    }
  },
  {
    persist: {
      key: 'user', // 自定义存储键名
      storage: localStorage,
      paths: ['userInfo', 'isLoggedIn'], // 明确指定持久化字段
    },
  },
)
