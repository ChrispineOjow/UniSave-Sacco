import { useState, useEffect } from 'react';
import {
    Users,
    CheckCircle,
    XCircle,
    Search,
    Loader2,
    Filter,
    GraduationCap,
    MapPin,
    Phone,
    Calendar,
    Award,
    Trash2,
    AlertTriangle
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    getAllStudents,
    getPendingStudents,
    approveStudent,
    rejectStudent,
    getStudentProfile,
    deleteStudent
} from '@/services/admin.service';
import type { StudentProfile } from '@/types/index';
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

const mtiBandColor: Record<string, string> = {
    'Vulnerable':       'bg-red-100 text-red-700',
    'Extremely Needy':  'bg-orange-100 text-orange-700',
    'Needy':            'bg-amber-100 text-amber-700',
    'Less Needy':       'bg-green-100 text-green-700'
};

const ManageStudents = () => {
    const [students, setStudents] = useState<StudentAuth[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Profile detail dialog state
    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentAuth | null>(null);
    const [profileData, setProfileData] = useState<StudentProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Delete student state
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteStudent, setConfirmDeleteStudent] = useState<StudentAuth | null>(null);

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

    const openProfileDialog = async (student: StudentAuth) => {
        setSelectedStudent(student);
        setShowProfileDialog(true);
        setProfileData(null);
        setProfileError(null);
        setIsLoadingProfile(true);

        try {
            const data = await getStudentProfile(student._id);
            setProfileData(data.profile);
        } catch (error: unknown) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            if (err.response?.status === 404) {
                setProfileError('This student has not completed their profile yet.');
            } else {
                setProfileError(err.response?.data?.message || 'Failed to load profile.');
            }
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        setDeletingId(studentId);
        try {
            await deleteStudent(studentId);
            toast.success('Student deleted successfully');
            setConfirmDeleteStudent(null);
            // Close profile dialog too, in case delete was triggered from there
            if (selectedStudent?._id === studentId) {
                setShowProfileDialog(false);
            }
            fetchStudents();
        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to delete student');
        } finally {
            setDeletingId(null);
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
            <Card
                className="hover:shadow-sm hover:border-secondary/40 transition-all cursor-pointer"
                onClick={() => openProfileDialog(student)}
            >
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
                        <div
                            className="flex gap-2 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {student.accountStatus === 'pending' && (
                                <>
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
                                </>
                            )}

                            {student.accountStatus === 'approved' && (
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 self-center" />
                            )}

                            {student.accountStatus === 'rejected' && (
                                <XCircle className="w-5 h-5 text-red-500 shrink-0 self-center" />
                            )}

                            <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 gap-1"
                                onClick={() => setConfirmDeleteStudent(student)}
                                disabled={deletingId === student._id}
                            >
                                {deletingId === student._id
                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                    : <Trash2 className="w-3 h-3" />
                                }
                            </Button>
                        </div>
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

            {/* Student Profile Detail Dialog */}
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-primary">
                            Student Profile
                        </DialogTitle>
                        <DialogDescription>
                            {selectedStudent?.email}
                        </DialogDescription>
                    </DialogHeader>

                    {isLoadingProfile && (
                        <div className="py-12 flex flex-col items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                            <p className="text-sm text-muted-foreground">Loading profile...</p>
                        </div>
                    )}

                    {!isLoadingProfile && profileError && (
                        <div className="py-12 text-center">
                            <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground text-sm">{profileError}</p>
                        </div>
                    )}

                    {!isLoadingProfile && !profileError && profileData && (
                        <div className="space-y-5">

                            {/* Identity */}
                            <div className="flex items-center gap-3 pb-4 border-b">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                    {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-primary">
                                        {profileData.firstName} {profileData.lastName} {profileData.surName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {profileData.gender} • Age {profileData.age}
                                        {profileData.disability && ' • Registered disability'}
                                    </p>
                                </div>
                            </div>

                            {/* MTI Band */}
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">MTI Score:</span>
                                <span className="font-medium text-primary">{profileData.MTI_Score}</span>
                                <Badge className={`${mtiBandColor[profileData.MTI_Band] || 'bg-gray-100 text-gray-700'} text-xs`}>
                                    {profileData.MTI_Band}
                                </Badge>
                            </div>

                            {/* Academic */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                    Academic
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <GraduationCap className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-primary font-medium">{profileData.university}</p>
                                            <p className="text-muted-foreground text-xs">{profileData.course}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">Year of Study</p>
                                        <p className="text-primary font-medium">Year {profileData.yearOfStudy}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">GPA</p>
                                        <p className="text-primary font-medium">{profileData.gpa?.toFixed(2)} / 4.0</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">Registration No.</p>
                                        <p className="text-primary font-medium">{profileData.schoolRegistrationNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location & Contact */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                    Location & Contact
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-primary font-medium">{profileData.county}</p>
                                            {profileData.constituency && (
                                                <p className="text-muted-foreground text-xs">{profileData.constituency}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <p className="text-primary font-medium">{profileData.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* National ID */}
                            <div className="flex items-center gap-2 text-sm pt-2 border-t">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">National ID:</span>
                                <span className="font-medium text-primary">{profileData.nationalId}</span>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50 gap-1"
                                    onClick={() => selectedStudent && setConfirmDeleteStudent(selectedStudent)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Delete Student
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Student Dialog */}
            <Dialog
                open={!!confirmDeleteStudent}
                onOpenChange={(open) => !open && setConfirmDeleteStudent(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <DialogTitle>Delete Student</DialogTitle>
                        </div>
                        <DialogDescription className="pt-2">
                            This will permanently delete {confirmDeleteStudent?.email}'s account,
                            profile, and all submitted applications. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteStudent(null)}
                            disabled={deletingId === confirmDeleteStudent?._id}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white gap-1"
                            disabled={deletingId === confirmDeleteStudent?._id}
                            onClick={() => confirmDeleteStudent && handleDeleteStudent(confirmDeleteStudent._id)}
                        >
                            {deletingId === confirmDeleteStudent?._id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Trash2 className="w-4 h-4" />
                            }
                            Delete Permanently
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ManageStudents;