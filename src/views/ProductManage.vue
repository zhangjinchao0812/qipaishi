<template>
  <Layout>
    <h2 class="section-title">商品管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-bar">
      <button class="add-btn" @click="showAddProductModal = true">
        <span class="icon">+</span> 新增商品
      </button>
    </div>

    <!-- 商品列表 -->
    <div class="product-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>商品图片</th>
            <th>商品名称</th>
            <th>商品编码</th>
            <th>单价(元)</th>
            <th>库存数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.id">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="product-image">
                <img v-if="product.image" :src="product.image" alt="商品图片">
                <div v-else class="no-image">暂无图片</div>
              </div>
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.code }}</td>
            <td>{{ product.price.toFixed(2) }}</td>
            <td>{{ product.quantity }}</td>
            <td>
              <button class="edit-btn" @click="handleEditProduct(product)">编辑</button>
              <button class="delete-btn" @click="handleDeleteProduct(product)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增商品弹窗 -->
    <div class="modal" v-if="showAddProductModal">
      <div class="modal-content">
        <h3>新增商品</h3>
        <div class="form-group">
          <label>商品名称</label>
          <input v-model="productForm.name" type="text" placeholder="请输入商品名称">
        </div>
        <div class="form-group">
          <label>商品编码</label>
          <input v-model="productForm.code" type="text" placeholder="请输入商品编码">
        </div>
        <div class="form-group">
          <label>商品单价(元)</label>
          <input v-model.number="productForm.price" type="number" placeholder="请输入商品单价">
        </div>
        <div class="form-group">
          <label>库存数量</label>
          <input v-model.number="productForm.quantity" type="number" placeholder="请输入库存数量">
        </div>
        <div class="form-group">
          <label>商品图片</label>
          <div class="image-upload">
            <div class="preview" v-if="productForm.image">
              <img :src="productForm.image" alt="预览图">
              <button class="remove-image" @click="productForm.image = ''">×</button>
            </div>
            <div class="upload-btn" v-else>
              <span>点击上传图片</span>
              <input type="file" accept="image/*" @change="handleImageUpload">
            </div>
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="cancelAddProduct" class="cancel-btn">取消</button>
          <button @click="confirmAddProduct" class="confirm-btn">确认</button>
        </div>
      </div>
    </div>

    <!-- 编辑商品弹窗 -->
    <div class="modal" v-if="showEditProductModal">
      <div class="modal-content">
        <h3>编辑商品</h3>
        <div class="form-group">
          <label>商品名称</label>
          <input v-model="productForm.name" type="text" placeholder="请输入商品名称">
        </div>
        <div class="form-group">
          <label>商品编码</label>
          <input v-model="productForm.code" type="text" placeholder="请输入商品编码">
        </div>
        <div class="form-group">
          <label>商品单价(元)</label>
          <input v-model.number="productForm.price" type="number" placeholder="请输入商品单价">
        </div>
        <div class="form-group">
          <label>库存数量</label>
          <input v-model.number="productForm.quantity" type="number" placeholder="请输入库存数量">
        </div>
        <div class="form-group">
          <label>商品图片</label>
          <div class="image-upload">
            <div class="preview" v-if="productForm.image">
              <img :src="productForm.image" alt="预览图">
              <button class="remove-image" @click="productForm.image = ''">×</button>
            </div>
            <div class="upload-btn" v-else>
              <span>点击上传图片</span>
              <input type="file" accept="image/*" @change="handleImageUpload">
            </div>
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="cancelEditProduct" class="cancel-btn">取消</button>
          <button @click="confirmEditProduct" class="confirm-btn">确认</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="modal" v-if="showDeleteProductModal">
      <div class="modal-content">
        <h3>删除确认</h3>
        <p>确定要删除商品 {{ selectedProduct?.name }} 吗？</p>
        <div class="modal-buttons">
          <button @click="cancelDeleteProduct" class="cancel-btn">取消</button>
          <button @click="confirmDeleteProduct" class="confirm-btn delete-confirm">确认删除</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from '../components/Layout.vue'

