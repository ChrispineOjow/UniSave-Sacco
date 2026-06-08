import api from './api.ts';
import type{ Application} from '../types/index';

interface ApplicationResponse{
    count:number;
    applications: Application[];
}

interface SingleApplicationResponse{
    message:string;
    application: Application;
}

//Student 
export const saveScholarship = async (scholarshipId: string)=>{
    const response = await api.post<SingleApplicationResponse>(
        '/students/applications/save', 
        { scholarshipId}
    );
    return response.data;
};

export const applyForScholarship = async (scholarshipId: string) => {
    const response =  await api.post<SingleApplicationResponse>(
        '/students/applications/apply',
        { scholarshipId}
    );
    return response.data; 
};

export const getMyApplications = async () => {
    const response = await api.get<ApplicationResponse>(
        '/students/applications/me'
    );
    return response.data;
};

export const updateApplicationStatus = async(
    id:string,
    data: {status: string, notes?:string}
)=>{
    const response = await api.patch<SingleApplicationResponse>(
        `/students/applications/update/${id}`,
        data
    );
    return response.data;
};

export const deleteApplication = async (id: string)=>{
    const response = await api.delete(`/students/applications/delete/${id}`);
    return response.data;
}

//Admin
export const getAllApplicationsAdmin = async () => {
    const response = await api.get<ApplicationResponse>(
        '/admin/applications/all'
    );
    return response.data;
};

export const updateApplicationsStatusAdmin = async(
    id: string,
    status: 'Approved' | 'Rejected'
)=>{
    const response = await api.patch(
        `/admin/applications/update/${id}`,
        {status}
    );
    return response.data
}