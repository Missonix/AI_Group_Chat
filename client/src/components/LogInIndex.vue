<template>
  <div class="auth-form">
    <div class="tab-switch">
      <router-link to="/login" class="tab-item active">登录</router-link>
      <router-link to="/register" class="tab-item">注册</router-link>
    </div>

    <el-form :model="form" :rules="currentRules" class="login-form" ref="formRef">
      <!-- 动态登录方式 -->
      <template v-if="!isSMSLogin">
        <!-- 手机号输入 -->
        <el-form-item prop="account">
          <el-input v-model="form.account" placeholder="请输入手机号或邮箱" class="phone-input">
          </el-input>
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
      </template>

      <template v-else>
        <!-- 短信验证码输入 -->
        <SMSVerification verify-type="login" />
      </template>

      <!-- 登录按钮 -->
      <div class="login-buttons">
        <el-button type="primary" class="login-btn" @click="handleLogin" :loading="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </el-button>
        <el-button class="wechat-btn" @click="loginWithWechat">
          <el-icon><i class="iconfont icon-wechat" /></el-icon>
          微信登录
        </el-button>
      </div>

      <!-- 其他登录方式 -->
      <div class="other-options">
        <a class="login-link1" @click="toggleLoginMethod">
          {{ isSMSLogin ? '密码登录' : '短信登录' }}
        </a>
        <router-link to="/login/email-login" class="login-link2">邮箱登录</router-link>
        <router-link to="/login/forgot" class="forgot-password">忘记密码？</router-link>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="LoginIndex">
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import SMSVerification from '@/components/common/SMSVerification.vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const isSMSLogin = ref(false)
const form = ref({
  account: '',
  phone: '',
  password: '',
  captcha: '',
})

// 添加加载状态
const isLoading = ref(false)

// 动态验证规则
const currentRules = computed(() => {
  return isSMSLogin.value ? smsRules : passwordRules
})

// 定义验证器的类型
type ValidateCallback = (error?: Error) => void
type ValidateRule = {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change'
  validator?: (rule: unknown, value: string, callback: ValidateCallback) => void
  pattern?: RegExp
  min?: number
  max?: number
  len?: number
}

const passwordRules: FormRules = {
  account: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
    {
      validator: (rule: unknown, value: string, callback: ValidateCallback) => {
        if (!/^(1[3-9]\d{9}|[\w-]+@[\w-]+\.\w+)$/.test(value)) {
          callback(new Error('请输入有效的手机号或邮箱'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' },
  ],
}

const smsRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
}

const toggleLoginMethod = () => {
  isSMSLogin.value = !isSMSLogin.value
  // 清空非当前登录方式的字段
  if (isSMSLogin.value) {
    form.value.password = ''
  } else {
    // form.value.captcha = ''
  }
}

// 修改 formRef 的类型
const formRef = ref<FormInstance | null>(null)

const handleLogin = async () => {
  if (isLoading.value) return
  const formEl = formRef.value
  if (!formEl) return

  try {
    const valid = await formEl.validate()
    if (!valid) {
      ElMessage.warning('请正确填写登录信息')
      return
    }

    isLoading.value = true
    const success = await userStore.loginbypassword({
      account: form.value.account,
      password: form.value.password,
    })
    if (success) {
      ElMessage.success('登录成功')
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      ElMessage.error(err.message || '登录失败')
    } else {
      ElMessage.error('登录失败')
    }
  } finally {
    isLoading.value = false
  }
}

const loginWithWechat = async () => {
  try {
    window.location.href = '/api/auth/wechat'
  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? error.message
      : '微信登录失败，请稍后重试'

    ElMessage.error(errorMessage)
  }
}
</script>

<style scoped>
/* TAB 栏样式 */
.tab-switch {
  margin-bottom: 40px;
  text-align: center;
}

.tab-item {
  position: relative;
  display: inline-block;
  padding: 0 20px;
  font-size: 24px;
  font-weight: 700;
  color: #606266;
  text-decoration: none;
  transition: all 0.3s;
}

.tab-item.active {
  color: #3760f4;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3760f4;
}

/* 表单整体宽度 */
.login-form {
  max-width: 400px;
  margin: 0 auto;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-input {
  height: 44px;
}

/* 使用深度选择器覆盖 el-input 内部 prepend 区域样式，确保垂直居中 */
:deep(.el-input__prepend) {
  display: flex;
  align-items: center;
  padding: 0;
}

/* 登录按钮样式 */
.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
  font-size: 16px;
}

.login-btn {
  background-color: #3760f4;
  font-size: 16px;
  height: 45.6px;
}

.wechat-btn {
  width: 100%;
  font-size: 16px;
  border-radius: 6px;
  height: 45.6px;
  margin: 0 !important;
}

/* 其他登录方式 */
.other-options {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.login-link1 {
  cursor: pointer;
  color: #3760f4;
  margin-right: 30px;
}

.login-link2 {
  margin-right: auto; /* 占据剩余空间 */
}

.forgot-password {
  margin-left: auto; /* 推到最右侧 */
}

.other-options a {
  color: #3760f4;
  text-decoration: none;
}

/* 微信图标样式 */
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-wechat:before {
  content: '\e65c';
}

/* 移除 Element Plus 默认按钮间距 */
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
