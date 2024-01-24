import axios from "axios";
const BASE_URL="http://localhost:5172/api/v1";//url of server
const axiosInstance=axios.create();
axiosInstance.defaults.baseURL=BASE_URL;
axiosInstance.defaults.withCredentials=true;
export default axiosInstance;
