import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-background flex">

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
                <Link to="/" className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-accent" />
                    <span className="text-xl font-bold text-white tracking-tight">
                        Uni<span className="text-accent">Save</span> Sacco
                    </span>
                </Link>

                <div>
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                        Find Your Scholarship,{' '}
                        <span className="text-accent">Stay in School</span>
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Kenya's #1 scholarship discovery platform — connecting
                        students with government, county, and private funding
                        opportunities.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-10">
                        {[
                            { value: '50+', label: 'Scholarships' },
                            { value: '1,000+', label: 'Students' },
                            { value: 'KES 10M+', label: 'Funding' },
                            { value: '95%', label: 'Success Rate' }
                        ].map(({ value, label }) => (
                            <div
                                key={label}
                                className="bg-white/10 rounded-lg p-4 text-white"
                            >
                                <div className="text-2xl font-bold text-accent">
                                    {value}
                                </div>
                                <div className="text-white/70 text-sm">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-white/40 text-sm">
                    © {new Date().getFullYear()} UniSave Sacco 
                </p>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16">
                {/* Mobile Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 mb-8 lg:hidden"
                >
                    <GraduationCap className="w-7 h-7 text-primary" />
                    <span className="text-xl font-bold text-primary">
                        Uni<span className="text-accent">Save</span> Sacco
                    </span>
                </Link>

                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-2xl font-bold text-primary mb-1">
                        {title}
                    </h1>
                    <p className="text-muted-foreground mb-8">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;