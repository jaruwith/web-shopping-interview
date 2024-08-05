
import axios from 'axios';

//const API_BASE_URL = 'https://localhost:7040/api';
const API_BASE_URL = 'webapi-shopping-interview.azurewebsites.net/api';



  // ฟังก์ชันสำหรับการเรียกข้อมูลผลิตภัณฑ์
export const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Products`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching products: ' + error.message);
    }
  };
    
  