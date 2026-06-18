import api from './api';

interface StudentAuth {
    _id: string;
    email: string;
    nationalId: string;
    accountStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

interface StudentsResponse {
    count: number;
    students: StudentAuth[];
}

export const getAllStudents = async () => {
    const response = await api.get<StudentsResponse>('/admin/students/all');
    return response.data;
};

export const getPendingStudents = async () => {
    const response = await api.get<StudentsResponse>('/admin/students/pending');
    return response.data;
};

export const approveStudent = async (studentId: string) => {
    const response = await api.patch(`/admin/students/${studentId}/approve`);
    return response.data;
};

export const rejectStudent = async (studentId: string) => {
    const response = await api.patch(`/admin/students/${studentId}/reject`);
    return response.data;
};

export const updateApplicationStatusAdmin = async (
    id: string,
    status: 'Approved' | 'Rejected'
) => {
    const response = await api.patch(`/admin/applications/update/${id}`, { status });
    return response.data;
};

export const getStudentProfile = async (studentAuthId: string) => {
    const { data } = await api.get(`/admin/students/${studentAuthId}/profile`);
    return data;
};

export const deleteStudent = async (studentId: string) => {
    const { data } = await api.delete(`/admin/students/${studentId}`);
    return data;
};

export const getAllScholarshipsAdmin = async () => {
    const response = await api.get('/admin/scholarships/all');
    return response.data;
};
