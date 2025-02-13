<template>
  <div class="sms-verification">
    <el-form :model="form" :rules="rules">
      <!-- 手机号输入 -->
      <el-form-item prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"> </el-input>
      </el-form-item>

      <!-- 验证码输入 -->
      <el-form-item prop="captcha">
        <div class="captcha-input">
          <el-input
            v-model="form.captcha"
            placeholder="请输入验证码"
            style="flex: 1; margin-right: 10px"
          />
          <el-button
            class="captcha-button"
            type="primary"
            :disabled="!isPhoneValid || countdown > 0"
            @click="sendCaptcha"
          >
            {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  // 验证类型：register/login
  verifyType: {
    type: String,
    default: 'login',
  },
})

const emit = defineEmits(['submit'])

const form = ref({
  phone: '',
  captcha: '',
})

const areaCode = ref('86')
const countdown = ref(0)
let timer: number | null = null

const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(form.value.phone)
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
}

const sendCaptcha = () => {
  if (!isPhoneValid.value) return

  // 启动倒计时
  countdown.value = 60
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      timer && clearInterval(timer)
    }
  }, 1000)

  // 发送验证码请求
  console.log(`发送${props.verifyType}验证码到:`, form.value.phone)
}
</script>

<style scoped>
.sms-verification {
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
</style>
