<template>
  <!-- 最外层页面于窗口同宽，使聊天面板居中 -->
  <div class="home-view">
    <!-- <div v-if="!isSessionPanelVisible" class="show-panel-btn iconfont icon-cebianlan" @click="toggleSessionPanel">
    </div> -->
    <!-- 整个聊天面板 -->
    <div class="chat-panel">
      <!-- 左侧的会话列表 -->
      <div class="session-panel" :class="{ hidden: !isSessionPanelVisible }">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="title"><b>SSAI</b></div>
            <div class="description">构建你的AI助手</div>
          </div>
          <div class="panel-header-right">
            <div class="hide-panel-btn iconfont icon-cebianlan" @click="toggleSessionPanel">
            </div>
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
          <div class="header-left">
            <div
              v-if="!isSessionPanelVisible"
              class="show-panel-btn iconfont icon-cebianlan"
              @click="toggleSessionPanel"
            ></div>
          </div>
          <div class="front">
            <div v-if="isEdit" class="title">
              <el-input
                v-model="activeSession.title"
                @keydown.enter="handleUpdateSession"
                @keydown.esc="isEdit = false; activeSession.title = originalTitle"
              ></el-input>
            </div>
            <div v-else class="title" @click="startEdit">
              <span class="title-text">{{ activeSession.title }}</span>
            </div>
          </div>
          <div class="header-right">
            <div class="mobile-actions">
              <div class="create-btn iconfont icon-xinjianliaotian" @click="handleCreateSession"></div>
            </div>
          </div>
        </div>
        <!-- <el-divider :border-style="'solid'" class="no-margin-bottom"/> -->
        <div class="content-container">
          <div class="message-list" ref="messageListRef">
            <!-- 添加空状态提示 -->
            <div v-if="wbmessages.length === 0" class="empty-chat-tip">
              <div class="welcome-text">
                我是 SSAI，很高兴遇见你！<br/>
                有什么可以帮忙你的？
              </div>
            </div>
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
          <message-input @send="handleSendMessage"></message-input>
        </div>
        <div v-if="isEdit" class="edit-overlay" @click.self="handleUpdateSession"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick, computed } from 'vue'
import type { ChatMessage, ChatSession } from '../../../typings/index'
import {
  findChatSessionById,
  queryChatSession,
  saveChatSession,
  updateSessionTitle,
} from '@/api/chat-session'
import SessionItem from '@/views/chat/components/SessionItem.vue'
import { CirclePlus } from '@element-plus/icons-vue'
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
  createdAt: '',
  updatedAt: '',
  user_id: '',
})
const sessionList = ref([] as ChatSession[])

const loading = ref(false)
const error = ref<Error | null>(null)

const { userInfo } = storeToRefs(useUserStore())

const messageListRef = ref<HTMLElement | null>(null)

const isSessionPanelVisible = ref(true)

const isTitleAutoSet = ref(false)

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

    // 6. 如果没有历史会话，自动创建一个新会话
    if (sessionList.value.length === 0) {
      await handleCreateSession()
    } else if (!activeSession.value.session_id) {
      // 如果有会话但没有激活的会话，选择第一个
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
      // 清空当前消息
      webSocketService.messages.value = []
      webSocketService.clearMessages()

      // 断开当前连接
      webSocketService.disconnect()

      // 如果还有其他会话，切换到第一个会话
      if (sessionList.value.length > 0) {
        const nextSession = sessionList.value[0]

        // 加载新会话的消息
        const detail = await findChatSessionById(nextSession.session_id)
        activeSession.value = {
          ...detail.data,
          messages: detail.data.messages.map((message: ChatMessage) => ({
            ...message,
            visibleChars: message.content?.length || 0,
          }))
        }

        // 连接新会话的WebSocket
        await webSocketService.connect(nextSession.session_id)

        // 更新消息列表
        for (const message of activeSession.value.messages) {
          webSocketService.messages.value.push({
            text: message.content,
            sender: message.role,
          })
        }
      } else {
        // 如果没有其他会话，重置当前会话
        activeSession.value = {
          session_id: '',
          title: '',
          message_count: 0,
          messages: [],
          createdAt: '',
          updatedAt: '',
          user_id: '',
        }
      }
    }
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除会话失败')
  }
}

