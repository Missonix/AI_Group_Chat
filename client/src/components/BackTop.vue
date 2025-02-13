<template>
  <button @click="scrollToTop" id="backTop" title="Go to top" :class="{ show: showBackToTop }">
    <i class="fa fa-arrow-up"></i>
  </button>
</template>

<script setup lang="ts" name="BackTop">
import { useMain } from '@/composables/useMain'
const { scrollToTop, showBackToTop } = useMain()
</script>

<style scoped>
#backTop {
  display: none; /* 默认隐藏 */
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: var(--theme-color-2);
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 4px;
  width: 50px;
  height: 50px;
  line-height: 18px;
  transition: all 0.3s ease;
}

#backTop.show {
  display: block; /* 显示按钮 */
}

#backTop:hover {
  background-color: #171389;
}
</style>
