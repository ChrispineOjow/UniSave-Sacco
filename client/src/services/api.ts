import axios from "axios";


const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL || "/api", 
    headers:{
        'Content-Type': 'application/json'
    }
});

//attach token requests automatically
api.interceptors.request.use((config) => {
    //Checking if it's an admin route
    if(config.url?.includes('/admin')){
        const adminToken = localStorage.getItem('adminToken');
        if(adminToken){
            config.headers.Authorization = `Bearer ${adminToken}`;
        }
    }else{
        const studentToken = localStorage.getItem('studentToken');
        if(studentToken){
            config.headers.Authorization = `Bearer ${studentToken}`;
        }
    }

    return config;
});

//Handling expired tokens globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            //Token expired - clear storage and redirect login
            localStorage.removeItem('studentToken');
            localStorage.removeItem('student');
            localStorage.removeItem('studentProfile');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;

