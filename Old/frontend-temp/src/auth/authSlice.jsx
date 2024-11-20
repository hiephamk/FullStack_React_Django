import axios from "axios";

const API_URL = "/api/auth/";

const register = async (userData) => {
    const response = await axios.post(API_URL + "register", userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(API_URL + "login", userData);
    if (response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Add refresh token functionality here
const refreshAccessToken = async (refreshToken) => {
    const response = await axios.post(API_URL + "refresh", { refresh: refreshToken });
    return response.data;
};

const authService = { register, login, logout, refreshAccessToken };

export default authService;
