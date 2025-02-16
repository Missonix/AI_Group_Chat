<template>
  <div class="auth-container">
    <!-- 左侧背景 -->
    <div class="background">
      <h1>Missonix AI算力综合体</h1>
      <ul>
        <li>弹性</li>
        <li>好用</li>
        <li>省钱</li>
      </ul>
    </div>
    <!-- 右侧路由视图 -->
    <div class="form-container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts" name="AuthLayout"></script>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.background {
  flex: 0 0 35%;
  background: url('https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png') no-repeat
    center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 40px;
  position: relative;
}

.background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.background h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.background ul {
  list-style: none;
  padding: 0;
  position: relative;
  z-index: 1;
}

.background li {
  font-size: 1.4rem;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.background li::before {
  content: '✓';
  color: #00c851;
  font-weight: bold;
}

.form-container {
  flex: 0 0 65%;
  padding: 80px 100px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1001;
}
.auth-container {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
  flex-direction: column;
}

.background {
  display: none;
}

.form-container {
  flex: 1;
  width: 100%;
  padding: 40px 20px;
  box-shadow: none;
}

/* 电脑端样式 */
@media (min-width: 768px) {
  .auth-container {
    flex-direction: row;
  }

  .background {
    display: flex;
    flex: 0 0 35%;
  }

  .form-container {
    flex: 0 0 65%;
    padding: 80px 100px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
}
</style>
