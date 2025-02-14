<template>
  <header>
    <nav id="navbar_top" ref="navbarTop" class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container">
        <div class="layer-header">
          <RouterLink class="navbar-brand" to="/">
            <img class="img-fluid" src="@/assets/picture/logo2.png" alt="img" />
          </RouterLink>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main_nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="fa fa-bars"></span>
          </button>
          <div class="collapse navbar-collapse" id="main_nav">
            <ul class="navbar-nav me-auto ms-auto">
              <!-- <li class="nav-item">
                <a class="nav-link" href="features.html"> 特点 </a>
              </li> -->
              <li class="nav-item dropdown">
                <RouterLink class="nav-link" to="#" data-bs-toggle="dropdown"> 产品 </RouterLink>
                <ul class="dropdown-menu animate slideIn">
                  <li><RouterLink class="dropdown-item" to="#"> 产品1</RouterLink></li>
                  <li><RouterLink class="dropdown-item" to="#"> 产品2 </RouterLink></li>
                  <li><RouterLink class="dropdown-item" to="#"> 产品3 </RouterLink></li>
                  <li>
                    <RouterLink class="dropdown-item" to="#"> 即将到来 </RouterLink>
                  </li>
                </ul>
              </li>

              <li class="nav-item">
                <RouterLink class="nav-link" to="/pricing"> 价格 </RouterLink>
              </li>

              <li class="nav-item">
                <RouterLink class="nav-link" to="#"> 文档 </RouterLink>
              </li>

              <li class="nav-item dropdown">
                <RouterLink class="nav-link" to="#" data-bs-toggle="dropdown"> 关于 </RouterLink>
                <ul class="dropdown-menu animate slideIn">
                  <li><RouterLink class="dropdown-item" to="#"> 团队</RouterLink></li>
                  <!-- <li><a class="dropdown-item" href="error.html"> 404 Error </a></li> -->
                  <li><RouterLink class="dropdown-item" to="#"> FAQ'S </RouterLink></li>
                  <li><RouterLink class="dropdown-item" to="#"> 即将到来 </RouterLink></li>
                  <li>
                    <RouterLink class="dropdown-item" to="#"> 条款和条件 </RouterLink>
                  </li>
                  <li>
                    <RouterLink class="dropdown-item" to="#"> 隐私政策 </RouterLink>
                  </li>
                </ul>
              </li>
              <!-- <li class="nav-item">
                <a class="nav-link" href="blog.html"> 博客 </a>
              </li> -->
              <li class="nav-item">
                <RouterLink class="nav-link" to="#"> 联系 </RouterLink>
              </li>
            </ul>
            <div class="header-btns ms-5">
              <template v-if="!userStore.isLoggedIn">
                <RouterLink class="theme-btn btn-no-design" to="/login">登录</RouterLink>
              </template>
              <template v-else>
                <a class="theme-btn btn-no-design" href="#" @click.prevent="logout">退出</a>
              </template>
              <a class="theme-btn btn-no-design" href="#">中文 <i class="fa fa-angle-down"></i></a>
              <RouterLink class="theme-btn btn-main" to="/chat">开始生成</RouterLink>
            </div>
          </div>
          <!-- navbar-collapse.// -->
        </div>
      </div>
      <!-- container-fluid.// -->
    </nav>
  </header>
</template>

<script setup lang="ts" name="NavigationBar">
import { useMain } from '@/composables/useMain'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user' // 根据实际路径调整

const userStore = useUserStore()

const logout = () => {
  userStore.logout()
}

// 从useMain中获取导航栏相关功能
const { navbarTop } = useMain()
</script>

<style scoped>
/* 如果需要覆盖默认样式 */
/* .navbar.fixed-top {
  background-color: var(--body-bg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
} */
.header-btns .theme-btn {
  margin-right: 8px;  /* 添加按钮间距 */
}
</style>
