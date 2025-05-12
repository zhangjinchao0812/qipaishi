<template>
  <Layout>
    <h2 class="section-title">系统管理 - 用户管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-bar">
      <button class="add-btn" @click="showAddUserModal = true">
        <span class="icon">+</span> 新增用户
      </button>
    </div>

    <!-- 用户列表 -->
    <div class="user-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>用户名</th>
            <th>昵称</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id">
            <td>{{ index + 1 }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.nickname }}</td>
            <td>{{ formatDate(user.createTime) }}</td>
            <td>
              <button class="edit-btn" @click="handleEditUser(user)">编辑</button>
              <button class="delete-btn" @click="handleDeleteUser(user)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增用户弹窗 -->
    <div class="modal" v-if="showAddUserModal">
      <div class="modal-content">
        <h3>新增用户</h3>
        <div class="form-group">
          <label>用户名</label>
          <input v-model="userForm.username" type="text" placeholder="请输入用户名">
        </div>
        <div class="form-group">
          <label>昵称</label>
          <input v-model="userForm.nickname" type="text" placeholder="请输入昵称">
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="userForm.password" type="password" placeholder="请输入密码">
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input v-model="userForm.confirmPassword" type="password" placeholder="请再次输入密码">
        </div>
        <div class="modal-buttons">
          <button @click="cancelAddUser" class="cancel-btn">取消</button>
          <button @click="confirmAddUser" class="confirm-btn">确认</button>
        </div>
      </div>
    </div>

    <!-- 编辑用户弹窗 -->
    <div class="modal" v-if="showEditUserModal">
      <div class="modal-content">
        <h3>编辑用户</h3>
        <div class="form-group">
          <label>用户名</label>
          <input v-model="userForm.username" type="text" placeholder="请输入用户名">
        </div>
        <div class="form-group">
          <label>昵称</label>
          <input v-model="userForm.nickname" type="text" placeholder="请输入昵称">
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="userForm.password" type="password" placeholder="请输入新密码（留空则不修改）">
        </div>
        <div class="form-group" v-if="userForm.password">
          <label>确认密码</label>
          <input v-model="userForm.confirmPassword" type="password" placeholder="请再次输入新密码">
        </div>
        <div class="modal-buttons">
          <button @click="cancelEditUser" class="cancel-btn">取消</button>
          <button @click="confirmEditUser" class="confirm-btn">确认</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="modal" v-if="showDeleteUserModal">
      <div class="modal-content">
        <h3>删除确认</h3>
        <p>确定要删除用户 {{ selectedUser?.username }} 吗？</p>
        <div class="modal-buttons">
          <button @click="cancelDeleteUser" class="cancel-btn">取消</button>
          <button @click="confirmDeleteUser" class="confirm-btn delete-confirm">确认删除</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from '../components/Layout.vue'

// 用户数据
const users = ref([
  { 
    id: 1, 
    username: 'admin', 
    nickname: '管理员',
    password: '123456',
    createTime: new Date(2023, 0, 1)
  },
  { 
    id: 2, 
    username: 'operator', 
    nickname: '操作员',
    password: '123456',
    createTime: new Date(2023, 1, 15)
  }
])

// 弹窗显示状态
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showDeleteUserModal = ref(false)

// 选中的用户
const selectedUser = ref(null)

// 表单数据
const userForm = ref({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

// 处理编辑用户
const handleEditUser = (user) => {
  selectedUser.value = user
  userForm.value = { 
    username: user.username,
    nickname: user.nickname,
    password: '',
    confirmPassword: ''
  }
  showEditUserModal.value = true
}

// 取消编辑用户
const cancelEditUser = () => {
  showEditUserModal.value = false
  selectedUser.value = null
}

// 确认编辑用户
const confirmEditUser = () => {
  if (!validateUserForm(true)) return
  
  const index = users.value.findIndex(u => u.id === selectedUser.value.id)
  if (index !== -1) {
    // 更新用户信息
    users.value[index].username = userForm.value.username
    users.value[index].nickname = userForm.value.nickname
    
    // 如果输入了新密码，则更新密码
    if (userForm.value.password) {
      users.value[index].password = userForm.value.password
    }
  }
  
  showEditUserModal.value = false
  selectedUser.value = null
}

// 处理删除用户
const handleDeleteUser = (user) => {
  selectedUser.value = user
  showDeleteUserModal.value = true
}

// 取消删除用户
const cancelDeleteUser = () => {
  showDeleteUserModal.value = false
  selectedUser.value = null
}

// 确认删除用户
const confirmDeleteUser = () => {
  const index = users.value.findIndex(u => u.id === selectedUser.value.id)
  if (index !== -1) {
    users.value.splice(index, 1)
  }
  
  showDeleteUserModal.value = false
  selectedUser.value = null
}

// 取消新增用户
const cancelAddUser = () => {
  showAddUserModal.value = false
  resetUserForm()
}

// 确认新增用户
const confirmAddUser = () => {
  if (!validateUserForm()) return
  
  // 生成新ID
  const newId = Math.max(...users.value.map(u => u.id), 0) + 1
  
  // 添加新用户
  users.value.push({
    id: newId,
    username: userForm.value.username,
    nickname: userForm.value.nickname,
    password: userForm.value.password,
    createTime: new Date()
  })
  
  showAddUserModal.value = false
  resetUserForm()
}

// 重置表单
const resetUserForm = () => {
  userForm.value = {
    username: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  }
}

// 验证表单
const validateUserForm = (isEdit = false) => {
  if (!userForm.value.username) {
    alert('请输入用户名')
    return false
  }
  if (!userForm.value.nickname) {
    alert('请输入昵称')
    return false
  }
  
  // 检查用户名是否重复
  const existingUser = users.value.find(u => 
    u.id !== (selectedUser.value?.id || 0) && 
    u.username === userForm.value.username
  )
  
  if (existingUser) {
    alert('用户名已存在')
    return false
  }
  
  // 编辑模式下，如果没有输入密码，则不验证密码
  if (isEdit && !userForm.value.password) {
    return true
  }
  
  if (!userForm.value.password) {
    alert('请输入密码')
    return false
  }
  
  if (userForm.value.password.length < 6) {
    alert('密码长度不能少于6位')
    return false
  }
  
  if (userForm.value.password !== userForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return false
  }
  
  return true
}
</script>

<style scoped>
.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.add-btn {
  background-color: #1a4a2e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.add-btn .icon {
  margin-right: 5px;
  font-size: 16px;
}

.user-table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 500;
  color: #333;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: #f9f9f9;
}

.edit-btn, .delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
}

.edit-btn {
  background-color: #2196f3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  border-color: #1a4a2e;
  outline: none;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

.confirm-btn {
  padding: 8px 16px;
  background-color: #1a4a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.delete-confirm {
  background-color: #f44336;
}
</style>