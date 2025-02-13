<template>
  <div class="auth-form">
    <div class="tab-switch">
      <router-link to="/login" class="tab-item">登录</router-link>
      <router-link to="/register" class="tab-item active">注册</router-link>
    </div>

    <el-form :model="form" :rules="rules" class="register-form" ref="formRef">
      <EmailVerification
        verify-type="register"
        v-model:username="form.username"
        v-model:email="form.email"
        v-model:code="form.code"
      />

      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请确认密码"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <div class="agreement">
          <el-checkbox v-model="agreement" class="custom-checkbox">
            我已阅读并同意
            <router-link to="/agreement" class="link">《服务协议》</router-link>
            <router-link to="/privacy" class="link">《隐私政策》</router-link>
          </el-checkbox>
        </div>
      </el-form-item>

      <el-button type="primary" class="register-btn" @click="handleRegister">立即注册</el-button>
      <p class="already-have-account">
        已有账号？
        <router-link to="/login" class="login-link">点击登录</router-link>
      </p>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import EmailVerification from '@/components/common/EmailVerification.vue'
import type { FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const router = useRouter()

const userStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
})

const agreement = ref(true)

const validatePass2 = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '邮箱格式不正确',
      trigger: 'blur',
    },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' },
  ],
})

const handleRegister = () => {
  // 验证表单
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请正确填写注册信息')
      return
    }
    if (!agreement.value) {
      ElMessage.warning('请先阅读并同意服务协议')
      return
    }

    try {
      const success = await userStore.register({
        username: form.value.username,
        email: form.value.email,
        code: form.value.code,
        password: form.value.password,
      })
      if (success) {
        ElMessage.success('注册成功')
        router.push('/') // 新增跳转
      }
    } catch (err: any) {
      ElMessage.error(err.message || '注册失败')
    }
  })
}

// 添加表单引用
const formRef = ref()
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
.register-form {
  max-width: 400px;
  margin: 0 auto;
}

/* 使用深度选择器覆盖 el-input 内部 prepend 区域样式，确保垂直居中 */
:deep(.el-input__prepend) {
  display: flex;
  align-items: center;
  padding: 0;
}

.register-btn {
  width: 100%;
  background-color: #3760f4;
  font-size: 16px;
  height: 50px;
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

.el-form-item {
  margin-bottom: 22px;
}

.el-input {
  height: 44px;
}

/* 协议条款样式 */
.agreement {
  font-size: 14px;
}

.agreement .link {
  color: #3760f4;
  text-decoration: none;
}

/* 复选框样式 */
:deep(.custom-checkbox .el-checkbox__label) {
  color: #606266;
}

:deep(.custom-checkbox .el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #606266;
}

/* 已有账号样式 */
.already-have-account {
  margin-top: 15px;
  text-align: left;
  color: #606266;
}

.login-link {
  color: #3760f4;
  text-decoration: none;
  margin-left: 5px;
}
</style>
