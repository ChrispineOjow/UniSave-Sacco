import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerStudent } from '@/services/auth.service';
import AuthLayout from '@/components/layout/AuthLayout';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nationalId: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        // Validate
        if(formData.password !== formData.confirmPassword){
            toast.error('Passwords do not match');
            return;
        }

        if(formData.password.length < 6){
            toast.error('Password must be at least 6 characters');
            return;
        }

        if(formData.nationalId.length !== 8){
            toast.error('National ID must be 8 digits');
            return;
        }

        setIsLoading(true);

        try {
            await registerStudent({
                nationalId: formData.nationalId,
                email: formData.email,
                password: formData.password
            });

            toast.success('Registration successful! Wait for admin approval before logging in.');
            navigate('/login');

        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create an Account"
            subtitle="Join UniSave Sacco and discover scholarships matched to you"
        >
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* National ID */}
                <div className="space-y-1.5">
                    <Label htmlFor="nationalId">National ID Number</Label>
                    <Input
                        id="nationalId"
                        name="nationalId"
                        type="text"
                        placeholder="Enter your 8-digit National ID"
                        value={formData.nationalId}
                        onChange={handleChange}
                        maxLength={8}
                        required
                    />
                </div>

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
                            placeholder="Create a password"
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

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    ! After registration your account will be reviewed by an admin
                    before you can log in. This usually takes 24 hours.
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-light text-white font-semibold"
                    disabled={isLoading}
                >
                    {isLoading
                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Account...</>
                        : 'Create Account'
                    }
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-secondary font-semibold hover:underline"
                    >
                        Login here
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;