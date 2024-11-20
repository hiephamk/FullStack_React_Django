import axios from "axios";
import { useSelector } from "react-redux";


const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        'Authorization': `Bearer ${useSelector.token.access}`,
        "Content-Type": "application/json",
    },
});


export default api;
