import { useState, useEffect, type ReactNode } from 'react';
import {
    ClipboardList,
    BookmarkCheck,
    Clock,
    CheckCircle,
    XCircle,
    Trash2,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import StudentLayout from '@/components/layout/StudentLayout';
import {
    getMyApplications,
    updateApplicationStatus,
    deleteApplication
} from '@/services/application.service';
import type { Application, Scholarship } from '@/types/index';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { color: string; icon: ReactNode }> = {
    Saved:    { color: 'bg-blue-100 text-blue-700',    icon: <BookmarkCheck className="w-3 h-3" /> },
    Applied:  { color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" /> },
    Pending:  { color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-3 h-3" /> },
    Approved: { color: 'bg-green-100 text-green-700',  icon: <CheckCircle className="w-3 h-3" /> },
    Rejected: { color: 'bg-red-100 text-red-700',      icon: <XCircle className="w-3 h-3" /> }
};

const Applications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchApplications = async () => {
        try {
            const data = await getMyApplications();
            setApplications(data.applications);
        } catch(error) {
            toast.error('Failed to load applications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            await updateApplicationStatus(id, { status });
            toast.success('Status updated');
            fetchApplications();
        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteApplication(id);
            toast.success('Removed from saved list');
            fetchApplications();
        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to remove');
        } finally {
            setDeletingId(null);
        }
    };

    const filterByStatus = (status: string) =>
        status === 'all'
            ? applications
            : applications.filter(a => a.status === status);

    const ApplicationCard = ({ app }: { app: Application }) => {
        const scholarship = app.scholarshipId as unknown as Scholarship;
        const config = statusConfig[app.status];

        return (
            <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
                                    {config.icon}
                                    {app.status}
                                </Badge>
                                {scholarship?.category && (
                                    <Badge variant="outline" className="text-xs">
                                        {scholarship.category}
                                    </Badge>
                                )}
                            </div>

                            <h3 className="font-semibold text-primary truncate">
                                {scholarship?.title || 'Scholarship'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {scholarship?.provider}
                            </p>

                            {scholarship?.dates?.deadline && (
                                <p className="text-xs text-destructive mt-1">
                                    Deadline: {new Date(scholarship.dates.deadline).toDateString()}
                                </p>
                            )}

                            {app.notes && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                    Note: {app.notes}
                                </p>
                            )}

                            {app.appliedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Applied: {new Date(app.appliedAt).toDateString()}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 shrink-0">
                            {scholarship?.link && (
                                <a
                                    href={scholarship.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="sm" className="bg-primary text-white text-xs">
                                        Open <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </a>
                            )}

                            {/* Status Update */}
                            {app.status !== 'Approved' && app.status !== 'Rejected' && (
                                <Select
                                    onValueChange={v => handleStatusUpdate(app._id, v)}
                                    disabled={updatingId === app._id}
                                >
                                    <SelectTrigger className="h-8 text-xs w-28">
                                        {updatingId === app._id
                                            ? <Loader2 className="w-3 h-3 animate-spin" />
                                            : <SelectValue placeholder="Update" />
                                        }
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Applied">Mark Applied</SelectItem>
                                        <SelectItem value="Pending">Mark Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}

                            {/* Delete — only for Saved */}
                            {app.status === 'Saved' && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:bg-red-50 text-xs"
                                    onClick={() => handleDelete(app._id)}
                                    disabled={deletingId === app._id}
                                >
                                    {deletingId === app._id
                                        ? <Loader2 className="w-3 h-3 animate-spin" />
                                        : <><Trash2 className="w-3 h-3 mr-1" />Remove</>
                                    }
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <StudentLayout>
            <div className="space-y-6">

                
                <div>
                    <h1 className="text-2xl font-bold text-primary">My Applications</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track all your saved and applied scholarships
                    </p>
                </div>

                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(statusConfig).map(([status, config]) => (
                        <Card key={status}>
                            <CardContent className="p-3 text-center">
                                <Badge className={`${config.color} mb-1`}>
                                    {status}
                                </Badge>
                                <p className="text-xl font-bold text-primary">
                                    {applications.filter(a => a.status === status).length}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                
                <Tabs defaultValue="all">
                    <TabsList className="bg-muted">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="Saved">Saved</TabsTrigger>
                        <TabsTrigger value="Applied">Applied</TabsTrigger>
                        <TabsTrigger value="Pending">Pending</TabsTrigger>
                        <TabsTrigger value="Approved">Approved</TabsTrigger>
                    </TabsList>

                    {['all', 'Saved', 'Applied', 'Pending', 'Approved'].map(tab => (
                        <TabsContent key={tab} value={tab} className="mt-4">
                            {isLoading && (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div
                                            key={i}
                                            className="h-24 bg-muted animate-pulse rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}

                            {!isLoading && filterByStatus(tab).length === 0 && (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <ClipboardList className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                                        <p className="text-muted-foreground">
                                            No {tab === 'all' ? '' : tab.toLowerCase()} applications yet
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="space-y-3">
                                {!isLoading && filterByStatus(tab).map(app => (
                                    <ApplicationCard key={app._id} app={app} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </StudentLayout>
    );
};

export default Applications;