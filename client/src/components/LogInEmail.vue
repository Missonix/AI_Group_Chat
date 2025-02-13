<template>
  <div class="auth-form">
    <div class="title">
      <span>电子邮箱登录</span>
    </div>

    <el-form :model="form" :rules="rules" class="login-form" ref="formRef">
      <EmailVerificationLogin
        verify-type="login"
        v-model:email="form.email"
        v-model:code="form.code"
      />

      <!-- 登录按钮 -->
      <div class="login-buttons">
        <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
        <el-button class="wechat-btn" @click="loginWithWechat">
          <el-icon><i class="iconfont icon-wechat" /></el-icon>
          微信登录
        </el-button>
      </div>

      <!-- 其他登录方式 -->
      <div class="back-login">
        <router-link to="/login" class="back-login-btn">密码登录</router-link>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="LoginIndex">
import { ref } from 'vue'
import EmailVerificationLogin from '@/components/common/EmailVerificationLogin.vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const formRef = ref()
const form = ref({
  email: '',
  code: '',
})

const handleLogin = async () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请正确填写登录信息')
      return
    }

    try {
      const success = await userStore.loginbyemail({
        email: form.value.email,
        code: form.value.code,
      })

      if (success) {
        ElMessage.success('登录成功')
      }
    } catch (err) {
      ElMessage.error(err.message || '登录失败') // 补全错误提示
    }
  })
}

const loginWithWechat = () => {
  console.log('微信登录按钮点击')
  // 在这里处理微信登录逻辑
}

const rules = {
  email: [
    { required: true, message: '请输入电子邮箱地址', trigger: 'blur' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度6位', trigger: 'blur' },
  ],
}
</script>

<style scoped>
.title {
  padding-bottom: 14px;
  margin-bottom: 28px;
  display: inline-block;
  font-size: 24px;
  font-weight: 700;
  width: 100%;
  text-align: center;
  color: #333;
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

/* 其他登录方式 */
.back-login {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.back-login-btn {
  margin-right: 30px; /* 与子账号登录的间距 */
}

.back-login a {
  color: #3760f4;
  text-decoration: none;
}

.captcha-input {
  display: flex;
  width: 100%;
}

.captcha-button.is-disabled,
.captcha-button.is-disabled:focus,
.captcha-button.is-disabled:hover {
  width: 120px;
  height: 44px;
  background-color: aliceblue;
  color: #999999;
  cursor: not-allowed;
  background-image: none;
  background-color: #fff;
  border-color: #d7dae0;
}

.captcha-button {
  width: 120px;
  height: 44px;
  background-color: aliceblue;
  color: #999999;
  background-image: none;
  background-color: #fff;
  border-color: #d7dae0;
}

captcha-button:focus,
.captcha-button:hover {
  color: #3760f4;
  border-color: #c3cffc;
  background-color: #ebeffe;
  outline: 0;
}

.wechat-btn {
  width: 100%;
  font-size: 16px;
  border-radius: 6px;
  height: 45.6px;
  margin: 0 !important;
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