// 定义WebSocket消息类型
interface WebSocketMessage {
  text: string
  sender: 'user' | 'assistant' | 'system'
  stream_id?: string
  type?: string
  is_complete?: boolean
}

// 修改创建会话部分，添加返回值
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

      isTitleAutoSet.value = false

      // 先更新会话列表
      sessionList.value.unshift(newSession)

      // 切换到新会话并清空消息
      webSocketService.messages.value = []
      webSocketService.clearMessages()

      // 断开旧连接
      webSocketService.disconnect()

      // 更新当前活跃会话
      activeSession.value = newSession

      // 连接新会话的WebSocket
      await webSocketService.connect(newSession.session_id)

      ElMessage.success('会话创建成功')
      return newSession
    }
  } catch (error) {
    console.error('创建会话失败:', error)
    ElMessage.error('创建会话失败')
  }
}

// 添加一个变量保存原始标题
const originalTitle = ref('')

// 修改进入编辑模式的处理
const startEdit = () => {
  originalTitle.value = activeSession.value.title
  isEdit.value = true
}

// 修改标题更新的处理函数
const handleUpdateSession = async () => {
  try {
    // 如果标题为空或只包含空格，保持原标题
    if (!activeSession.value.title.trim()) {
      activeSession.value.title = originalTitle.value
      isEdit.value = false
      return
    }

    // 如果标题没有变化，直接退出编辑模式
    if (activeSession.value.title === originalTitle.value) {
      isEdit.value = false
      return
    }

    const response = await updateSessionTitle({
      sessionId: activeSession.value.session_id,
      new_title: activeSession.value.title,
    })

    if (response.code === 200) {
      // 更新左侧会话列表中的标题
      isTitleAutoSet.value = true
      const sessionIndex = sessionList.value.findIndex(
        (s) => s.session_id === activeSession.value.session_id
      )
      if (sessionIndex !== -1) {
        sessionList.value[sessionIndex].title = activeSession.value.title
        // 强制更新会话列表
        sessionList.value = [...sessionList.value]
      }

      ElMessage.success('标题更新成功')
    } else {
      // 更新失败，恢复原标题
      activeSession.value.title = originalTitle.value
      ElMessage.error('标题更新失败')
    }
  } catch (error) {
    console.error('更新标题失败:', error)
    // 发生错误时恢复原标题
    activeSession.value.title = originalTitle.value
    ElMessage.error('标题更新失败')
  } finally {
    isEdit.value = false
  }
}

const handleSendMessage = async (message: string) => {
  if (!activeSession.value.session_id) {
    ElMessage.error('请先选择会话')
    return
  }

  try {
    // 判断是否是第一条用户消息
    const isFirstUserMessage = activeSession.value.message_count === 0 &&
                             wbmessages.value.filter(m => m.sender === 'user').length === 0
    webSocketService.messages.value.push({
      text: message,
      sender: 'user',
    })
    webSocketService.sendMessage(message)

    // 如果是第一条用户消息且标题未被修改
    if (isFirstUserMessage && !isTitleAutoSet.value) {
      // 截取前20个字符作为标题
      const newTitle = message.trim().slice(0, 20) || '新对话'

      // 更新本地数据
      activeSession.value.title = newTitle
      isTitleAutoSet.value = true

      // 更新左侧会话列表
      const sessionIndex = sessionList.value.findIndex(
        s => s.session_id === activeSession.value.session_id
      )
      if (sessionIndex !== -1) {
        sessionList.value[sessionIndex].title = newTitle
      }

      // 更新数据库
      await updateSessionTitle({
        sessionId: activeSession.value.session_id,
        new_title: newTitle
      })
    }


    // 更新当前会话的消息数量
    activeSession.value.message_count += 1

    // 更新左侧会话列表中对应会话的消息数量
    const sessionIndex = sessionList.value.findIndex(
      (s) => s.session_id === activeSession.value.session_id
    )
    if (sessionIndex !== -1) {
      sessionList.value[sessionIndex].message_count += 1
      // 强制更新会话列表
      sessionList.value = [...sessionList.value]
    }
  } catch (error) {
    console.error('消息发送失败:', error)
    ElMessage.error('消息发送失败')
  }
}

