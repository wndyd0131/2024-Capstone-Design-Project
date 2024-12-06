import axios from "axios";
import Cookies from "js-cookie";

const documentInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": " multipart/form-data", //이걸로 안되면 그냥 삭제
    Authorization: `Bearer ${Cookies.get("access_token")}`,
  },
});

export default documentInstance;
