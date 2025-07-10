import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Ton backend
});

export default instance;
