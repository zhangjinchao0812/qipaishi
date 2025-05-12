<template>
  <Layout>
    <h2 class="section-title">包间状态</h2>
    
    <!-- 包间展示区域 -->
    <div class="room-grid">
      <div 
        v-for="room in rooms" 
        :key="room.id"
        class="room-block"
        :class="getRoomStatusClass(room)"
        @click="handleRoomClick(room)"
      >
        <div class="room-name">{{ room.name }}</div>
        <div class="room-status">{{ getRoomStatusText(room) }}</div>
        <template v-if="room.status === 'using'">
          <div class="room-time">{{ formatTime(room.usedTime) }}</div>
          <div class="room-fee">¥{{ room.currentFee.toFixed(2) }}</div>
        </template>
      </div>
    </div>

    <!-- 开房确认弹窗 -->
    <div class="modal" v-if="showOpenRoomModal">
      <div class="modal-content">
        <h3>确认开房</h3>
        <p>您确定要开启 {{ selectedRoom?.name }} 包间吗？</p>
        <div class="modal-buttons">
          <button @click="cancelOpenRoom" class="cancel-btn">取消</button>
          <button @click="confirmOpenRoom" class="confirm-btn">立即开房</button>
        </div>
      </div>
    </div>

    <!-- 包间详情弹窗 -->
    <div class="modal" v-if="showRoomDetailModal">
      <div class="modal-content room-detail-modal">
        <h3>包间详情</h3>
        <div class="room-info">
          <div class="info-row">
            <div class="info-col">
              <p><strong>包间名称：</strong>{{ selectedRoom?.name }}</p>
              <p><strong>开房时间：</strong>{{ formatDateTime(selectedRoom?.startTime) }}</p>
            </div>
            <div class="info-col">
              <p><strong>使用时长：</strong>{{ formatTime(selectedRoom?.usedTime) }}</p>
              <p><strong>包间计费：</strong>¥{{ getRoomFee(selectedRoom).toFixed(2) }}</p>
            </div>
          </div>
          <div class="total-fee">
            <p><strong>消费总额：</strong>¥{{ selectedRoom?.currentFee.toFixed(2) }}</p>
          </div>
        </div>

        <div class="product-list">
          <h4>商品消费</h4>
          <table>
            <thead>
              <tr>
                <th>商品名称</th>
                <th>数量</th>
                <th>单价</th>
                <th>金额</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in selectedRoom?.products" :key="index">
                <td>{{ product.name }}</td>
                <td>
                  <div class="quantity-control">
                    <button @click="decreaseQuantity(index)" :disabled="product.quantity <= 1">-</button>
                    <span>{{ product.quantity }}</span>
                    <button @click="increaseQuantity(index)">+</button>
                  </div>
                </td>
                <td>¥{{ product.price.toFixed(2) }}</td>
                <td>¥{{ (product.quantity * product.price).toFixed(2) }}</td>
                <td>
                  <button class="delete-btn" @click="removeProduct(index)">删除</button>
                </td>
              </tr>
              <tr v-if="!selectedRoom?.products || selectedRoom?.products.length === 0">
                <td colspan="5" class="no-data">暂无商品消费</td>
              </tr>
            </tbody>
          </table>

          <div class="product-total">
            <p><strong>商品总计：</strong>¥{{ getProductTotal(selectedRoom?.products).toFixed(2) }}</p>
          </div>

          <div class="add-product">
            <button class="add-product-btn" @click="showProductSelector = true">添加商品</button>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="cancelRoomDetail" class="cancel-btn">返回</button>
          <button @click="checkoutRoom" class="checkout-btn">退房</button>
        </div>
      </div>
    </div>

    <!-- 商品选择弹窗 -->
    <div class="modal product-selector" v-if="showProductSelector">
      <div class="modal-content">
        <h3>选择商品</h3>
        <div class="product-grid">
          <div 
            v-for="product in availableProducts" 
            :key="product.id"
            class="product-item"
            @click="addProduct(product)"
          >
            <div class="product-image" v-if="product.image">
              <img :src="product.image" :alt="product.name">
            </div>
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
            </div>
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="showProductSelector = false" class="cancel-btn">关闭</button>
        </div>
      </div>
    </div>

    <!-- 清理确认弹窗 -->
    <div class="modal" v-if="showCleanupModal">
      <div class="modal-content">
        <h3>确认清理</h3>
        <p>{{ selectedRoom?.name }} 包间是否已清理完毕？</p>
        <div class="modal-buttons">
          <button @click="cancelCleanup" class="cancel-btn">取消</button>
          <button @click="confirmCleanup" class="confirm-btn">确认已清理</button>
        </div>
      </div>
    </div>

    <!-- 退房确认弹窗 -->
    <div class="modal" v-if="showCheckoutModal">
      <div class="modal-content">
        <h3>确认退房</h3>
        <p>您确定要为 {{ selectedRoom?.name }} 包间办理退房吗？</p>
        <div class="checkout-info">
          <p><strong>使用时长：</strong>{{ formatTime(selectedRoom?.usedTime) }}</p>
          <p><strong>消费总额：</strong>¥{{ selectedRoom?.currentFee.toFixed(2) }}</p>
        </div>
        <div class="modal-buttons">
          <button @click="cancelCheckout" class="cancel-btn">取消</button>
          <button @click="confirmCheckout" class="confirm-btn">确认退房</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Layout from '../components/Layout.vue'

