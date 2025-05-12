<template>
    <div class="login-container">
      <!-- 登录卡片 -->
      <div class="login-card">
        <h2 class="login-title">宏升茶府棋牌室管理系统</h2>
  
        <!-- 用户名输入框 -->
        <div class="input-group">
          <label for="username">用户名</label>
          <div class="input-wrapper">
            <input 
              id="username"
              v-model="loginForm.username" 
              type="text" 
              placeholder="请输入用户名"
            />
            <span class="icon">✉</span>
          </div>
        </div>
  
        <!-- 密码输入框 -->
        <div class="input-group">
          <label for="password">密码</label>
          <div class="input-wrapper">
            <input 
              id="password"
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码"
            />
            <span class="icon">🔒</span>
          </div>
        </div>
  
        <!-- 记住我 & 忘记密码 -->
        <div class="options-row">
          <div class="remember-me">
            <input type="checkbox" id="remember" />
            <label for="remember">记住我</label>
          </div>
          <a href="#" class="forgot-link">忘记密码?</a>
        </div>
  
        <!-- 登录按钮 -->
        <button 
          class="login-btn" 
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
  
        <!-- 注册链接 -->
        <div class="signup-link">
          还没有账号? <a href="#">立即注册</a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  // 初始化路由
  const router = useRouter()
  
  // 表单加载状态
  const loading = ref(false)
  
  // 登录表单数据
  const loginForm = ref({
    username: '',
    password: ''
  })
  
  // 表单验证函数
  const validateForm = () => {
    if (!loginForm.value.username) {
      alert('请输入用户名')
      return false
    }
    if (!loginForm.value.password) {
      alert('请输入密码')
      return false
    }
    if (loginForm.value.password.length < 6) {
      alert('密码长度不能少于6位')
      return false
    }
    return true
  }
  
  // 登录处理函数
  const handleLogin = () => {
    if (!validateForm()) return
  
    // 设置加载状态
    loading.value = true
  
    // 模拟登录请求（实际应调用 API）
    setTimeout(() => {
      try {
        console.log('登录成功', loginForm.value)
        console.log('尝试跳转到首页')
        // 跳转到首页
        router.push('/Home')
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        loading.value = false
      }
    }, 1000)
  }
  </script>
  
  <style scoped>
  /* 容器设置为绝对定位，占满整个视口 */
  .login-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('/images/poker-background.svg') center/cover no-repeat;
    transition: background 0.5s ease-in-out;
  }
  
  /* 登录卡片样式 */
  .login-card {
    width: 400px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: white;
  }
  
  /* 标题样式 */
  .login-title {
    margin-bottom: 30px;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
    color: white;
  }
  
  /* 输入组间距 */
  .input-group {
    margin-bottom: 20px;
  }
  
  /* 标签样式 */
  .input-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  /* 输入框容器 */
  .input-wrapper {
    position: relative;
  }
  
  /* 输入框样式 */
  .input-wrapper input {
    width: 100%;
    padding: 12px 15px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    color: white;
    font-size: 16px;
    outline: none;
    transition: all 0.3s;
  }
  
  /* 占位符文字颜色 */
  .input-wrapper input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  /* 焦点状态样式 */
  .input-wrapper input:focus {
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
  
  /* 图标位置 */
  .input-wrapper .icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.7);
  }
  
  /* 忘记密码与记住我行 */
  .options-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    font-size: 14px;
  }
  
  /* 记住我复选框 */
  .remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  /* 忘记密码链接 */
  .forgot-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
  }
  
  /* 鼠标悬停效果 */
  .forgot-link:hover {
    text-decoration: underline;
  }
  
  /* 登录按钮样式 */
  .login-btn {
    width: 100%;
    padding: 12px;
    background: white;
    color: #1a4a2e;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  /* 鼠标悬停时的按钮颜色 */
  .login-btn:hover {
    background: rgba(255, 255, 255, 0.9);
  }
  
  /* 禁用状态下的按钮样式 */
  .login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  /* 注册链接 */
  .signup-link {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
  }
  
  .signup-link a {
    color: white;
    text-decoration: none;
    font-weight: 500;
  }
  
  .signup-link a:hover {
    text-decoration: underline;
  }
  </style>