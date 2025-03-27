import axios from "axios";
import config from "../config/config";

const http = axios.create({
  baseURL: config.apiUrl,
});

http.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("subAdminToken") || null;
  return config;
});

export const login = async (data, params, headers) =>
  http.post("/api/v1/subAdmin/login", data, { params, headers });

export const check = async (params, headers) =>
  http.get("/api/v1/subAdmin/check", { params, headers });

// booking create apis

// export const userCreate = async (data, params, headers) =>
//   http.post("/api/v1/user/signup", data, { params, headers });

export const userCreate = async (data, params, headers) =>
  http.post("/api/v1/subAdmin/user/signup", data, { params, headers });

export const availableDrivers = async (data, headers) =>
  http.post("/api/v1/subAdmin/available-drivers", data, { headers });

export const sendScheduledRequest = async (data, params, headers) =>
  http.post("/api/v1/subAdmin/send-scheduled-request", data, {
    params,
    headers,
  });

export const getAllPreBookings = async (params, headers) =>
  http.get("/api/v1/subAdmin/getPreBookingHistory", { params, headers });

export const dashboard = async (params, headers) =>
  http.get("/api/v1/subAdmin/dashboard", { params, headers });

export const getScheduleRequestForAllUsers = async (params, headers) =>
  http.get("/api/v1/subAdmin/request/getScheduleRequestForAllUsers", {
    params,
    headers,
  });

export const availableDriversForScheduleRide = async (data, params, headers) =>
  http.post("/api/v1/subAdmin/request/availableDriversForScheduleRide", data, {
    params,
    headers,
  });

export const driverAllocateToUserRequest = async (data, params, headers) =>
  http.post("/api/v1/subAdmin/request/driverAllocateToUserRequest", data, {
    params,
    headers,
  });
