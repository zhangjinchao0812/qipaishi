import request from '@/utils/request'

export const login = async (data) => {
  try {
    const response = await request({
      url: '/user/login',
      method: 'post',
      data
    })
    return response.data
  } catch (error) {
    throw error.response?.data?.message || error.message
  }
}