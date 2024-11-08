import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000/'
const AxiosInstance = axios.create({
    baseURL: baseUrl, 
    timeout: 5000, 
    headers: {
        "Content-Type": "application/json", 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        accept: "application/json"
    }
})

export default AxiosInstance