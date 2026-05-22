import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Sparkles,
    ClipboardList,
    ArrowRight,
    Clock,
    CheckCircle,
    XCircle,
    BookmarkCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StudentLayout from '@/components/layout/StudentLayout';
import { getAllScholarships } from '@/services/scholarship.service';
import { getMyApplications } from '@/services/application.service';
import { useAuth } from '@/context/AuthContext';
import type { Scholarship, Application } from '@/types/index';

// ─── Status Config ──────────────────────────────────────────
const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    Saved:    { color: 'bg-blue-100 text-blue-700',   icon: <BookmarkCheck className="w-3 h-3" /> },
    Applied:  { color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" /> },
    Pending:  { color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-3 h-3" /> },
    Approved: { color: 'bg-green-100 text-green-700',  icon: <CheckCircle className="w-3 h-3" /> },
    Rejected: { color: 'bg-red-100 text-red-700',     icon: <XCircle className="w-3 h-3" /> }
};

const Dashboard = () => {
    const { studentProfile } = useAuth();
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scholarshipData, applicationData] = await Promise.all([
                    getAllScholarships(),
                    getMyApplications()
                ]);
                setScholarships(scholarshipData.scholarships);
                setApplications(applicationData.applications);
            } catch(error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const savedCount    = applications.filter(a => a.status === 'Saved').length;
    const appliedCount  = applications.filter(a => a.status === 'Applied').length;
    const approvedCount = applications.filter(a => a.status === 'Approved').length;

    // Scholarships with deadlines in next 7 days
    const urgent = scholarships.filter(s => {
        const deadline = new Date(s.dates.deadline);
        const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
    });

    return (
        <StudentLayout>
            <div className="space-y-6">

                {/* ── Profile Incomplete Warning ─────────────── */}
                {!studentProfile && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-amber-800">
                                Complete your profile
                            </p>
                            <p className="text-amber-700 text-sm">
                                Add your details to get matched to scholarships
                            </p>
                        </div>
                        <Link to="/profile">
                            <Button
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                            >
                                Complete Now
                            </Button>
                        </Link>
                    </div>
                )}

                {/* ── Stats Cards ────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Available',
                            value: scholarships.length,
                            icon: BookOpen,
                            color: 'text-secondary',
                            bg: 'bg-blue-50',
                            to: '/scholarships'
                        },
                        {
                            label: 'Saved',
                            value: savedCount,
                            icon: BookmarkCheck,
                            color: 'text-primary',
                            bg: 'bg-indigo-50',
                            to: '/applications'
                        },
                        {
                            label: 'Applied',
                            value: appliedCount,
                            icon: ClipboardList,
                            color: 'text-amber-600',
                            bg: 'bg-amber-50',
                            to: '/applications'
                        },
                        {
                            label: 'Approved',
                            value: approvedCount,
                            icon: CheckCircle,
                            color: 'text-green-600',
                            bg: 'bg-green-50',
                            to: '/applications'
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

                    {/* ── Urgent Deadlines ───────────────────── */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base font-semibold text-primary">
                                ⏰ Urgent Deadlines
                            </CardTitle>
                            <Link to="/scholarships">
                                <Button variant="ghost" size="sm" className="text-secondary text-xs">
                                    View All <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading && (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-14 bg-muted animate-pulse rounded" />
                                    ))}
                                </div>
                            )}
                            {!isLoading && urgent.length === 0 && (
                                <p className="text-muted-foreground text-sm text-center py-6">
                                    No urgent deadlines — you're on track! ✅
                                </p>
                            )}
                            {!isLoading && urgent.map(s => {
                                const daysLeft = Math.ceil(
                                    (new Date(s.dates.deadline).getTime() - Date.now())
                                    / (1000 * 60 * 60 * 24)
                                );
                                return (
                                    <div
                                        key={s._id}
                                        className="flex items-center justify-between py-3 border-b last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium text-sm text-primary">
                                                {s.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {s.provider}
                                            </p>
                                        </div>
                                        <Badge className="bg-red-100 text-red-700 text-xs">
                                            {daysLeft}d left
                                        </Badge>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* ── Recent Applications ────────────────── */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base font-semibold text-primary">
                                📋 Recent Applications
                            </CardTitle>
                            <Link to="/applications">
                                <Button variant="ghost" size="sm" className="text-secondary text-xs">
                                    View All <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading && (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-14 bg-muted animate-pulse rounded" />
                                    ))}
                                </div>
                            )}
                            {!isLoading && applications.length === 0 && (
                                <div className="text-center py-6">
                                    <p className="text-muted-foreground text-sm mb-3">
                                        No applications yet
                                    </p>
                                    <Link to="/scholarships">
                                        <Button size="sm" className="bg-primary text-white">
                                            Browse Scholarships
                                        </Button>
                                    </Link>
                                </div>
                            )}
                            {!isLoading && applications.slice(0, 4).map(app => {
                                const config = statusConfig[app.status];
                                const scholarship = app.scholarshipId as unknown as Scholarship;
                                return (
                                    <div
                                        key={app._id}
                                        className="flex items-center justify-between py-3 border-b last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium text-sm text-primary">
                                                {scholarship?.title || 'Scholarship'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {scholarship?.provider}
                                            </p>
                                        </div>
                                        <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
                                            {config.icon}
                                            {app.status}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Quick Actions ──────────────────────────── */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-primary">
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                {
                                    label: 'Browse Scholarships',
                                    to: '/scholarships',
                                    icon: BookOpen,
                                    color: 'bg-blue-50 text-secondary hover:bg-blue-100'
                                },
                                {
                                    label: 'View Matched',
                                    to: '/scholarships/matched',
                                    icon: Sparkles,
                                    color: 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                },
                                {
                                    label: 'Update Profile',
                                    to: '/profile',
                                    icon: BookmarkCheck,
                                    color: 'bg-green-50 text-green-700 hover:bg-green-100'
                                }
                            ].map(({ label, to, icon: Icon, color }) => (
                                <Link key={to} to={to}>
                                    <div className={`${color} rounded-lg p-4 flex items-center gap-3 transition-colors cursor-pointer`}>
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
};

export default Dashboard;