// 包间数据
const rooms = ref([
  { 
    id: 1, 
    number: '101', 
    name: '大包间1', 
    status: 'idle', // idle-空闲, using-使用中, cleaning-待清理
    type: 'large',
    priceType: 'hourly', // hourly-按小时, package-包时段
    price: 50, // 小时单价
    startTime: null,
    usedTime: 0, // 使用时长（分钟）
    currentFee: 0, // 当前费用
    products: [] // 商品消费
  },
  { 
    id: 2, 
    number: '102', 
    name: '大包间2', 
    status: 'idle',
    type: 'large',
    priceType: 'hourly',
    price: 50,
    startTime: null,
    usedTime: 0,
    currentFee: 0,
    products: []
  },
  { 
    id: 3, 
    number: '201', 
    name: '小包间1', 
    status: 'using',
    type: 'small',
    priceType: 'hourly',
    price: 30,
    startTime: new Date(new Date().getTime() - 65 * 60000), // 65分钟前
    usedTime: 65, // 使用65分钟
    currentFee: 32.5, // 30元/小时 × 65分钟
    products: [
      { name: '茶水', quantity: 1, price: 10 },
      { name: '瓜子', quantity: 2, price: 5 }
    ]
  },
  { 
    id: 4, 
    number: '202', 
    name: '小包间2', 
    status: 'cleaning',
    type: 'small',
    priceType: 'package',
    price: 100, // 4小时100元
    packageHours: 4,
    startTime: null,
    usedTime: 0,
    currentFee: 0,
    products: []
  },
  { 
    id: 5, 
    number: '301', 
    name: '大厅1号', 
    status: 'idle',
    type: 'hall',
    priceType: 'hourly',
    price: 20,
    startTime: null,
    usedTime: 0,
    currentFee: 0,
    products: []
  },
  { 
    id: 6, 
    number: '302', 
    name: '大厅2号', 
    status: 'idle',
    type: 'hall',
    priceType: 'hourly',
    price: 20,
    startTime: null,
    usedTime: 0,
    currentFee: 0,
    products: []
  }
])

// 选中的包间
const selectedRoom = ref(null)

// 弹窗显示状态
const showOpenRoomModal = ref(false)
const showRoomDetailModal = ref(false)
const showCleanupModal = ref(false)
const showCheckoutModal = ref(false)
const showProductSelector = ref(false)

