import axios from "axios";

const instance = axios.create({
  baseURL: "https://ecomm-mern-mwy6.onrender.com/api",
});

instance.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default instance;
