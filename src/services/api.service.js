import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005"
})

export default api;