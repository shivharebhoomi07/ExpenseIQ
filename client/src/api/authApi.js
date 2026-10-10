import axiosInstance from './axiosConfig';

export const loginApi = (credentials) => axiosInstance.post('/auth/login', credentials);
export const registerApi = (data) => axiosInstance.post('/auth/register', data);
