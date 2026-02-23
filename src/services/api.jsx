// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const loginParent = (email, password) =>
  api.post("/login", { email, password });

export default api;