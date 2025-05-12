<template>
  <Layout>
    <h2 class="section-title">包间管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-bar">
      <button class="add-btn" @click="showAddRoomModal = true">
        <span class="icon">+</span> 新增包间
      </button>
    </div>

    <!-- 包间列表 -->
    <div class="room-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>包间名称</th>
            <th>包间编号</th>
            <th>包间类型</th>
            <th>计价方式</th>
            <th>价格</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in rooms" :key="room.id">
            <td>{{ index + 1 }}</td>
            <td>{{ room.name }}</td>
            <td>{{ room.number }}</td>
            <td>{{ getRoomTypeName(room.type) }}</td>
            <td>{{ getPriceTypeName(room.priceType) }}</td>
            <td>
              <template v-if="room.priceType === 'hourly'">
                {{ room.price }}元/小时
              </template>
              <template v-else>
                {{ room.packageHours }}小时{{ room.price }}元
              </template>
            </td>
            <td>
              <button class="edit-btn" @click="handleEditRoom(room)">编辑</button>
              <button class="delete-btn" @click="handleDeleteRoom(room)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增包间弹窗 -->
    <div class="modal" v-if="showAddRoomModal">
      <div class="modal-content">
        <h3>新增包间</h3>
        <div class="form-group">
          <label>包间名称</label>
          <input v-model="roomForm.name" type="text" placeholder="请输入包间名称">
        </div>
        <div class="form-group">
          <label>包间编号</label>
          <input v-model="roomForm.number" type="text" placeholder="请输入包间编号">
        </div>
        <div class="form-group">
          <label>包间类型</label>
          <select v-model="roomForm.type">
            <option value="large">大房间</option>
            <option value="small">小房间</option>
            <option value="hall">大厅</option>
          </select>
        </div>
        <div class="form-group">
          <label>计价方式</label>
          <select v-model="roomForm.priceType">
            <option value="hourly">按小时</option>
            <option value="package">包时段</option>
          </select>
        </div>
        <div class="form-group" v-if="roomForm.priceType === 'hourly'">
          <label>小时单价（元）</label>
          <input v-model.number="roomForm.price" type="number" placeholder="请输入小时单价">
        </div>
        <div v-if="roomForm.priceType === 'package'">
          <div class="form-group">
            <label>包时段时长（小时）</label>
            <input v-model.number="roomForm.packageHours" type="number" placeholder="请输入包时段时长">
          </div>
          <div class="form-group">
            <label>包时段价格（元）</label>
            <input v-model.number="roomForm.price" type="number" placeholder="请输入包时段价格">
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="cancelAddRoom" class="cancel-btn">取消</button>
          <button @click="confirmAddRoom" class="confirm-btn">确认</button>
        </div>
      </div>
    </div>

    <!-- 编辑包间弹窗 -->
    <div class="modal" v-if="showEditRoomModal">
      <div class="modal-content">
        <h3>编辑包间</h3>
        <div class="form-group">
          <label>包间名称</label>
          <input v-model="roomForm.name" type="text" placeholder="请输入包间名称">
        </div>
        <div class="form-group">
          <label>包间编号</label>
          <input v-model="roomForm.number" type="text" placeholder="请输入包间编号">
        </div>
        <div class="form-group">
          <label>包间类型</label>
          <select v-model="roomForm.type">
            <option value="large">大房间</option>
            <option value="small">小房间</option>
            <option value="hall">大厅</option>
          </select>
        </div>
        <div class="form-group">
          <label>计价方式</label>
          <select v-model="roomForm.priceType">
            <option value="hourly">按小时</option>
            <option value="package">包时段</option>
          </select>
        </div>
        <div class="form-group" v-if="roomForm.priceType === 'hourly'">
          <label>小时单价（元）</label>
          <input v-model.number="roomForm.price" type="number" placeholder="请输入小时单价">
        </div>
        <div v-if="roomForm.priceType === 'package'">
          <div class="form-group">
            <label>包时段时长（小时）</label>
            <input v-model.number="roomForm.packageHours" type="number" placeholder="请输入包时段时长">
          </div>
          <div class="form-group">
            <label>包时段价格（元）</label>
            <input v-model.number="roomForm.price" type="number" placeholder="请输入包时段价格">
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="cancelEditRoom" class="cancel-btn">取消</button>
          <button @click="confirmEditRoom" class="confirm-btn">确认</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="modal" v-if="showDeleteRoomModal">
      <div class="modal-content">
        <h3>删除确认</h3>
        <p>确定要删除 {{ selectedRoom?.name }} ({{ selectedRoom?.number }}) 吗？</p>
        <div class="modal-buttons">
          <button @click="cancelDeleteRoom" class="cancel-btn">取消</button>
          <button @click="confirmDeleteRoom" class="confirm-btn delete-confirm">确认删除</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from '../components/Layout.vue'