// 商品数据
const products = ref([
  { 
    id: 1, 
    name: '茶水', 
    code: 'CS001',
    price: 10,
    quantity: 100,
    image: ''
  },
  { 
    id: 2, 
    name: '瓜子', 
    code: 'GZ001',
    price: 5,
    quantity: 50,
    image: ''
  },
  { 
    id: 3, 
    name: '饮料', 
    code: 'YL001',
    price: 8,
    quantity: 80,
    image: ''
  },
  { 
    id: 4, 
    name: '水果拼盘', 
    code: 'SG001',
    price: 30,
    quantity: 20,
    image: ''
  }
])

// 弹窗显示状态
const showAddProductModal = ref(false)
const showEditProductModal = ref(false)
const showDeleteProductModal = ref(false)

// 选中的商品
const selectedProduct = ref(null)

// 表单数据
const productForm = ref({
  name: '',
  code: '',
  price: 0,
  quantity: 0,
  image: ''
})

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 检查文件类型
  if (!file.type.match('image.*')) {
    alert('请上传图片文件')
    return
  }
  
  // 读取文件为 base64
  const reader = new FileReader()
  reader.onload = (e) => {
    productForm.value.image = e.target.result
  }
  reader.readAsDataURL(file)
}

// 处理编辑商品
const handleEditProduct = (product) => {
  selectedProduct.value = product
  productForm.value = { ...product }
  showEditProductModal.value = true
}

// 取消编辑商品
const cancelEditProduct = () => {
  showEditProductModal.value = false
  selectedProduct.value = null
}

// 确认编辑商品
const confirmEditProduct = () => {
  if (!validateProductForm()) return
  
  const index = products.value.findIndex(p => p.id === selectedProduct.value.id)
  if (index !== -1) {
    products.value[index] = { ...productForm.value, id: selectedProduct.value.id }
  }
  
  showEditProductModal.value = false
  selectedProduct.value = null
}

// 处理删除商品
const handleDeleteProduct = (product) => {
  selectedProduct.value = product
  showDeleteProductModal.value = true
}

// 取消删除商品
const cancelDeleteProduct = () => {
  showDeleteProductModal.value = false
  selectedProduct.value = null
}

// 确认删除商品
const confirmDeleteProduct = () => {
  const index = products.value.findIndex(p => p.id === selectedProduct.value.id)
  if (index !== -1) {
    products.value.splice(index, 1)
  }
  
  showDeleteProductModal.value = false
  selectedProduct.value = null
}

// 取消新增商品
const cancelAddProduct = () => {
  showAddProductModal.value = false
  resetProductForm()
}

// 确认新增商品
const confirmAddProduct = () => {
  if (!validateProductForm()) return
  
  // 生成新ID
  const newId = Math.max(...products.value.map(p => p.id), 0) + 1
  
  // 添加新商品
  products.value.push({
    ...productForm.value,
    id: newId
  })
  
  showAddProductModal.value = false
  resetProductForm()
}

// 重置表单
const resetProductForm = () => {
  productForm.value = {
    name: '',
    code: '',
    price: 0,
    quantity: 0,
    image: ''
  }
}

// 验证表单
const validateProductForm = () => {
  if (!productForm.value.name) {
    alert('请输入商品名称')
    return false
  }
  if (!productForm.value.code) {
    alert('请输入商品编码')
    return false
  }
  
  // 检查名称和编码是否重复
  const existingProduct = products.value.find(p => 
    p.id !== (selectedProduct.value?.id || 0) && 
    (p.name === productForm.value.name || p.code === productForm.value.code)
  )
  
  if (existingProduct) {
    if (existingProduct.name === productForm.value.name) {
      alert('商品名称已存在')
    } else {
      alert('商品编码已存在')
    }
    return false
  }
  
  if (!productForm.value.price || productForm.value.price <= 0) {
    alert('请输入有效的商品单价')
    return false
  }
  
  if (!productForm.value.quantity || productForm.value.quantity < 0) {
    alert('请输入有效的库存数量')
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

.product-table-container {
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

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: #999;
  font-size: 12px;
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
  width: 100px;
  flex-shrink: 0;
  color: #555;
  font-size: 14px;
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

/* 图片上传样式 */
.image-upload {
  margin-top: 5px;
}

.upload-btn {
  width: 100%;
  height: 100px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.upload-btn span {
  color: #666;
}

.upload-btn input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.preview {
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
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