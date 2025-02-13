<!-- 整个div是用来调整内部消息的位置，每条消息占的空间都是一整行，然后根据right还是left来调整内部的消息是靠右边还是靠左边 -->
<template>
  <div :class="['message-row', message.role === 'user' ? 'right' : 'left']">
    <!-- 消息展示，分为上下，上面是头像，下面是消息 -->
    <div class="row">
      <!-- 头像， -->
      <div class="avatar-wrapper">
        <el-avatar v-if="message.role === 'user'" :src="avatar" class="avatar" shape="square" />
        <el-avatar v-else :src="logo" class="avatar" shape="square" />
      </div>
      <!-- 发送的消息或者回复的消息 -->
      <div :class="`message message--${message.sender}`">
        <div v-html="renderedText"></div>
      </div>
        <!-- 如果消息的内容为空则显示加载动画 -->
        <!-- <TextLoading v-else></TextLoading> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRef, ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import type { ChatMessage } from '../../../../typings'
import logo from '@/assets/picture/our-team-1.jpg'
import TextLoading from '@/views/chat/components/TextLoading.vue'
import { marked } from 'marked'
import { MessageSender } from '@/services/WebSocketService'

interface Props {
  message: MessageSender;
  avatar?: string;
}

// message：接受消息对象，展示消息内容和头像，并且根据角色调整消息位置。
// avatar：用户头像，如果角色是 Assistant则使用 logo。
const props = defineProps({
  message: {
    type: Object as PropType<MessageSender>,
    required: true,
  },
  avatar: { type: String, default: 'https://www.jarcheng.top/images/logo.jpg' },
})

const emit = defineEmits<{
  (e: 'completeText', text: string): void;
}>();

const message = toRef(props, 'message');
const avatar = toRef(props, 'avatar');
const currentText = ref('');

watch(
  () => [message.value.type, message.value.text] as const,
  ([newType, newText]) => {
    if (newType === 'end') {
      console.log('完整信息:', newText);
      currentText.value = newText;
      emit('completeText', newText);
      console.log('currentText:', currentText.value)
    }
  },
  { immediate: true }
);

watch(
  () => props.message.content,
  (newVal) => {
    if (!newVal || newVal.length <= visibleChars.value) return

    let current = 0
    const animate = () => {
      if (current < newVal.length) {
        visibleChars.value = current++
        requestAnimationFrame(animate)
      }
    }
    animate()
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
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
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
.message-row {
  display: flex;

  &.right {
    // 消息显示在右侧
    justify-content: flex-end;

    .row {
      // 头像也要靠右侧
      .avatar-wrapper {
        display: flex;
        justify-content: flex-end;
      }

      // 用户回复的消息和ChatGPT回复的消息背景颜色做区分
      .message {
        background-color: rgb(231, 248, 255);
      }
    }
  }

  // 默认靠左边显示
  .row {
    .avatar-wrapper {
      .avatar {
        box-shadow: 20px 20px 20px 3px rgba(0, 0, 0, 0.03);
        margin-bottom: 20px;
      }
    }

    .message {
      font-size: 15px;
      padding: 1.5px;
      // 限制消息展示的最大宽度
      max-width: 500px;
      // 圆润一点
      border-radius: 7px;
      // 给消息框加一些描边，看起来更加实一些，要不然太扁了轻飘飘的。
      border: 1px solid rgba(black, 0.1);
      // 增加一些阴影看起来更加立体
      box-shadow: 20px 20px 20px 1px rgba(0, 0, 0, 0.01);
    }
  }
}

// 调整markdown组件的一些样式，deep可以修改组件内的样式，正常情况是scoped只能修改本组件的样式。
:deep(.md-editor-preview-wrapper) {
  padding: 0 10px;

  .smart-blue-theme p {
    line-height: unset;
  }
}
</style>
