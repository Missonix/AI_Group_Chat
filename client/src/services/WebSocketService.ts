// WebSocketService.ts
import { ref } from 'vue'

export interface MessageSender {
  text: string
  sender: 'user' | 'assistant' | 'system'
  stream_id?: string
  type?: string
}

// 定义心跳数据类型
interface HeartbeatData {
  type: 'heartbeat_ping' | 'heartbeat_pong'
  timestamp: number
}

// 定义定时器类型
type Timer = ReturnType<typeof setTimeout>

export class WebSocketService {
  private ws: WebSocket | null = null
  private messageQueue: string[] = []
  private currentAiMessage = '' // 非响应式变量
  private aiMessageTimeout: Timer | null = null // 修改为 NodeJS.Timeout 类型
  public messages = ref<MessageSender[]>([])
  public isConnected = ref(false)
  private heartbeatTimer: Timer | null = null // 修改为 NodeJS.Timeout 类型
  private lastActivity = 0
  private readonly HEARTBEAT_TIMEOUT = 65000 // 65秒

  public async connect(session_id: string): Promise<void> {
    this.disconnect()
    this.ws = new WebSocket(`ws://localhost:8080/ws?session_id=${session_id}`)
    this.ws.onopen = this.onOpen
    console.log('messages:', this.messages)
    this.ws.onmessage = this.onMessage
    this.ws.onclose = this.onClose
    this.ws.onerror = this.onError
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  public clearMessages() {
    this.messages.value = []
  }

  public sendMessage(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'user',
          content: message,
          timestamp: Date.now(),
        }),
      )
    } else {
      this.messageQueue.push(message)
    }
  }

  private onOpen = (): void => {
    this.resetHeartbeat()
    this.isConnected.value = true
    console.log('WebSocket connected')
    this.messageQueue.forEach((msg) => this.ws?.send(msg))
    this.messageQueue = []
  }

  private onMessage = (event: MessageEvent): void => {
    this.resetHeartbeat()
    // if (!event.data || typeof event.data !== 'string') {
    //   console.warn('收到非文本消息:', event.data);
    //   return;
    // }

    try {
      const rawData = event.data.toString().trim()

      // 打印原始消息（生产环境可注释掉）
      // console.debug('收到原始消息:', rawData);

      if (!rawData.startsWith('{') || !rawData.endsWith('}')) {
        // console.warn('收到非JSON消息:', rawData);
        return
      }

      const data = JSON.parse(rawData)

      // 格式化输出消息内容（开发环境专用）
      // console.groupCollapsed(`[WS消息] 类型: ${data.type}`);
      // console.log('完整消息内容:', JSON.stringify(data, null, 2));
      // console.groupEnd();

      switch (data.type) {
        case 'stream_start':
          this.handleStreamStart(data.stream_id)
          break
        case 'stream_chunk':
          this.handleStreamChunk(data.stream_id, data.content)
          break
        case 'stream_end':
          this.handleStreamEnd(data.stream_id)
          break
        case 'system':
          this.messages.value.push({ text: data.content, sender: 'system' })
          break
        case 'error':
          this.messages.value.push({
            text: `系统错误: ${data.content}`,
            sender: 'system',
            stream_id: data.stream_id || 'system',
          })
          break
        case 'heartbeat_ping':
          this.handleHeartbeat(data)
          break
        case 'heartbeat_pong':
          this.updateLastActivity()
          break
      }
    } catch (error) {
      console.error('消息解析失败:', error)
    }
  }

  private activeStreams: Map<
    string,
    {
      buffer: string
      elementIndex: number
      animationFrame: number | null
    }
  > = new Map()

  private handleStreamStart(streamId: string) {
    // 创建新消息占位
    const newMessage: MessageSender = {
      text: '',
      sender: 'assistant',
    }
    this.messages.value.push(newMessage)

    this.activeStreams.set(streamId, {
      buffer: '',
      elementIndex: this.messages.value.length - 1,
      animationFrame: null,
    })
  }

  private handleStreamChunk(streamId: string, content: string) {
    const stream = this.activeStreams.get(streamId)
    if (!stream) return

    stream.buffer += content

    if (!stream.animationFrame) {
      stream.animationFrame = requestAnimationFrame(() => {
        this.updateStreamContent(streamId)
        stream.animationFrame = null
      })
    }
    this.messages.value = [...this.messages.value]
  }

  private updateStreamContent(streamId: string) {
    const stream = this.activeStreams.get(streamId)
    if (!stream) return

    const messages = [...this.messages.value]
    const currentText = messages[stream.elementIndex].text

    const targetText = stream.buffer
    const chunk = targetText.slice(currentText.length)

    if (chunk) {
      messages[stream.elementIndex].text = currentText + chunk
      this.messages.value = messages
    }
  }

  private handleStreamEnd(streamId: string) {
    const stream = this.activeStreams.get(streamId)
    if (!stream) return

    // 最终更新一次内容
    const messages = [...this.messages.value]
    messages[stream.elementIndex].text = stream.buffer
    messages[stream.elementIndex].type = 'end'
    this.messages.value = messages

    this.activeStreams.delete(streamId)
  }

  private onClose = (): void => {
    this.isConnected.value = false
    console.log('WebSocket closed')
  }

  private onError = (error: Event): void => {
    console.error('WebSocket error:', error)
  }

  private handleHeartbeat(data: HeartbeatData) {
    // 添加心跳日志
    console.debug(`收到心跳ping: ${data.timestamp}`)
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'heartbeat_pong',
          timestamp: data.timestamp,
        }),
      )
      console.debug(`发送心跳pong: ${data.timestamp}`)
    }
  }

  private updateLastActivity() {
    // 更新最后活动时间
  }

  private checkConnection() {
    if (!this.isConnected.value && this.ws?.readyState === WebSocket.OPEN) {
      this.isConnected.value = true
    }
  }

  private resetHeartbeat() {
    this.lastActivity = Date.now()
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer)
    }
    this.heartbeatTimer = setTimeout(() => {
      console.warn('心跳超时，主动断开连接')
      this.ws?.close()
    }, this.HEARTBEAT_TIMEOUT)
  }
}

export const webSocketService = new WebSocketService()
