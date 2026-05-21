import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import type{StudentAuth , StudentProfile, Admin} from '../types/index.ts';

interface AuthContextType {
    student:StudentAuth | null;
    studentProfile: StudentProfile | null;
    studentToken: string | null;
    isStudentLoggedIn: boolean;


    admin: Admin | null;
    adminToken: string | null;
    isAdminLoggedIn: boolean;

    loginStudent: (token: string, student: StudentAuth, profile: StudentProfile | null )=>void;
    loginAdmin: (token: string, admin:Admin)=>void;
    logoutStudent: ()=>void;
    logoutAdmin: ()=>void;
    updateStudentProfile: (profile: StudentProfile)=>void;

    isLoading:boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children :ReactNode}) => {
    const [student, setStudent] = useState<StudentAuth | null>(null);
    const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
    const [studentToken, setStudentToken] = useState<string | null>(null);

    const [admin, setAdmin] = useState<Admin | null>(null);
    const [adminToken, setAdminToken] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(()=>{
        try{

            const savedStudentToken = localStorage.getItem('studentToken');
            const savedStudent = localStorage.getItem('student');
            const savedStudentProfile = localStorage.getItem('studentProfile');

            const savedAdminToken = localStorage.getItem('adminToken');
            const savedAdmin = localStorage.getItem('admin');


            if(savedStudentToken && savedStudent){
                setStudentToken(savedStudentToken);
                setStudent(JSON.parse(savedStudent));
                if(savedStudentProfile){
                    setStudentProfile(JSON.parse(savedStudentProfile));
                }
            }

            if(savedAdminToken && savedAdmin){
                setAdminToken(savedAdminToken);
                setAdmin(JSON.parse(savedAdmin))
            }

        }catch(error){

            console.error('Error loading auth from storage: ', error);

        }finally{
            setIsLoading(false);
        }
    },[])


    //Student Actions

    const loginStudent = (
        token:string,
        studentData: StudentAuth,
        profile: StudentProfile | null
    )=>{
        setStudentToken(token);
        setStudent(studentData);
        setStudentProfile(profile);

        localStorage.setItem('studentToken', token);
        localStorage.setItem('student', JSON.stringify(studentData));
        if(!profile){
            localStorage.setItem('studentProfile', JSON.stringify(profile));  
        }
    };

    const logoutStudent = () =>{
        setStudentToken(null);
        setStudent(null);
        setStudentProfile(null);

        localStorage.removeItem('studentToken');
        localStorage.removeItem('student');
        localStorage.removeItem('studentProfile');
    };

    const updateStudentProfile = (profile: StudentProfile)=>{
        setStudentProfile(profile);
        localStorage.setItem('studentProfile', JSON.stringify(profile));
    };

    //Admin Actions
    const loginAdmin = (token: string, adminData: Admin) =>{
        setAdminToken(token);
        setAdmin(adminData);

        localStorage.setItem('adminToken',token);
        localStorage.setItem('admin', JSON.stringify(adminData));
    };

    const logoutAdmin = () => {
        setAdminToken(null);
        setAdmin(null);

        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
    };

    return(
        <AuthContext.Provider value={{
            student,
            studentProfile,
            studentToken,
            isStudentLoggedIn: !!student && !!studentToken,
            
            admin,
            adminToken,
            isAdminLoggedIn: !!admin && !!adminToken,

            loginStudent,
            loginAdmin,
            logoutStudent,
            logoutAdmin,
            updateStudentProfile,

            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be inside AuthProvider');
    }
    return context;
}