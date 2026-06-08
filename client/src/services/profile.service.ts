import api from "./api.ts";
import type{ StudentProfile} from "../types/index";

interface ProfileResponse {
    message: string;
    profile: StudentProfile;
    studentProfile: StudentProfile;
}


export const createProfile = async(data: Partial<StudentProfile>)=>{
    const response = await api.post<ProfileResponse>('/students/profile/create', data);
    return response.data;
}

export const getMyProfile = async () => {
    const response = await api.get<ProfileResponse>('/students/profile/me');
    return response.data;
}

export const updateProfile = async (data: Partial<StudentProfile>)=>{
    const response = await api.patch<ProfileResponse>('/students/profile/update',data);
    return response.data;
}