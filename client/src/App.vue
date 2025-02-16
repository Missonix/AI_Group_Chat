<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  </head>
  <div class="app">
    <!-- 返回顶部 -->
    <BackTop v-if="!$route.meta.hideNavbar" />
    <!-- 导航栏 -->
    <NavigationBar v-if="!$route.meta.hideNavbar" />
    <!-- 内容 -->
    <main class="main-content">
      <router-view />
    </main>
    <!-- 页脚 -->
    <footer class="footer" v-if="!$route.meta.hideFooter">
      <FooterBar />
    </footer>
  </div>
</template>

<script setup lang="ts" name="App">
import NavigationBar from '@/components/NavigationBar.vue'
import FooterBar from '@/components/FooterBar.vue'
import BackTop from '@/components/BackTop.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 添加调试信息
console.log('当前路由meta信息:', route.meta)
</script>

<style>
body {
  margin: 0;
  font-family:
    Noto Sans SC,
    SF Pro SC,
    SF Pro Text,
    SF Pro Icons,
    PingFang SC,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
}

.app {
  position: relative;
}
::-webkit-scrollbar {
  --bar-width: 5px;
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-clip: content-box;
  border: 1px solid transparent;
}

.slide-enter-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  transform: translateX(-100vw);
  opacity: 0;
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateX(100vw);
  opacity: 0;
}
</style>


