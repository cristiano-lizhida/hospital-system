import axios from "axios";

const request = axios.create({
    baseURL: "/api/v1", // 确保所有请求自动带上这个前缀 
    timeout: 5000,
});

// 请求拦截
request.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 响应拦截：这是修复“返回值不统一”的核心
request.interceptors.response.use(
    (response) => {
        // 直接返回后端传来的 data 部分（即 gin.H 内容）
        // 这样在页面里 const res = await request.post(...) 拿到的就是 { token, user }
        return response.data;
    },
    (err) => {
        if (err.response?.status === 401) {
            localStorage.clear(); // 清理所有用户信息
            window.location.href = "/login";
        }
        // 统一抛出错误，让页面的 catch 块能抓到后端返回的 {"error": "..."}
        return Promise.reject(err);
    }
);

export default request;