<template>
  <div :class="`message message--${message.sender}`">
    <div v-html="renderedText"></div>
  </div>
</template>

<script setup lang="ts">
import { toRef, watch, computed, ref } from 'vue'
import { marked } from 'marked'
import { type MessageSender } from '@/services/WebSocketService'

interface Props {
  message: MessageSender
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'completeText', text: string): void
}>()

const message = toRef(props, 'message')
const currentText = ref('')

const renderedText = computed(() => marked.parse(message.value.text.replace('AI：', '')))

watch(
  () => [message.value.type, message.value.text] as const,
  ([newType, newText]) => {
    if (newType === 'end') {
      console.log('完整信息:', newText)
      currentText.value = newText
      emit('completeText', newText)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.message {
  padding-left: 10px;
  padding-right: 10px;
  padding: 2px;
  border-radius: 5px;
  margin: 10px 0;
  max-width: 70%; /* 设置最大宽度，防止消息过宽 */
  overflow-wrap: break-word; /* 自动换行 */
  background: #f8f8f8; /* 默认背景颜色 */
  animation: messageTransition 0.3s ease-in-out;
}

.message--user {
  padding-left: 20px;
  padding-right: 20px;
  background: #e3f2fd;
  align-self: flex-end;
  text-align: left;
  margin-left: auto;
  width: fit-content;
}

.message--ai {
  padding-left: 20px;
  padding-right: 10px;
  background: #f5f5f5;
  align-self: flex-start;
  text-align: left;
  margin-right: auto;
}
.message--system {
  padding-left: 20px;
  padding-right: 10px;
  background: #f5f5f5;
  align-self: flex-start;
  text-align: left;
  margin-right: auto;
}

@keyframes messageTransition {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.char {
  opacity: 0;
  animation: appear 0.1s forwards;
  animation-delay: calc(var(--char-index) * 0.05s);
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
