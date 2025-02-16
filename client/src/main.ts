import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 基础样式
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import '@/assets/icon/iconfont.css';

// Font Awesome (建议通过npm安装)
import '@fortawesome/fontawesome-free/css/all.min.css'

// Swiper样式
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

// AOS动画
import 'aos/dist/aos.css'

// 自定义样式
import '@/assets/css/styles.css'
import '@/assets/css/responsive.css'

// import './assets/main.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 添加Element Plus样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
// import { useUserStore } from '@/stores/user'

const app = createApp(App)

// 在应用配置中添加
app.use(ElementPlus)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)

// router.beforeEach(async (to) => {
//   const userStore = useUserStore()
//   const authWhitelist = ['/login', '/register', '/forgot']

//   // 白名单直接放行
//   if (authWhitelist.includes(to.path)) return true

//   try {
//     // 已登录用户访问登录页时重定向
//     if (to.path === '/login' && userStore.isLoggedIn) {
//       return '/'
//     }

//     // 需要认证的页面处理
//     if (to.meta.requiresAuth) {
//       if (!userStore.isInitialized) {
//         await userStore.initialize()
//       }
//       return userStore.isLoggedIn ? true : '/login'
//     }

//     return true
//   } catch (error) {
//     console.error('路由守卫错误:', error)
//     return '/login'
//   }
// })

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('MdPreview', MdPreview)

app.mount('#app')
