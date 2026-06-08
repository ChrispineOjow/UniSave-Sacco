import { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    ClipboardList,
    CheckCircle,
    Clock,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';
import { getAllStudents, getPendingStudents } from '@/services/admin.service';
import { getAllScholarshipsAdmin } from '@/services/scholarship.service';
import { getAllApplicationsAdmin } from '@/services/application.service';

interface StudentAuth {
    _id: string;
    email: string;
    nationalId: string;
    accountStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingStudents: 0,
        totalScholarships: 0,
        totalApplications: 0
    });
    const [pendingStudents, setPendingStudents] = useState<StudentAuth[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allStudents, pending, scholarships, applications] = await Promise.all([
                    getAllStudents(),
                    getPendingStudents(),
                    getAllScholarshipsAdmin(),
                    getAllApplicationsAdmin()
                ]);

                setStats({
                    totalStudents: allStudents.count,
                    pendingStudents: pending.count,
                    totalScholarships: scholarships.count,
                    totalApplications: applications.count
                });

                setPendingStudents(pending.students.slice(0, 5));

            } catch(error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-primary">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Overview of UniSave Sacco system
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Total Students',
                            value: stats.totalStudents,
                            icon: Users,
                            color: 'text-secondary',
                            bg: 'bg-blue-50',
                            to: '/admin/students'
                        },
                        {
                            label: 'Pending Approval',
                            value: stats.pendingStudents,
                            icon: Clock,
                            color: 'text-amber-600',
                            bg: 'bg-amber-50',
                            to: '/admin/students'
                        },
                        {
                            label: 'Scholarships',
                            value: stats.totalScholarships,
                            icon: BookOpen,
                            color: 'text-primary',
                            bg: 'bg-indigo-50',
                            to: '/admin/scholarships'
                        },
                        {
                            label: 'Applications',
                            value: stats.totalApplications,
                            icon: ClipboardList,
                            color: 'text-green-600',
                            bg: 'bg-green-50',
                            to: '/admin/students'
                        }
                    ].map(({ label, value, icon: Icon, color, bg, to }) => (
                        <Link to={to} key={label}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-5">
                                    <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                                        <Icon className={`w-5 h-5 ${color}`} />
                                    </div>
                                    {isLoading
                                        ? <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1" />
                                        : <p className="text-2xl font-bold text-primary">{value}</p>
                                    }
                                    <p className="text-muted-foreground text-sm">{label}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">

                    {/* Pending Students */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base font-semibold text-primary">
                                🕐 Pending Approvals
                            </CardTitle>
                            <Link to="/admin/students">
                                <Button variant="ghost" size="sm" className="text-secondary text-xs">
                                    View All <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading && (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                                    ))}
                                </div>
                            )}
                            {!isLoading && pendingStudents.length === 0 && (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-2" />
                                    <p className="text-muted-foreground text-sm">
                                        No pending approvals
                                    </p>
                                </div>
                            )}
                            {!isLoading && pendingStudents.map(student => (
                                <div
                                    key={student._id}
                                    className="flex items-center justify-between py-3 border-b last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-sm text-primary">
                                            {student.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            ID: {student.nationalId} • {new Date(student.createdAt).toDateString()}
                                        </p>
                                    </div>
                                    <Badge className="bg-amber-100 text-amber-700 text-xs">
                                        Pending
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-primary">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                {
                                    label: 'Review Pending Students',
                                    description: `${stats.pendingStudents} students waiting for approval`,
                                    to: '/admin/students',
                                    icon: Users,
                                    color: 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                },
                                {
                                    label: 'Add New Scholarship',
                                    description: 'Add a new scholarship to the platform',
                                    to: '/admin/scholarships',
                                    icon: BookOpen,
                                    color: 'bg-blue-50 text-secondary hover:bg-blue-100'
                                },
                                {
                                    label: 'View All Scholarships',
                                    description: `${stats.totalScholarships} scholarships listed`,
                                    to: '/admin/scholarships',
                                    icon: TrendingUp,
                                    color: 'bg-green-50 text-green-700 hover:bg-green-100'
                                }
                            ].map(({ label, description, to, icon: Icon, color }) => (
                                <Link key={label} to={to}>
                                    <div className={`${color} rounded-lg p-4 flex items-center gap-3 transition-colors cursor-pointer`}>
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm">{label}</p>
                                            <p className="text-xs opacity-70">{description}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto" />
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;