// 可用商品列表
const availableProducts = ref([
  { id: 1, name: '茶水', price: 10, image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z"/></svg>' },
  { id: 2, name: '瓜子', price: 5, image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>' },
  { id: 3, name: '饮料', price: 8, image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M3,2H21L17,22H7L3,2M7.2,4L6.4,7H17.6L16.8,4H7.2M7.8,9L7,12H17L16.2,9H7.8M8.4,14L7.6,17H16.4L15.6,14H8.4Z"/></svg>' },
  { id: 4, name: '零食', price: 15, image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M12,3L3,13H6V21H18V13H21L12,3M8,15H16V19H8V15Z"/></svg>' }
])

// 定时器
let timer = null

// 获取包间状态样式类
const getRoomStatusClass = (room) => {
  if (room.status === 'idle') return 'status-idle'
  if (room.status === 'using') {
    // 如果是包时段且剩余时间不足10分钟，显示警告
    if (room.priceType === 'package') {
      const totalMinutes = room.packageHours * 60
      const remainingMinutes = totalMinutes - room.usedTime
      if (remainingMinutes <= 10) return 'status-warning'
    }
    return 'status-using'
  }
  if (room.status === 'cleaning') return 'status-cleaning'
  return ''
}

// 获取包间状态文本
const getRoomStatusText = (room) => {
  if (room.status === 'idle') return '空闲'
  if (room.status === 'using') return '使用中'
  if (room.status === 'cleaning') return '待清理'
  return ''
}

// 格式化时间（分钟转为小时:分钟）
const formatTime = (minutes) => {
  if (!minutes) return '00:00'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

// 格式化日期时间
const formatDateTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

// 处理包间点击
const handleRoomClick = (room) => {
  selectedRoom.value = room
  
  if (room.status === 'idle') {
    showOpenRoomModal.value = true
  } else if (room.status === 'using') {
    showRoomDetailModal.value = true
  } else if (room.status === 'cleaning') {
    showCleanupModal.value = true
  }
}

// 取消开房
const cancelOpenRoom = () => {
  showOpenRoomModal.value = false
  selectedRoom.value = null
}

// 确认开房
const confirmOpenRoom = () => {
  if (selectedRoom.value) {
    selectedRoom.value.status = 'using'
    selectedRoom.value.startTime = new Date()
    selectedRoom.value.usedTime = 0
    selectedRoom.value.currentFee = 0
    selectedRoom.value.products = []
  }
  showOpenRoomModal.value = false
}

// 取消包间详情
const cancelRoomDetail = () => {
  showRoomDetailModal.value = false
  selectedRoom.value = null
}

// 退房
const checkoutRoom = () => {
  showRoomDetailModal.value = false
  showCheckoutModal.value = true
}

// 取消退房
const cancelCheckout = () => {
  showCheckoutModal.value = false
  selectedRoom.value = null
}

// 确认退房
const confirmCheckout = () => {
  if (selectedRoom.value) {
    selectedRoom.value.status = 'cleaning'
    selectedRoom.value.usedTime = 0
  }
  showCheckoutModal.value = false
}

// 取消清理
const cancelCleanup = () => {
  showCleanupModal.value = false
  selectedRoom.value = null
}

// 确认清理
const confirmCleanup = () => {
  if (selectedRoom.value) {
    selectedRoom.value.status = 'idle'
  }
  showCleanupModal.value = false
  selectedRoom.value = null
}

// 获取包间费用（不含商品）
const getRoomFee = (room) => {
  if (!room || !room.status === 'using') return 0
  if (room.priceType === 'hourly') {
    return (room.usedTime / 60) * room.price
  } else if (room.priceType === 'package') {
    return room.price
  }
  return 0
}

// 获取商品总费用
const getProductTotal = (products) => {
  if (!products || products.length === 0) return 0
  return products.reduce((sum, product) => {
    return sum + (product.price * product.quantity)
  }, 0)
}

// 增加商品数量
const increaseQuantity = (index) => {
  if (selectedRoom.value && selectedRoom.value.products[index]) {
    selectedRoom.value.products[index].quantity++
    updateRoomFee()
  }
}

// 减少商品数量
const decreaseQuantity = (index) => {
  if (selectedRoom.value && selectedRoom.value.products[index] && selectedRoom.value.products[index].quantity > 1) {
    selectedRoom.value.products[index].quantity--
    updateRoomFee()
  }
}

// 删除商品
const removeProduct = (index) => {
  if (selectedRoom.value && selectedRoom.value.products) {
    selectedRoom.value.products.splice(index, 1)
    updateRoomFee()
  }
}

// 添加商品
const addProduct = (product) => {
  if (selectedRoom.value) {
    // 检查是否已存在该商品
    const existingProduct = selectedRoom.value.products.find(p => p.id === product.id)
    if (existingProduct) {
      existingProduct.quantity++
    } else {
      selectedRoom.value.products.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
    }
    updateRoomFee()
    showProductSelector.value = false
  }
}

// 更新包间费用
const updateRoomFee = () => {
  if (selectedRoom.value && selectedRoom.value.status === 'using') {
    const roomFee = getRoomFee(selectedRoom.value)
    const productTotal = getProductTotal(selectedRoom.value.products)
    selectedRoom.value.currentFee = roomFee + productTotal
  }
}

// 更新使用中包间的时间和费用
const updateRoomTime = () => {
  rooms.value.forEach(room => {
    if (room.status === 'using' && room.startTime) {
      // 计算使用时长（分钟）
      const now = new Date()
      const diffMs = now - new Date(room.startTime)
      room.usedTime = Math.floor(diffMs / 60000) // 转换为分钟
      
      // 更新费用
      const roomFee = getRoomFee(room)
      const productTotal = getProductTotal(room.products)
      room.currentFee = roomFee + productTotal
    }
  })
}

// 组件挂载时启动定时器
onMounted(() => {
  // 每分钟更新一次
  timer = setInterval(() => {
    updateRoomTime()
  }, 60000)
  
  // 初始更新一次
  updateRoomTime()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
/* 包间网格 */
.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

/* 包间块 */
.room-block {
  height: 150px;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.room-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

/* 包间状态样式 */
.status-idle {
  background-color: #f0f0f0;
  color: #666;
}

.status-using {
  background-color: #4caf50;
  color: white;
}

.status-warning {
  background-color: #ff9800;
  color: white;
}

.status-cleaning {
  background-color: #2196f3;
  color: white;
}

/* 包间编号 */
.room-number {
  font-size: 24px;
  font-weight: bold;
}

/* 包间名称 */
.room-name {
  font-size: 20px;
  font-weight: bold;
}

/* 包间状态 */
.room-status {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 14px;
  opacity: 0.8;
}

/* 使用时长 */
.room-time {
  font-size: 18px;
  margin-top: 10px;
}

/* 当前费用 */
.room-fee {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
}

/* 弹窗 */
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
  border-radius: 10px;
  padding: 25px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.room-detail-modal {
  width: 600px;
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.modal p {
  margin-bottom: 20px;
  color: #666;
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

.confirm-btn, .checkout-btn {
  padding: 8px 16px;
  background-color: #1a4a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.checkout-btn {
  background-color: #f44336;
}

/* 包间详情样式 */
.room-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.info-col {
  flex: 1;
}

.room-info p {
  margin: 8px 0;
}

.total-fee {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.total-fee p {
  font-size: 18px;
  color: #f44336;
}

/* 商品列表 */
.product-list {
  margin-top: 20px;
}

.product-list h4 {
  margin-bottom: 10px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

table th, table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

table th {
  background-color: #f5f5f5;
  font-weight: 500;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 15px 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-control button {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-control button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-btn {
  padding: 4px 8px;
  background-color: #ff4444;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.product-total {
  margin: 15px 0;
  text-align: right;
  font-size: 16px;
}

.add-product {
  margin-top: 15px;
}

.add-product-btn {
  padding: 8px 16px;
  background-color: #1a4a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

/* 商品选择器 */
.product-selector .modal-content {
  width: 960px;
  max-width: 90%;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 20px 0;
  max-height: 400px;
  overflow-y: auto;
}

.product-item {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 70px;
  height: 70px;
  background-color: #f5f5f5;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.product-info {
  flex-grow: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}

.product-price {
  color: #f44336;
  font-weight: 500;
  font-size: 18px;
}

/* 退房信息 */
.checkout-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin: 15px 0;
}

.checkout-info p {
  margin: 8px 0;
  color: #333;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
}
</style>