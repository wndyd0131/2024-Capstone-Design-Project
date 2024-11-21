import { API_AUTH } from "@/constants/API";
import axiosInstance from "./axiosInstance";
import loginInstance from "./loginInstance";

export const postLogin = (email, password) => {
  return loginInstance({
    url: API_AUTH.LOGIN,
    method: "POST",
    data: {
      email,
      password,
    },
  });
};

export const postLogout = () => {
  return loginInstance({
    url: API_AUTH.LOGOUT,
    method: "POST",
  });
};
