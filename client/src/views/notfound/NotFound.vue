<template>
  <div class="error-page">
    <div class="container h-100">
      <div class="row align-items-center justify-content-center h-100">
        <div class="col-12 col-md-6 col-lg-6 h-100 d-none d-md-none d-lg-block">
          <div class="error-page-image">
            <img class="img-fluid" src="../../assets/picture/error-img.jpg" alt="img" />
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-6 h-100">
          <div class="error-page-content">
            <h1>404</h1>
            <h3>哎呀！你为什么来这里？</h3>
            <p>对于给您带来的不便，我们深表歉意。看起来你试图访问一个已被删除或从未存在的页面.</p>
            <RouterLink class="theme-btn btn-main" to="/">返回首页</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="App">
import { RouterLink } from 'vue-router'
</script>

<style scoped></style>
