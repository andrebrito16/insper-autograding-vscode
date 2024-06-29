import axios from "axios";

const api = axios.create({
  baseURL: "http://3.139.20.244/iag",
});

export default api;