// 修改 WebSocket 消息监听，在收到助手回复时也更新消息数量
watch(
  () => webSocketService.messages.value,
  (newMessages) => {
    newMessages.forEach((msg: WebSocketMessage) => {
      const targetMessage = activeSession.value.messages.find(
        (message) => message.stream_id === msg.stream_id && message.role === 'assistant'
      )

      if (targetMessage) {
        targetMessage.content += msg.text

        if (!targetMessage.visibleChars) targetMessage.visibleChars = 0
        targetMessage.visibleChars = msg.text.length

        if (msg.is_complete) {
          targetMessage.is_complete = true

          // 当消息完成时，更新消息数量
          activeSession.value.message_count += 1

          // 更新左侧会话列表中对应会话的消息数量
          const sessionIndex = sessionList.value.findIndex(
            (s) => s.session_id === activeSession.value.session_id
          )
          if (sessionIndex !== -1) {
            sessionList.value[sessionIndex].message_count += 1
            // 强制更新会话列表
            sessionList.value = [...sessionList.value]
          }
        }
      }
    })

    // 滚动逻辑保持不变
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
      messages: detail.data.messages.map((message: ChatMessage) => ({
        ...message,
        message_id: message.message_id || message.message_id, // 兼容后端字段名
        type: message.type || '', // 确保 type 存在（如果是必选）
        visibleChars: message.content?.length || 0,
      })) as ChatMessage[], // 显式类型转换
    };

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
  }
}

watch(isEdit, (val) => {
  if (val) {
    nextTick(() => {
      const input = document.querySelector('.title .el-input__inner') as HTMLInputElement
      if (input) {
        input.focus()
        input.select() // 选中全部文本
        input.addEventListener('blur', handleUpdateSession)
      }
    })
  } else {
    const input = document.querySelector('.title .el-input__inner') as HTMLInputElement
    if (input) {
      input.removeEventListener('blur', handleUpdateSession)
    }
  }
})
</script>

<style lang="scss" scoped>
.home-view {
  position: relative;
  width: 100vw;
  display: flex;
  //justify-content: center;
  .icon-cebianlan {
    font-size: 30px;
  }
  .show-panel-btn {
    font-size: 30px;
    margin-left: 10px;
    margin-top: 10px;
  }

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
    height: 100vh;
    width: 100vw; /* 确保容器占满视口 */
    background-color: white;
    position: relative;

    .session-panel {
      // width: 300px;
      width: 200px;
      padding: 20px;
      position: relative;
      border-right: 1px solid rgba(black, 0.07);
      background-color: rgb(250 250 250);
      display: flex;
      flex-direction: column;
      height: 100%;
      transform: translateX(0);
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
        position: absolute;
        left: -300px;
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

        .back-index{
          margin-left: 20px;
        }
        /* 按钮于右侧边界留一些距离 */
        .new-session {
          margin-right: 20px;
        }
      }
    }

    /* 右侧消息记录面板*/
    .message-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;

      .header {
        padding: 25px 20px 10px;
        display: flex;
        height: 50px;
        justify-content: space-between;
        align-items: center;
        position: relative;

        .header-left {
          width: 40px;
          .show-panel-btn {
            font-size: 24px;
            cursor: pointer;
            color: #666;
            transition: all 0.3s ease;

            &:hover {
              color: #333;
              transform: scale(1.1);
            }
          }
        }

        .front {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 40px;

          .title {
            max-width: 400px;
            min-width: 100px;
            cursor: pointer;
            transition: all 0.2s;
            padding: 4px 8px;
            border-radius: 4px;

            .title-text {
              display: block;
              font-size: 18px;
              font-weight: 800;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: center;
            }

            &:hover {
              background: rgba(0,0,0,0.05);
            }

            :deep(.el-input__inner) {
              text-align: center;
              font-size: 18px;
              font-weight: 800;
            }
          }
        }

        .header-right {
          // width: 40px;
          display: flex;
          justify-content: flex-end;

          .mobile-actions {
            .create-btn {
              padding-right: 10px;
              padding-top: 10px;
              font-size: 24px;
              cursor: pointer;
              color: #666;
              transition: all 0.3s ease;

              &:hover {
                color: #333;
                transform: scale(1.1);
              }
            }
          }
        }
      }

      .content-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center; // 内容居中
        width: 100%;
        max-width: 800px;
        margin: 0 auto; // 水平居中
        // padding: 0 10px;
        overflow: hidden;

        .message-list {
          width: 100%;
          flex: 1;
          overflow-y: auto;
          padding-top: 10px;
          padding-bottom: 0;
          position: relative; // 添加相对定位

          // 添加空状态样式
          .empty-chat-tip {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            width: 100%;

            .welcome-text {
              font-size: 24px;
              font-weight: bold;
              color: rgba(0, 0, 0, 0.25); // 半透明黑色
              line-height: 1.5;
              white-space: pre-line; // 保留换行符
            }
          }
        }

        .message-input {
          width: 100%;
          margin-top: 0;
          margin-bottom: 20px;
        }
      }
    }
  }
  /* 调整折叠按钮位置 */
