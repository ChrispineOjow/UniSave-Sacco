import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    LayoutDashboard,
    Users,
    BookOpen,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import type { ReactNode } from 'react';

const navItems = [
    { label: 'Dashboard',         to: '/admin/dashboard',    icon: LayoutDashboard },
    { label: 'Manage Students',   to: '/admin/students',     icon: Users },
    { label: 'Manage Scholarships', to: '/admin/scholarships', icon: BookOpen },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { admin, logoutAdmin } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logoutAdmin();
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-background flex">

            {/* Mobile Overlay*/}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/*Sidebar*/}
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

                {/* Admin Badge */}
                <div className="px-4 py-3 mx-4 mt-4 bg-accent/20 rounded-lg flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span className="text-accent text-sm font-semibold capitalize">
                        {admin?.role || 'Admin'} Panel
                    </span>
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

                {/* Admin Info + Logout */}
                <div className="px-4 py-5 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-accent text-primary font-bold text-sm">
                                {admin?.email[0].toUpperCase() || 'A'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                                {admin?.email}
                            </p>
                            <p className="text-white/50 text-xs capitalize">
                                {admin?.role}
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

            {/*  Main Content  */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top Bar */}
                <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-primary"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">Admin Dashboard</span>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-white text-xs font-bold">
                                {admin?.email[0].toUpperCase() || 'A'}
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

export default AdminLayout;