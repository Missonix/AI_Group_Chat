<template>
  <!-- 最外层页面于窗口同宽，使聊天面板居中 -->
  <div class="home-view">
    <el-button v-if="!isSessionPanelVisible" class="toggle-panel-btn" @click="toggleSessionPanel">
      <el-icon><ArrowRight /></el-icon>
    </el-button>
    <!-- 整个聊天面板 -->
    <div class="chat-panel">
      <!-- 左侧的会话列表 -->
      <div class="session-panel" :class="{ hidden: !isSessionPanelVisible }">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="title">AI助手</div>
            <div class="description">构建你的AI助手</div>
          </div>
          <div class="panel-header-right">
            <el-button class="fold-btn" @click="toggleSessionPanel">
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
          </div>
        </div>
        <div v-if="loading" class="loading-overlay">
          <el-icon class="loading-icon"><Loading /></el-icon>
          正在加载历史会话...
        </div>

        <!-- 错误提示 -->
        <el-alert
          v-if="error"
          type="error"
          :title="error.message"
          show-icon
          closable
          @close="error = null"
        />
        <div class="session-list">
          <!-- for循环遍历会话列表用会话组件显示，并监听点击事件和删除事件。点击时切换到被点击的会话，删除时从会话列表中提出被删除的会话。 -->
          <!--  -->
          <template v-if="sessionList.length > 0">
            <SessionItem
              v-for="session in sessionList"
              :key="session.session_id"
              :active="session.session_id === activeSession.session_id"
              :session="session"
              class="session"
              @click="handleSessionSwitch(session)"
              @delete="handleDeleteSession"
            />
          </template>
          <div v-else class="empty-tip">
            <el-empty description="暂无历史会话" />
          </div>
          <div ref="loadMoreRef" class="load-more-trigger"></div>
        </div>
        <div class="button-wrapper">
          <div class="new-session">
            <el-button @click="handleCreateSession">
              <el-icon :size="15" class="el-icon--left">
                <CirclePlus />
              </el-icon>
              新的聊天
            </el-button>
          </div>
        </div>
      </div>
      <!-- 右侧的消息记录 -->
      <div class="message-panel">
        <!-- 会话名称 -->
        <div class="header">
          <div class="front">
            <!-- 如果处于编辑状态则显示输入框让用户去修改 -->
            <div v-if="isEdit" class="title">
              <!-- 按回车代表确认修改 -->
              <el-input
                v-model="activeSession.title"
                @keydown.enter="handleUpdateSession"
              ></el-input>
            </div>
            <!-- 否则正常显示标题 -->
            <div v-else class="title">{{ activeSession.title }}</div>
            <div class="description">与AI的{{ activeSession.message_count }}条对话</div>
          </div>
          <!-- 尾部的编辑按钮 -->
          <div class="rear">
            <el-icon :size="20">
              <!-- 不处于编辑状态显示编辑按钮 -->
              <EditPen v-if="!isEdit" @click="isEdit = true" />
              <!-- 处于编辑状态显示取消编辑按钮 -->
              <div class="edit-buttons" v-else>
                <Select @click="handleUpdateSession" />
                <Close @click="isEdit = false" />
              </div>
            </el-icon>
          </div>
        </div>
        <el-divider :border-style="'solid'" />
        <div class="message-list" ref="messageListRef">
          <!-- 过渡效果 -->
          <transition-group name="list">
            <el-scrollbar class="chat-box__content">
              <template v-for="(message, index) in wbmessages" :key="index">
                <Message :message="message" @completeText="handleCompleteText" />
              </template>
            </el-scrollbar>
            <!-- <div class="chat-box__gradient"></div> -->
          </transition-group>
        </div>
        <!-- 监听发送事件 -->
        <message-input @send="handleSendMessage"></message-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick, computed } from 'vue'