.toggle-panel-btn {
  left: 20px;
  top: 20px; // 原200px
  z-index: 1000;
}
}

.mobile-actions {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  align-items: center;
  gap: 12px;

  .new-btn {
    padding: 8px;
  }

  .fold-icon {
    font-size: 20px;
    color: #666;
    padding: 6px;
    background: rgba(0,0,0,0.05);
    border-radius: 4px;
  }
}

.hide-panel-btn{
  padding-bottom: 20px;
}

@media (max-width: 768px) {
    .button-wrapper {
    display: none !important;
  }
  .show-panel-btn {
    font-size: 30px;
    margin-left: 10px;
    margin-top: 20px;
  }
  .create-btn{
    font-size: 26px;
  }
  .home-view {
    .chat-panel {
      position: relative;
      overflow-x: hidden; // 防止横向滚动
      .session-panel {
        position: fixed;
        z-index: 1000;
        transition: transform 0.3s ease;
        height: 100vh;
        box-shadow: 2px 0 8px rgba(0,0,0,0.1);
        &.hidden {
          transform: translateX(-100%);
        }
      }

      .message-panel {
        width: 100vw;
        transform: translateX(0);
        transition: transform 0.3s ease;
        // 当侧边栏显示时整体右移
        .session-panel:not(.hidden) + & {
          transform: translateX(85%);
        }
        .header {
          padding: 10px;
          height: auto;
          position: relative;
          padding: 10px 80px 10px 20px !important;

      .front {
        width: 100%;

        .title {
          max-width: 60vw;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .mobile-actions {
          display: flex;
        }
        }

        .message-list {
          padding: 5px;
        }
      }
    }

    // 调整消息气泡
    .message {
      max-width: 90% !important;
      font-size: 14px;
      padding: 8px !important;
    }

    // 输入框适配
    .message-input {
      position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            padding: 10px;
            background: white;
            transform: translateX(0);
            transition: transform 0.3s ease;
            z-index: 1001;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.05);

            // 侧边栏显示时同步右移
            .session-panel:not(.hidden) + .message-panel & {
              transform: translateX(85%);
              width: calc(100vw - 85%);
              left: auto;
              right: 0;
            }

      :deep(.el-textarea__inner) {
        min-height: 50px !important;
        padding: 8px !important;
      }

      .button-area {
        height: 25px;
        padding: 0 8px;

        .iconfont.icon-fasong {
          font-size: 24px;
          padding-bottom: 15px;
        }
      }
    }
  }

  .content-container {
    width: 100vw;
    padding: 0 10px;
    padding-bottom: 80px;

    .message-list {
      padding: 5px;

      .message {
        max-width: 90% !important;
        padding: 8px !important;
        font-size: 14px;
      }
    }
  }
}


.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
