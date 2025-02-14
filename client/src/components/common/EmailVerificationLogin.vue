<template>
  <div class="email-verification">
    <el-form :model="form" :rules="rules">
      <!-- 邮箱输入 -->
      <el-form-item prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱地址" />
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </el-form-item>

      <!-- 验证码输入 -->
      <el-form-item prop="code">
        <div class="captcha-input">
          <el-input
            v-model="form.code"
            placeholder="请输入验证码"
            style="flex: 1; margin-right: 10px"
          />
          <el-button
            class="captcha-button"
            type="primary"
            :disabled="!isEmailValid || countdown > 0"
            @click="sendCaptcha"
          >
            {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      :model-value="showCaptcha"
      title="人机验证"
      width="400px"
      @close="handleCaptchaClose"
    >
      <RecaptchaSlider
        v-if="showCaptcha"
        ref="captchaRef"
        @success="onCaptchaSuccess"
        @fail="onCaptchaFail"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import RecaptchaSlider from './CaptchaChallenge.vue'
import { ElMessage } from 'element-plus'
import axios, { AxiosError } from 'axios'

const emit = defineEmits(['update:email', 'update:code', 'submit'])

const form = ref({
  email: '',
  code: '',
})

const countdown = ref(0)

const showCaptcha = ref(false)
let captchaResolve: (value: boolean) => void

const captchaRef = ref<InstanceType<typeof RecaptchaSlider>>()

const isEmailValid = computed(() => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.value.email)
})

const rules = {
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
}

const handleCaptchaClose = () => {
  captchaRef.value?.reset()
  showCaptcha.value = false
}

// 添加错误状态
const errorMessage = ref('')

// 定义API响应数据的接口
interface ApiResponse {
  code: number
  message: string
  data?: unknown
}

// 定义错误响应数据的接口
interface ErrorResponse {
  code: number
  message: string
}

const sendCaptcha = async () => {
  try {
    if (!isEmailValid.value || countdown.value > 0) return

    showCaptcha.value = true
    captchaRef.value?.reset()
    const passed = await new Promise<boolean>((resolve) => {
      captchaResolve = resolve
    })

    if (!passed) return

    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)

    try {
      const response = await axios.post<ApiResponse>(
        '/api/users/send_verification_code_by_email',
        { email: form.value.email },
        { withCredentials: true },
      )

      if (response.data.code === 200) {
        ElMessage.success('验证码已发送至邮箱')
      } else {
        handleErrorResponse(response.data)
      }
    } catch (err: unknown) {
      console.error('[ERROR] 验证码发送失败:', err)
      if (err instanceof AxiosError && err.response?.data) {
        const errorData = err.response.data as ErrorResponse
        if (errorData.code === 429) {
          ElMessage.error(errorData.message || '请求过于频繁，请稍后再试')
        } else {
          ElMessage.error('验证码发送失败，请稍后重试')
        }
      } else {
        ElMessage.error('验证码发送失败，请稍后重试')
      }
      countdown.value = 0
    }
  } catch (err) {
    console.error('[ERROR] 验证流程异常:', err)
    ElMessage.error('验证流程异常')
    countdown.value = 0
  }
}

// 修改错误处理函数
const handleErrorResponse = (data: ApiResponse) => {
  if (data.code === 429) {
    ElMessage.error(data.message || '请求过于频繁，请稍后再试')
  } else if (data.code === 400) {
    ElMessage.error(data.message || '验证码发送失败')
  } else {
    ElMessage.error('未知错误')
  }
  countdown.value = 0
}

const onCaptchaSuccess = () => {
  showCaptcha.value = false
  captchaResolve(true)
}

const onCaptchaFail = () => {
  captchaResolve(false)
}

watch(
  () => form.value.email,
  (newVal) => {
    emit('update:email', newVal)
  },
)

watch(
  () => form.value.code,
  (newVal) => {
    emit('update:code', newVal)
  },
)
</script>

<style scoped>
.email-verification {
  width: 100%;
}

.el-form-item {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
}

.el-form-item__content {
  flex: 1;
  display: flex;
}

.el-input {
  height: 44px;
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

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}
</style>
