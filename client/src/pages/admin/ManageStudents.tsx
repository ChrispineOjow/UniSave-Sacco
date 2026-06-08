import { useState, useEffect } from 'react';
import {
    Users,
    CheckCircle,
    XCircle,
    Search,
    Loader2,
    Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    getAllStudents,
    getPendingStudents,
    approveStudent,
    rejectStudent
} from '@/services/admin.service';
import toast from 'react-hot-toast';

interface StudentAuth {
    _id: string;
    email: string;
    nationalId: string;
    accountStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

const statusConfig = {
    pending:  { color: 'bg-amber-100 text-amber-700',  label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-700',  label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-700',      label: 'Rejected' }
};

const ManageStudents = () => {
    const [students, setStudents] = useState<StudentAuth[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchStudents = async () => {
        try {
            const data = await getAllStudents();
            setStudents(data.students);
        } catch(error) {
            toast.error('Failed to load students');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleApprove = async (studentId: string) => {
        setApprovingId(studentId);
        try {
            await approveStudent(studentId);
            toast.success('Student approved successfully');
            fetchStudents();
        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to approve');
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async (studentId: string) => {
        setRejectingId(studentId);
        try {
            await rejectStudent(studentId);
            toast.success('Student rejected');
            fetchStudents();
        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to reject');
        } finally {
            setRejectingId(null);
        }
    };

    // Filter students
    const filtered = students.filter(s => {
        const matchesSearch =
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            s.nationalId.includes(search);
        const matchesStatus =
            statusFilter === 'all' || s.accountStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const StudentCard = ({ student }: { student: StudentAuth }) => {
        const config = statusConfig[student.accountStatus];
        return (
            <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${config.color} text-xs`}>
                                    {config.label}
                                </Badge>
                            </div>
                            <p className="font-semibold text-primary truncate">
                                {student.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                National ID: {student.nationalId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Registered: {new Date(student.createdAt).toDateString()}
                            </p>
                        </div>

                        {/* Actions */}
                        {student.accountStatus === 'pending' && (
                            <div className="flex gap-2 shrink-0">
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white gap-1"
                                    onClick={() => handleApprove(student._id)}
                                    disabled={approvingId === student._id}
                                >
                                    {approvingId === student._id
                                        ? <Loader2 className="w-3 h-3 animate-spin" />
                                        : <><CheckCircle className="w-3 h-3" />Approve</>
                                    }
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50 gap-1"
                                    onClick={() => handleReject(student._id)}
                                    disabled={rejectingId === student._id}
                                >
                                    {rejectingId === student._id
                                        ? <Loader2 className="w-3 h-3 animate-spin" />
                                        : <><XCircle className="w-3 h-3" />Reject</>
                                    }
                                </Button>
                            </div>
                        )}

                        {student.accountStatus === 'approved' && (
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        )}

                        {student.accountStatus === 'rejected' && (
                            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-primary">Manage Students</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Approve, reject and manage student accounts
                    </p>
                </div>

                {/*  Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        {
                            label: 'Total',
                            value: students.length,
                            color: 'text-primary',
                            bg: 'bg-blue-50'
                        },
                        {
                            label: 'Pending',
                            value: students.filter(s => s.accountStatus === 'pending').length,
                            color: 'text-amber-600',
                            bg: 'bg-amber-50'
                        },
                        {
                            label: 'Approved',
                            value: students.filter(s => s.accountStatus === 'approved').length,
                            color: 'text-green-600',
                            bg: 'bg-green-50'
                        }
                    ].map(({ label, value, color, bg }) => (
                        <Card key={label}>
                            <CardContent className={`p-4 ${bg} rounded-lg text-center`}>
                                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                                <p className="text-sm text-muted-foreground">{label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 bg-white border rounded-lg p-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by email or National ID..."
                            className="pl-9"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-full md:w-40">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/*  Tabs  */}
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">
                            All ({students.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending ({students.filter(s => s.accountStatus === 'pending').length})
                        </TabsTrigger>
                        <TabsTrigger value="approved">
                            Approved ({students.filter(s => s.accountStatus === 'approved').length})
                        </TabsTrigger>
                        <TabsTrigger value="rejected">
                            Rejected ({students.filter(s => s.accountStatus === 'rejected').length})
                        </TabsTrigger>
                    </TabsList>

                    {['all', 'pending', 'approved', 'rejected'].map(tab => (
                        <TabsContent key={tab} value={tab} className="mt-4">
                            {isLoading && (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                                    ))}
                                </div>
                            )}

                            {!isLoading && filtered.filter(s =>
                                tab === 'all' || s.accountStatus === tab
                            ).length === 0 && (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                                        <p className="text-muted-foreground">
                                            No {tab === 'all' ? '' : tab} students found
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="space-y-3">
                                {!isLoading && filtered
                                    .filter(s => tab === 'all' || s.accountStatus === tab)
                                    .map(student => (
                                        <StudentCard key={student._id} student={student} />
                                    ))
                                }
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default ManageStudents;