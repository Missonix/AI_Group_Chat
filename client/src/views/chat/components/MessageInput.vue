<template>
  <div class="message-input">
    <div class="input-wrapper">
      <el-input
        v-model.trim="message"
        :autosize="{ minRows: 1, maxRows: 4 }"
        class="input"
        resize="none"
        type="textarea"
        placeholder="给 SSAI 发送消息..."
        @keydown.enter.prevent="handleEnterPress"
      />
      <div class="button-area">
        <div
          class="iconfont icon-fasong"
          :class="{ 'disabled': !message }"
          @click="message && sendMessage()"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import { Position } from '@element-plus/icons-vue'

// 发送消息消息事件
const emit = defineEmits<{
  send: [message: string]
}>()
// 输入框内的消息
const message = ref('')

// 处理回车键按下事件
const handleEnterPress = (e: KeyboardEvent) => {
  // 如果是shift+enter，允许换行
  if (e.shiftKey) {
    return
  }
  // 普通回车直接发送
  sendMessage()
}

const sendMessage = () => {
  if (!message.value) return  // 空消息不发送
  emit('send', message.value)
  // 发送完清除
  message.value = ''
}
</script>

<style lang="scss" scoped>
.message-input {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;

  .input-wrapper {
    position: relative;
    background: transparent !important;
    width: 100% !important;

    :deep(.el-textarea__inner) {
      padding: 12px 40px 12px 12px; // 右侧留出按钮空间
      max-height: 400px; // 限制最大高度
      overflow-y: auto !important; // 内容过多时显示滚动条
      min-height: 60px !important;
      border-radius: 8px;
      border: 1px solid #e4e7ed;
      transition: border-color 0.2s;
      background-color: #f7f7f7;

      &:focus {
        border-color: #409eff;
      }

      &::placeholder {
        color: #999;
      }
    }
  }

  .button-area {
    position: absolute;
    bottom: 8px;  // 调整底部间距
    right: 8px;
    height: auto;
    padding: 0;

    .iconfont.icon-fasong {
      padding: 4px;
      padding-bottom: 3px;
      font-size: 30px;
      // background: rgba(255,255,255,0.9);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(.disabled) {
        transform: scale(1.1);
        color: #333333;
      }

      &.disabled {
        color: #cccccc;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .message-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 8px !important;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);

    .input-wrapper :deep(.el-textarea__inner) {
      max-height: 300px;
      padding: 8px 40px 8px 8px !important;
    }

    .button-area {
      bottom: 4px;
      right: 4px;

      .iconfont.icon-fasong {
        font-size: 20px;
        padding-bottom: 0;
      }
    }
  }
}
</style>
