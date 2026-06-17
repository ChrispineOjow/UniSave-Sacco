import api from './api.ts';
import type {Scholarship, ScholarshipUpdatePayload}from '../types/index';


interface ScholarshipResponse {
    count: number;
    scholarships: Scholarship[];
}

interface SingleScholarshipResponse{
    scholarship: Scholarship;
}

//Student
export const  getAllScholarships = async (filters?: {
    category?:string;
    county?:string;
    fundingType?:string;
    search?:string;
})=>{
    const response = await api.get<ScholarshipResponse>(
        '/students/scholarships',
        { params: filters}
    );
    return response.data;
};


export const getScholarshipById = async (id:string)=>{
    const response = await api.get<SingleScholarshipResponse>(`/students/scholarships/${id}`);
    return response.data;
}

export const getMatchedScholarships = async()=>{
    const response = await api.get<ScholarshipResponse>('/students/scholarships/match');
    return response.data;
}

//Admin
export const addScholarship = async (data: Partial<Scholarship>)=>{
    const response = await api.post('/admin/scholarships/add',data);
    return response.data;
}

export const updateScholarship = async (id: string, payload: ScholarshipUpdatePayload) => {
    const { data } = await api.patch(`/admin/scholarships/update/${id}`, payload);
    return data;
};

export const deleteScholarship = async(id: string)=> {
    const response = await api.delete(`/admin/scholarships/delete/${id}`);
    return response.data;
}

export const verifyScholarship = async(id: string)=>{
    const response = await api.patch(`/admin/scholarships/verify/${id}`);
    return response.data;
}

export const getAllScholarshipsAdmin = async () => {
    const response = await api.get<ScholarshipResponse>('/admin/scholarships/all');
    return response.data;
}