// 包间数据
const rooms = ref([
  { 
    id: 1, 
    number: '101', 
    name: '大包间1', 
    type: 'large',
    priceType: 'hourly',
    price: 50,
    packageHours: null
  },
  { 
    id: 2, 
    number: '102', 
    name: '大包间2', 
    type: 'large',
    priceType: 'hourly',
    price: 50,
    packageHours: null
  },
  { 
    id: 3, 
    number: '201', 
    name: '小包间1', 
    type: 'small',
    priceType: 'hourly',
    price: 30,
    packageHours: null
  },
  { 
    id: 4, 
    number: '202', 
    name: '小包间2', 
    type: 'small',
    priceType: 'package',
    price: 100,
    packageHours: 4
  },
  { 
    id: 5, 
    number: '301', 
    name: '大厅1号', 
    type: 'hall',
    priceType: 'hourly',
    price: 20,
    packageHours: null
  },
  { 
    id: 6, 
    number: '302', 
    name: '大厅2号', 
    type: 'hall',
    priceType: 'hourly',
    price: 20,
    packageHours: null
  }
])

// 弹窗显示状态
const showAddRoomModal = ref(false)
const showEditRoomModal = ref(false)
const showDeleteRoomModal = ref(false)

// 选中的包间
const selectedRoom = ref(null)

// 表单数据
const roomForm = ref({
  name: '',
  number: '',
  type: 'large',
  priceType: 'hourly',
  price: 0,
  packageHours: 4
})

// 获取包间类型名称
const getRoomTypeName = (type) => {
  const types = {
    large: '大房间',
    small: '小房间',
    hall: '大厅'
  }
  return types[type] || type
}

// 获取计价方式名称
const getPriceTypeName = (type) => {
  const types = {
    hourly: '按小时',
    package: '包时段'
  }
  return types[type] || type
}

// 处理编辑包间
const handleEditRoom = (room) => {
  selectedRoom.value = room
  roomForm.value = { ...room }
  showEditRoomModal.value = true
}

// 取消编辑包间
const cancelEditRoom = () => {
  showEditRoomModal.value = false
  selectedRoom.value = null
}

// 确认编辑包间
const confirmEditRoom = () => {
  if (!validateRoomForm()) return
  
  const index = rooms.value.findIndex(r => r.id === selectedRoom.value.id)
  if (index !== -1) {
    rooms.value[index] = { ...roomForm.value, id: selectedRoom.value.id }
  }
  
  showEditRoomModal.value = false
  selectedRoom.value = null
}

// 处理删除包间
const handleDeleteRoom = (room) => {
  selectedRoom.value = room
  showDeleteRoomModal.value = true
}

// 取消删除包间
const cancelDeleteRoom = () => {
  showDeleteRoomModal.value = false
  selectedRoom.value = null
}

// 确认删除包间
const confirmDeleteRoom = () => {
  const index = rooms.value.findIndex(r => r.id === selectedRoom.value.id)
  if (index !== -1) {
    rooms.value.splice(index, 1)
  }
  
  showDeleteRoomModal.value = false
  selectedRoom.value = null
}

// 取消新增包间
const cancelAddRoom = () => {
  showAddRoomModal.value = false
  resetRoomForm()
}

// 确认新增包间
const confirmAddRoom = () => {
  if (!validateRoomForm()) return
  
  // 生成新ID
  const newId = Math.max(...rooms.value.map(r => r.id), 0) + 1
  
  // 添加新包间
  rooms.value.push({
    ...roomForm.value,
    id: newId
  })
  
  showAddRoomModal.value = false
  resetRoomForm()
}

// 重置表单
const resetRoomForm = () => {
  roomForm.value = {
    name: '',
    number: '',
    type: 'large',
    priceType: 'hourly',
    price: 0,
    packageHours: 4
  }
}

// 验证表单
const validateRoomForm = () => {
  if (!roomForm.value.name) {
    alert('请输入包间名称')
    return false
  }
  if (!roomForm.value.number) {
    alert('请输入包间编号')
    return false
  }
  
  // 检查名称和编号是否重复
  const existingRoom = rooms.value.find(r => 
    r.id !== (selectedRoom.value?.id || 0) && 
    (r.name === roomForm.value.name || r.number === roomForm.value.number)
  )
  
  if (existingRoom) {
    if (existingRoom.name === roomForm.value.name) {
      alert('包间名称已存在')
    } else {
      alert('包间编号已存在')
    }
    return false
  }
  
  if (roomForm.value.priceType === 'hourly' && (!roomForm.value.price || roomForm.value.price <= 0)) {
    alert('请输入有效的小时单价')
    return false
  }
  
  if (roomForm.value.priceType === 'package') {
    if (!roomForm.value.packageHours || roomForm.value.packageHours <= 0) {
      alert('请输入有效的包时段时长')
      return false
    }
    if (!roomForm.value.price || roomForm.value.price <= 0) {
      alert('请输入有效的包时段价格')
      return false
    }
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

.room-table-container {
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
  width: 500px;
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
  display: flex;
  align-items: center;
}

.form-group label {
  width: 140px;
  color: #555;
  font-size: 14px;
  margin-right: 10px;
}

.form-group input, .form-group select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus, .form-group select:focus {
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