<template>
  <div class="slider-container" ref="sliderContainer">
    <div class="slider-track">
      <!-- 已完成部分 -->
      <div class="slider-progress" :style="{ width: progress + 'px' }"></div>
      <!-- 滑块按钮 -->
      <div
        class="slider-button"
        :style="{ left: progress + 'px' }"
        @mousedown="onDragStart"
        @touchstart.prevent="onDragStart"
      >
        <span v-if="!verified">»</span>
        <span v-else>✔</span>
      </div>
      <!-- 提示文字 -->
      <div class="slider-text" v-if="!verified">请拖动滑块验证</div>
      <div class="slider-text" v-else>验证通过</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 定义事件
const emit = defineEmits<{
  (e: 'success'): void
  (e: 'fail'): void
}>()

// 验证状态
const verified = ref(false)
// 当前进度（单位：px）
const progress = ref(0)
// 是否正在拖动
const isDragging = ref(false)
// 记录拖动开始时的 X 坐标
const startX = ref(0)
// 滑块容器 DOM 引用
const sliderContainer = ref<HTMLDivElement | null>(null)
// 最大拖动距离（根据容器宽度计算）
const maxWidth = ref(0)

/** 开始拖动 */
const onDragStart = (event: MouseEvent | TouchEvent) => {
  if (verified.value) return

  // 记录初始位置（相对于容器左侧）
  const containerRect = sliderContainer.value?.getBoundingClientRect()
  if (!containerRect) return

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  startX.value = clientX - containerRect.left - progress.value

  isDragging.value = true
  window.addEventListener('mousemove', onDragging)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragging, { passive: false })
  window.addEventListener('touchend', onDragEnd)
}

/** 拖动过程中 */
const onDragging = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  // 获取容器位置信息
  const containerRect = sliderContainer.value?.getBoundingClientRect()
  if (!containerRect) return

  // 计算当前鼠标/触摸位置相对于容器的坐标
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const relativeX = clientX - containerRect.left

  // 计算实际可移动范围（容器宽度 - 滑块宽度）
  const maxValidDelta = containerRect.width - 40

  // 计算拖动距离（限制在0到maxValidDelta之间）
  const delta = Math.max(0, Math.min(relativeX - startX.value, maxValidDelta))

  progress.value = delta

  // 当拖动到最右端时完成验证
  if (delta >= maxValidDelta - 2) {
    // 留2px容差
    verified.value = true
    isDragging.value = false
    removeListeners()
    emit('success')
  }

  event.preventDefault?.()
}

/** 拖动结束 */
const onDragEnd = () => {
  if (!isDragging.value) return
  // 若验证未完成，则重置并触发失败事件
  if (!verified.value) {
    progress.value = 0
    emit('fail')
  }
  isDragging.value = false
  removeListeners()
}

/** 移除事件监听 */
const removeListeners = () => {
  window.removeEventListener('mousemove', onDragging)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragging)
  window.removeEventListener('touchend', onDragEnd)
}

/** 组件挂载后计算最大拖动距离 */
onMounted(() => {
  if (sliderContainer.value) {
    // 假设滑块按钮宽度为 40px
    maxWidth.value = sliderContainer.value.offsetWidth - 40
  }
})

/** 组件卸载时移除事件监听 */
onBeforeUnmount(() => {
  removeListeners()
})

// 添加重置方法
const reset = () => {
  verified.value = false
  progress.value = 0
  removeListeners()
}

// 暴露组件方法
defineExpose({
  reset,
})
</script>

<style scoped>
.slider-container {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 40px;
  background-color: #e8e8e8;
  border-radius: 20px;
  overflow: hidden;
  user-select: none;
}

.slider-progress {
  position: absolute;
  height: 100%;
  background-color: #3760f4;
  border-radius: 20px 0 0 20px;
  transition: width 0.2s;
}

.slider-button {
  position: absolute;
  top: 0;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  text-align: center;
  line-height: 38px;
  cursor: pointer;
  z-index: 2;
  user-select: none;
  transition: left 0.1s;
}

.slider-text {
  position: absolute;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
  z-index: 1;
}
</style>
