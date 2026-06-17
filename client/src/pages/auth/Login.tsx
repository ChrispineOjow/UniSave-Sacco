import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginStudent, loginAdmin } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import type { StudentAuth, StudentProfile, Admin } from '@/types/index';

interface LoginProps {
    isAdmin?: boolean;
}

const Login = ({ isAdmin = false }: LoginProps) => {
    const navigate = useNavigate();
    const {
        loginStudent: setStudentAuth,
        loginAdmin: setAdminAuth
    } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if(isAdmin){
                // Admin login
                const data = await loginAdmin(formData);
                setAdminAuth(data.token, data.admin as Admin);
                toast.success('Welcome back, Admin!');
                navigate('/admin/dashboard');

            } else {
                // Student login
                const sanitizedFormData = {
                    ...formData,
                    email : formData.email.toLowerCase().trim()
                }
                const data = await loginStudent(sanitizedFormData);
                setStudentAuth(
                    data.token,
                    data.student as unknown as StudentAuth,
                    data.student?.profile as StudentProfile | null
                );
                toast.success('Welcome back!');

                // Redirect based on profile
                if(data.student?.hasProfile){
                    navigate('/dashboard');
                } else {
                    navigate('/profile');
                    toast('Please complete your profile to get matched scholarships', {
                        icon: '👋'
                    });
                }
            }

        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title={isAdmin ? 'Admin Portal' : 'Welcome Back'}
            subtitle={
                isAdmin
                    ? 'Sign in to manage students and scholarships'
                    : 'Sign in to discover and track your scholarships'
            }
        >
            {/* Admin Badge */}
            {isAdmin && (
                <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-4 py-3 mb-6 text-sm font-medium">
                    <ShieldCheck className="w-5 h-5" />
                    Admin Access Only
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword
                                ? <EyeOff className="w-4 h-4" />
                                : <Eye className="w-4 h-4" />
                            }
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-light text-white font-semibold"
                    disabled={isLoading}
                >
                    {isLoading
                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                        : isAdmin ? 'Sign in as Admin' : 'Sign in'
                    }
                </Button>

                {/* Links */}
                {!isAdmin && (
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-secondary font-semibold hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                )}

                {isAdmin && (
                    <p className="text-center text-sm text-muted-foreground">
                        Are you a student?{' '}
                        <Link
                            to="/login"
                            className="text-secondary font-semibold hover:underline"
                        >
                            Student Login
                        </Link>
                    </p>
                )}
            </form>
        </AuthLayout>
    );
};

export default Login;