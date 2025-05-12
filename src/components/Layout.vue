<template>
  <div class="layout-container">
    <!-- 顶部标题栏 -->
    <header class="header">
      <div class="logo">🎮</div>
      <h1>宏升茶府棋牌室管理系统</h1>
    </header>

    <div class="main-content">
      <!-- 左侧菜单 -->
      <aside class="sidebar">
        <ul class="menu">
          <li 
            v-for="(item, index) in menuItems" 
            :key="index"
            :class="{ active: currentPath === item.path }"
            @click="navigateTo(item.path)"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            {{ item.name }}
          </li>
        </ul>
      </aside>

      <!-- 右侧内容区 -->
      <main class="content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前路径
const currentPath = computed(() => route.path)

// 菜单项
const menuItems = [
  { name: '首页', path: '/Home', icon: '🏠' },
  { name: '包间管理', path: '/rooms', icon: '🚪' },
  { name: '商品管理', path: '/products', icon: '🛒' },
  { name: '系统管理', path: '/system', icon: '⚙️' }
]

// 导航函数
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
}

/* 顶部标题栏 */
.header {
  height: 60px;
  background-color: #1a4a2e;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  margin-right: 10px;
}

.header h1 {
  font-size: 20px;
  font-weight: 500;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
}

/* 左侧菜单 */
.sidebar {
  width: 200px;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.menu li:hover {
  background-color: rgba(26, 74, 46, 0.05);
}

.menu li.active {
  background-color: rgba(26, 74, 46, 0.1);
  color: #1a4a2e;
  border-left: 3px solid #1a4a2e;
}

.menu-icon {
  margin-right: 10px;
}

/* 右侧内容区 */
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  width: calc(100% - 200px);
}
</style>