import { ChatMessage, ChatSession } from '@typings/index'
import {
  findChatSessionById,
  queryChatSession,
  saveChatSession,
  updateSessionTitle,
} from '@/api/chat-session'
import SessionItem from '@/views/chat/components/SessionItem.vue'
import { CirclePlus, Close, EditPen, Select, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import MessageInput from '@/views/chat/components/MessageInput.vue'
import Message from '@/views/chat/components/Message.vue'
// import { Client } from '@stomp/stompjs'
// import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { ElMessage } from 'element-plus'

import { webSocketService } from '@/services/WebSocketService'

const wbmessages = computed(() => webSocketService.messages.value)

const completeMessages = ref('')

const handleCompleteText = (text: string) => {
  completeMessages.value = text
  console.log('completeMessages', completeMessages.value)
}

// 是否连接
const isConnecting = ref(false)
// 连接失败状态
const connectionError = ref('')

// 使用router实现编程式路由导航
const router = useRouter()

// 页面分页相关
// 当前页码
const currentPage = ref(1)
// 总页码
const totalPages = ref(0)
// 滚动加载触发元素
const loadMoreRef = ref<HTMLElement | null>(null)

const isEdit = ref(false)
const activeSession = ref<ChatSession>({
  session_id: '',
  title: '',
  message_count: 0,
  messages: [],
  created_at: '',
  updated_at: '',
  is_deleted: false,
  user_id: '',
})
const sessionList = ref([] as ChatSession[])

const loading = ref(false)
const error = ref<Error | null>(null)

const { userInfo } = storeToRefs(useUserStore())

const messageListRef = ref<HTMLElement | null>(null)

const isSessionPanelVisible = ref(true)

const toggleSessionPanel = () => {
  isSessionPanelVisible.value = !isSessionPanelVisible.value
}

// 使用 Intersection Observer 实现会话分页滚动加载，通过 useIntersectionObserver 监听 loadMoreRef 元素是否进入视口
useIntersectionObserver(loadMoreRef, ([{ isIntersecting }]) => {
  if (isIntersecting && !loading.value && currentPage.value < totalPages.value) {
    currentPage.value++ // 增加页码
    loadSessions(currentPage.value) // 加载新页数据
  }
})

// 优化后的加载方法
const loadSessions = async (page = 1) => {
  try {
    loading.value = true
    error.value = null

    // 1. 检查用户登录状态
    if (!userInfo.value?.user_id) {
      throw new Error('用户未登录')
    }

    // 2. 添加日志
    console.log('开始加载会话列表:', {
      userId: userInfo.value.user_id,
      page,
    })

    // 3. 调用 API
    const response = await queryChatSession(userInfo.value.user_id, {
      pageNum: page,
      pageSize: 20,
      query: {},
    })

    // 4. 检查响应数据
    console.log('会话列表响应:', response)

    if (!response) {
      throw new Error('响应为空')
    }

    if (!response.data) {
      throw new Error('响应数据为空')
    }

    if (!Array.isArray(response.data.list)) {
      throw new Error('响应数据格式错误')
    }

    // 5. 更新状态
    if (page === 1) {
      sessionList.value = response.data.list
    } else {
      sessionList.value.push(...response.data.list)
    }

    // 6. 自动选择首个会话
    if (sessionList.value.length > 0 && !activeSession.value.session_id) {
      activeSession.value = sessionList.value[0]
    }

    // 7. 更新分页信息
    totalPages.value = Math.ceil(response.data.total / 20)

  } catch (err) {
    console.error('加载会话列表失败:', err)
    error.value = err instanceof Error ? err : new Error('加载失败')
    ElMessage.error(error.value.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const userStore = useUserStore()

  // 确保已初始化
  try {
    // 用户初始化检查
    if (!userStore.isInitialized) await userStore.initialize()
    if (!userStore.isLoggedIn) {
      ElMessage.error('请先登录')
      return router.push('/login')
    }
    if (!userStore.userInfo.user_id) await userStore.getInfo()

    // 加载会话列表
    await loadSessions()

    // 连接WebSocket
    if (activeSession.value.session_id) {
      isConnecting.value = true
      await webSocketService.connect(activeSession.value.session_id)
      ElMessage.success('实时连接已建立')
      webSocketService.messages.value = [] // 初始化列表
      // for (let i = 0; i< activeSession.value.messages.length; i++ )
      for (const message of activeSession.value.messages) {
        webSocketService.messages.value.push({
          text: message.content,
          sender: message.role,
        })
      }
      setTimeout(scrollToBottom, 100)
    }
  } catch (err) {
    connectionError.value = '无法建立实时连接'
    console.error('WebSocket连接失败:', err)
  } finally {
    isConnecting.value = false
  }
})

// 组件卸载时关闭连接
onBeforeUnmount(() => {
  webSocketService.disconnect()
})

const handleDeleteSession = async (deletedSession: ChatSession) => {
  try {
    // 从列表移除
    sessionList.value = sessionList.value.filter((s) => s.session_id !== deletedSession.session_id)

    // 如果删除的是当前会话
    if (activeSession.value.session_id === deletedSession.session_id) {
      activeSession.value = sessionList.value[0] || {
        session_id: '',
        title: '',
        message_count: 0,
        messages: [],
      }
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 定义WebSocket消息类型
interface WebSocketMessage {
  text: string
  sender: 'user' | 'ai' | 'system'
  stream_id?: string
  type?: string
  is_complete?: boolean
}

// 修改创建会话部分
const handleCreateSession = async () => {
  try {
    const userStore = useUserStore()

    if (!userStore.isLoggedIn) {
      ElMessage.warning('请先登录')
      await router.push('/login')
      return
    }

    const createRes = await saveChatSession({
      user_id: userStore.userInfo.user_id!,
      title: '新的聊天',
    })

    if (createRes.code === 200) {
      const newSession = {
        session_id: createRes.data.session_id,
        user_id: createRes.data.user_id,
        title: createRes.data.title,
        message_count: createRes.data.message_count,
        messages: [],
        createdAt: createRes.data.createdAt,
        updatedAt: createRes.data.updatedAt,
      } as ChatSession

      sessionList.value.unshift(newSession)
      activeSession.value = newSession
      ElMessage.success('会话创建成功')
    }
  } catch (error) {
    console.error('创建会话失败:', error)
    ElMessage.error('创建会话失败')
  }
}

const handleUpdateSession = () => {
  updateSessionTitle({
    sessionId: activeSession.value.session_id,
    new_title: activeSession.value.title,
  })
  isEdit.value = false
}

const handleSendMessage = async (message: string) => {
  if (!activeSession.value.session_id) {
    ElMessage.error('请先选择会话')
    return
  }

  try {
    // 创建用户消息对象
    // const userMessage: ChatMessage = {
    //   message_id: Date.now(), // 临时ID
    //   session_id: activeSession.value.session_id,
    //   content: message,
    //   role: 'user',
    //   created_at: new Date().toISOString(),
    //   updated_at: new Date().toISOString(),
    //   is_deleted: false,
    // }

    webSocketService.messages.value.push({
      text: message,
      sender: 'user',
    })
    webSocketService.sendMessage(message)
  } catch (error) {
    console.error('消息发送失败:', error)
    ElMessage.error('消息发送失败')
  }
}

// 修改WebSocket消息监听
watch(
  () => webSocketService.messages.value,
  (newMessages) => {
    newMessages.forEach((msg: WebSocketMessage) => {
      const targetMessage = activeSession.value.messages.find(
        (m: ChatMessage) => m.stream_id === msg.stream_id && m.role === 'assistant'
      )

      if (targetMessage) {
        targetMessage.content += msg.text

        if (!targetMessage.visibleChars) targetMessage.visibleChars = 0
        targetMessage.visibleChars = msg.text.length

        if (msg.is_complete) {
          targetMessage.is_complete = true
        }
      }
    })

    // 将滚动逻辑移到这里
    nextTick(() => {
      const scrollContainer = messageListRef.value?.querySelector('.el-scrollbar__wrap')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    })
  },
  {
    deep: true,
    flush: 'post'
  }
)

const scrollToBottom = () => {
  nextTick(() => {
    const scrollContainer = messageListRef.value?.querySelector('.el-scrollbar__wrap')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  })
}

const handleSessionSwitch = async (session: ChatSession) => {
  // 如果已是当前会话则不操作
  if (session.session_id === activeSession.value.session_id) return

  try {
    activeSession.value.messages = []
    loading.value = true

    webSocketService.messages.value = [] // 初始化列表
    // 在切换会话时调用
    webSocketService.clearMessages()
    // 断开旧连接
    webSocketService.disconnect()

    // 加载会话详情（包括消息）
    const detail = await findChatSessionById(session.session_id)

    // 更新活跃会话
    activeSession.value = {
      ...detail.data,
      messages: detail.data.messages.map((m) => ({
        ...m,
        visibleChars: m.content?.length || 0, // 初始化已显示字符
      })),
    }

    // 连接新会话的WebSocket
    await webSocketService.connect(session.session_id)

    for (const message of activeSession.value.messages) {
      webSocketService.messages.value.push({
        text: message.content,
        sender: message.role,
      })
    }
    setTimeout(scrollToBottom, 100)
  } catch (err) {
    console.error('切换会话失败:', err)
    ElMessage.error('会话加载失败')
  } finally {
    loading.value = false

    // 滚动到底部
  }
}
</script>

<style lang="scss" scoped>
.home-view {
  position: relative;
  width: 100vw;
  display: flex;
  // justify-content: center;

  .toggle-panel-btn {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 1000;
    padding: 8px;
    border-radius: 50%;
  }

  .chat-panel {
    flex: 1;
    display: flex;
    // border-radius: 20px;
    height: 100vh;
    background-color: white;
    // box-shadow: 0 0 20px 20px rgba(black, 0.05);
    // margin-top: 70px;
    position: relative;

    .session-panel {
      width: 300px;
      // border-top-left-radius: 20px;
      // border-bottom-left-radius: 20px;
      padding: 20px;
      position: relative;
      border-right: 1px solid rgba(black, 0.07);
      background-color: rgb(250 250 250);
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.3s ease-in-out;
      flex-shrink: 0;
      /* 标题 */
      .title {
        margin-top: 20px;
        font-size: 20px;
        margin-right: auto; /* 将按钮推到最右边 */
      }

      /* 描述*/
      .description {
        color: rgba(black, 0.7);
        font-size: 14px;
        margin-top: 10px;
        margin-right: auto; /* 将按钮推到最右边 */
      }

      &.hidden {
        transform: translateX(-100%);
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;

        .fold-btn {
          padding: 6px;
          border-radius: 50%;
          margin-left: auto; /* 将按钮推到最右边 */
        }
      }

      .session-list {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 60px; // 为底部按钮留出空间
        padding-right: 5px; // 避免滚动条挤压内容

        // 自定义滚动条样式
        &::-webkit-scrollbar {
          width: 6px;
          background-color: rgba(0, 0, 0, 0.05);
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background-color: rgba(0, 0, 0, 0.2);
        }
        .session {
          /* 每个会话之间留一些间距 */
          margin-top: 10px;
        }
      }

      .button-wrapper {
        /* session-panel是相对布局，这边的button-wrapper是相对它绝对布局 */
        position: absolute;
        bottom: 20px;
        left: 0;
        background: rgb(250 250 250); // 添加背景色防止透明
        z-index: 1; // 确保按钮在滚动内容之上
        display: flex;
        /* 让内部的按钮显示在右侧 */
        justify-content: flex-end;
        /* 宽度和session-panel一样宽*/
        width: 100%;

        /* 按钮于右侧边界留一些距离 */
        .new-session {
          margin-right: 20px;
        }
      }
    }

    /* 右侧消息记录面板*/
    .message-panel {
      // width: 700px;
      flex: 1;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.3s ease-in-out;

      .header {
        padding: 20px 20px 0 20px;
        display: flex;
        /* 会话名称和编辑按钮在水平方向上分布左右两边 */
        justify-content: space-between;

        /* 前部的标题和消息条数 */
        .front {
          .title {
            color: rgba(black, 0.7);
            font-size: 20px;
          }

          .description {
            margin-top: 10px;
            color: rgba(black, 0.5);
          }
        }

        /* 尾部的编辑和取消编辑按钮 */
        .rear {
          display: flex;
          align-items: center;
        }
      }

      .edit-buttons {
        display: flex;
        align-items: center;
        gap: 10px; /* 调整间距 */
      }

      .message-list {
        height: 100%; // 确保容器高度正确
        flex: 1;
        padding: 15px;
        // 消息条数太多时，溢出部分滚动
        overflow-y: scroll;
        // 当切换聊天会话时，消息记录也随之切换的过渡效果
        .list-enter-active,
        .list-leave-active {
          transition: all 0.5s ease;
        }

        .list-enter-from,
        .list-leave-to {
          opacity: 0;
          transform: translateX(30px);
        }
      }
      .chat-box__content {
        height: 100%;
        padding: 10px;
        border-radius: 4px;
      }
      .chat-box__gradient {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        pointer-events: none; /* 防止遮罩影响点击 */
      }
      .chat-box__gradient {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        pointer-events: none; /* 防止遮罩影响点击 */
      }

      .chat-box .el-scrollbar {
        flex: 1;
        min-height: 0; /* 重要：修复滚动容器高度问题 */
      }
      .el-scrollbar {
        flex: 1;
        min-height: 0; /* 重要：修复滚动容器高度问题 */
        height: 100%;
      }

      .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow-y: auto; // 确保允许垂直滚动
        height: 100%;
      }

      .el-scrollbar__view {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        padding-bottom: 30px; /* 增加底部空间 */
        min-height: 100%; /* 强制填满容器 */
      }
    }
  }
}
</style>
