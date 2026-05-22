import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import type { ReactNode } from 'react';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/student/Dashboard';
import Scholarships from './pages/student/Scholarships';
import MatchedScholarships from './pages/student/MatchedScholarships';
import Applications from './pages/student/Applications';
import Profile from './pages/student/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageScholarships from './pages/admin/ManageScholarships';

const StudentRoute = ({ children }: { children: ReactNode }) => {
    const { isStudentLoggedIn, isLoading } = useAuth();
    if(isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );
    return isStudentLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { isAdminLoggedIn, isLoading } = useAuth();
    if(isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );
    return isAdminLoggedIn ? <>{children}</> : <Navigate to="/admin/login" />;
};

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<Login isAdmin />} />

            <Route path="/dashboard" element={<StudentRoute><Dashboard /></StudentRoute>} />
            <Route path="/scholarships" element={<StudentRoute><Scholarships /></StudentRoute>} />
            <Route path="/scholarships/matched" element={<StudentRoute><MatchedScholarships /></StudentRoute>} />
            <Route path="/applications" element={<StudentRoute><Applications /></StudentRoute>} />
            <Route path="/profile" element={<StudentRoute><Profile /></StudentRoute>} />

            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/students" element={<AdminRoute><ManageStudents /></AdminRoute>} />
            <Route path="/admin/scholarships" element={<AdminRoute><ManageScholarships /></AdminRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;