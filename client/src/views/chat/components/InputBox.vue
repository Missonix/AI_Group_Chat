<!-- <template>
  <div class="input-box">
    <el-input v-model="inputMessage" placeholder="输入消息..." @keyup.enter="sendMessage" />
    <el-button type="primary" @click="sendMessage">发送</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { webSocketService } from '@/services/WebSocketService'
import { MessageSender } from '@/services/WebSocketService'

await webSocketService.connect(activeSession.value.session_id)
const inputMessage = ref('')

const emit = defineEmits<{
  (e: 'inputedText', text: string): void
}>()

const sendMessage = () => {
  if (inputMessage.value.trim()) {
    webSocketService.messages.value.push({
      text: inputMessage.value,
      sender: 'user',
    })
    webSocketService.sendMessage(inputMessage.value)
    emit('inputedText', inputMessage.value)
    inputMessage.value = ''
  }
}
</script>

<style scoped>
.input-box {
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 1;
  padding: 10px 0;
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-input {
  flex: 1;
  min-width: 0;
}
:deep(.el-input) {
  height: 40px;
  overflow: hidden; /* 防止内容溢出 */
}

.el-button {
  flex-shrink: 0;
  height: 40px;
  padding: 0 20px;
}
</style> -->
