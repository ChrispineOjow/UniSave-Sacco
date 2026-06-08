import api from "./api.ts";
import type {AuthResponse} from "../types/index";


export const registerStudent = async (data:{
    nationalId: string;
    email: string;
    password: string;
})=>{
    const response = await api.post<AuthResponse>('/students/auth/register', data);
    return response.data;
};

export const loginStudent = async (data:{
    email:string;
    password:string;
})=>{
    const response = await api.post<AuthResponse>('/students/auth/login', data);
    return response.data;
};

export const logoutStudent = async ()=>{
    const response = await api.post('/students/auth/logout');
    return response.data;
};

export const loginAdmin = async (data:{
    email:string;
    password:string;
})=>{
    const response = await api.post<AuthResponse>('/admin/login',data);
    return response.data;
}
