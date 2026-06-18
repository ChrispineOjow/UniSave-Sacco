import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    LayoutDashboard,
    BookOpen,
    Sparkles,
    ClipboardList,
    User,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import type { ReactNode } from 'react';

const navItems = [
    { label: 'Dashboard',           to: '/dashboard',             icon: LayoutDashboard },
    { label: 'Scholarships',        to: '/scholarships',          icon: BookOpen },
    { label: 'Matched For Me',      to: '/scholarships/matched',  icon: Sparkles },
    { label: 'My Applications',     to: '/applications',          icon: ClipboardList },
    { label: 'My Profile',          to: '/profile',               icon: User },
];

const StudentLayout = ({ children }: { children: ReactNode }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { student, studentProfile, logoutStudent } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logoutStudent();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const initials = studentProfile
        ? `${studentProfile.firstName[0]}${studentProfile.lastName[0]}`
        : student?.email[0].toUpperCase() || 'S';

    return (
        <div className="min-h-screen bg-background flex">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
           <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-primary z-30
                transform transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:sticky lg:translate-x-0 lg:flex lg:flex-col
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-2">
                        <GraduationCap className="w-7 h-7 text-accent" />
                        <span className="text-lg font-bold text-white">
                            Uni<span className="text-accent">Save</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white/70 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map(({ label, to, icon: Icon }) => {
                        const isActive = pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg
                                    transition-colors text-sm font-medium
                                    ${isActive
                                        ? 'bg-accent text-primary'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info + Logout */}
                <div className="px-4 py-5 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-accent text-primary font-bold text-sm">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                                {studentProfile
                                    ? `${studentProfile.firstName} ${studentProfile.lastName}`
                                    : 'Complete Profile'
                                }
                            </p>
                            <p className="text-white/50 text-xs truncate">
                                {student?.email}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top Bar */}
                <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-primary"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden lg:block">
                        <h1 className="text-sm text-muted-foreground">
                            Welcome back,{' '}
                            <span className="font-semibold text-primary">
                                {studentProfile?.firstName || student?.email}
                            </span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-white text-xs font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;