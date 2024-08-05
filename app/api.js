
import axios from 'axios';

//const API_BASE_URL = 'https://localhost:7040/api';
const API_BASE_URL = 'https://test-swagger-api-final.azurewebsites.net/api';

// ฟังก์ชันสำหรับเรียกข้อมูลผู้ใช้
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Users`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching users: ' + error);
  }
};

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้
export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Users`, userData);
      return response.data;
    } catch (error) {
      throw new Error('Error registering user: ' + error.message);
    }
  };

  // ฟังก์ชันสำหรับการเรียกข้อมูลผลิตภัณฑ์
export const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Products`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching products: ' + error.message);
    }
  };
    
  // ฟังก์ชันสำหรับการสร้างออเดอร์
  export const createOrder = async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Orders`, orderData);
      return response.data;
    } catch (error) {
      throw new Error('Error creating order: ' + error.message);
    }
  };
  
  // ฟังก์ชันสำหรับการอัพเดทสต็อคสินค้า
  export const updateProductStock = async (productId, stock) => {
    try {
      const formData = new FormData();
      formData.append('Stock', stock);
  
      await axios.put(`${API_BASE_URL}/Products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      throw new Error('Error updating product stock: ' + error.message);
    }
  };

// ฟังก์ชันสำหรับการเรียกข้อมูลออเดอร์
export const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Orders`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching orders: ' + error.message);
    }
  };    
  
  // ฟังก์ชันสำหรับการเรียกข้อมูลออเดอร์ไอเท็ม
  export const fetchOrderItems = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Orders/${orderId}`);
      return response.data.orderItems;
    } catch (error) {
      throw new Error('Error fetching order items: ' + error.message);
    }
  };