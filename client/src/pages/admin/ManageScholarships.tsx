import { useState, useEffect } from 'react';
import {
    BookOpen,
    Plus,
    Trash2,
    CheckCircle,
    Search,
    Loader2,
    X,
    Edit,
    AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    getAllScholarshipsAdmin,
    addScholarship,
    updateScholarship,
    deleteScholarship,
    verifyScholarship,
} from '@/services/scholarship.service';
import type { Scholarship, ScholarshipUpdatePayload } from '@/types/index';
import toast from 'react-hot-toast';

const categoryColor: Record<string, string> = {
    Government: 'bg-blue-100 text-blue-700',
    Corporate:  'bg-purple-100 text-purple-700',
    County:     'bg-green-100 text-green-700',
    NGO:        'bg-orange-100 text-orange-700',
    University: 'bg-pink-100 text-pink-700'
};

// Scholarship Form (shared shape for both Add and Edit)
interface ScholarshipForm {
    title: string;
    provider: string;
    category: string;
    description: string;
    link: string;
    deadline: string;
    amount: string;
    amountDisplay: string;
    fundingType: string;
    method: string;
    source: string;
}

const defaultForm: ScholarshipForm = {
    title: '',
    provider: '',
    category: '',
    description: '',
    link: '',
    deadline: '',
    amount: '',
    amountDisplay: '',
    fundingType: '',
    method: 'Online',
    source: 'Manual'
};

const ManageScholarships = () => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Add dialog state
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [formData, setFormData] = useState<ScholarshipForm>(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit dialog state
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete / verify state
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const fetchScholarships = async () => {
        try {
            const data = await getAllScholarshipsAdmin();
            setScholarships(data.scholarships);
        } catch(error) {
            toast.error('Failed to load scholarships');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarships();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addScholarship({
                title: formData.title,
                provider: formData.provider,
                category: formData.category as Scholarship['category'],
                description: formData.description,
                link: formData.link,
                dates: {
                    deadline: formData.deadline
                },
                funding: {
                    amount: Number(formData.amount),
                    amountDisplay: formData.amountDisplay,
                    fundingType: formData.fundingType as Scholarship['funding']['fundingType'],
                    coversTuition: false,
                    coversUpkeep: false,
                    coversMaterials: false,
                    renewable: false
                },
                application: {
                    method: formData.method as 'Online' | 'Physical' | 'Both',
                    documentsRequired: [],
                    hasDirectApply: true
                },
                isVerified: false,
                isActive: true,
                isFeatured: false
            });

            toast.success('Scholarship added successfully');
            setShowAddDialog(false);
            setFormData(defaultForm);
            fetchScholarships();

        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to add scholarship');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditDialog = (s: Scholarship) => {
        setEditingScholarship(s);
        setFormData({
            title: s.title,
            provider: s.provider,
            category: s.category,
            description: s.description || '',
            link: s.link,
            // trim ISO date string down to YYYY-MM-DD for the <input type="date">
            deadline: s.dates.deadline ? String(s.dates.deadline).slice(0, 10) : '',
            amount: s.funding.amount?.toString() || '',
            amountDisplay: s.funding.amountDisplay || '',
            fundingType: s.funding.fundingType,
            method: s.application.method,
            source: s.source || 'Manual'
        });
        setShowEditDialog(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingScholarship) return;
        setIsUpdating(true);

        try {
            await updateScholarship(editingScholarship._id, {
                title: formData.title,
                provider: formData.provider,
                category: formData.category as Scholarship['category'],
                description: formData.description,
                link: formData.link,
                dates: {
                    deadline: formData.deadline
                },
                funding: {
                    amount: Number(formData.amount),
                    amountDisplay: formData.amountDisplay,
                    fundingType: formData.fundingType as Scholarship['funding']['fundingType']
                },
                application: {
                    method: formData.method as 'Online' | 'Physical' | 'Both'
                }
            });

            toast.success('Scholarship updated successfully');
            setShowEditDialog(false);
            setEditingScholarship(null);
            setFormData(defaultForm);
            fetchScholarships();

        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to update scholarship');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteScholarship(id);
            toast.success('Scholarship deleted');
            fetchScholarships();
        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const handleVerify = async (id: string) => {
        setVerifyingId(id);
        try {
            await verifyScholarship(id);
            toast.success('Scholarship verified');
            fetchScholarships();
        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to verify');
        } finally {
            setVerifyingId(null);
        }
    };

    const filtered = scholarships.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">
                            Manage Scholarships
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Add, verify and manage scholarships
                        </p>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary-light text-white gap-2"
                        onClick={() => setShowAddDialog(true)}
                    >
                        <Plus className="w-4 h-4" />
                        Add Scholarship
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        {
                            label: 'Total',
                            value: scholarships.length,
                            color: 'text-primary',
                            bg: 'bg-blue-50'
                        },
                        {
                            label: 'Verified',
                            value: scholarships.filter(s => s.isVerified).length,
                            color: 'text-green-600',
                            bg: 'bg-green-50'
                        },
                        {
                            label: 'Unverified',
                            value: scholarships.filter(s => !s.isVerified).length,
                            color: 'text-amber-600',
                            bg: 'bg-amber-50'
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

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search scholarships..."
                        className="pl-9"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Scholarship List */}
                {isLoading && (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                )}

                {!isLoading && filtered.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">No scholarships found</p>
                            <Button
                                className="mt-4 bg-primary text-white"
                                onClick={() => setShowAddDialog(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Scholarship
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-3">
                    {!isLoading && filtered.map(s => (
                        <Card key={s._id} className="hover:shadow-sm transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Badge className={categoryColor[s.category]}>
                                                {s.category}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {s.funding.fundingType}
                                            </Badge>
                                            {s.isVerified
                                                ? <Badge className="bg-green-100 text-green-700 text-xs">
                                                    ✓ Verified
                                                  </Badge>
                                                : <Badge className="bg-amber-100 text-amber-700 text-xs">
                                                    Unverified
                                                  </Badge>
                                            }
                                        </div>

                                        <h3 className="font-semibold text-primary truncate">
                                            {s.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {s.provider}
                                        </p>
                                        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                            <span>
                                                Amount: <span className="font-medium text-secondary">
                                                    {s.funding.amountDisplay || 'N/A'}
                                                </span>
                                            </span>
                                            <span>
                                                Deadline: <span className="font-medium text-destructive">
                                                    {new Date(s.dates.deadline).toDateString()}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 shrink-0">
                                        {!s.isVerified && (
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white gap-1"
                                                onClick={() => handleVerify(s._id)}
                                                disabled={verifyingId === s._id}
                                            >
                                                {verifyingId === s._id
                                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                                    : <><CheckCircle className="w-3 h-3" />Verify</>
                                                }
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-blue-300 text-blue-600 hover:bg-blue-50 gap-1"
                                            onClick={() => openEditDialog(s)}
                                        >
                                            <Edit className="w-3 h-3" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50 gap-1"
                                            onClick={() => setConfirmDeleteId(s._id)}
                                            disabled={deletingId === s._id}
                                        >
                                            {deletingId === s._id
                                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                                : <><Trash2 className="w-3 h-3" />Delete</>
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Add Scholarship Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-primary">
                            Add New Scholarship
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAdd} className="space-y-4">

                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Title *</Label>
                                <Input
                                    name="title"
                                    placeholder="Scholarship title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Provider *</Label>
                                <Input
                                    name="provider"
                                    placeholder="Provider name"
                                    value={formData.provider}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={v => handleSelectChange('category', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Government">Government</SelectItem>
                                        <SelectItem value="NGO">NGO</SelectItem>
                                        <SelectItem value="County">County</SelectItem>
                                        <SelectItem value="University">University</SelectItem>
                                        <SelectItem value="Corporate">Corporate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Funding Type *</Label>
                                <Select
                                    value={formData.fundingType}
                                    onValueChange={v => handleSelectChange('fundingType', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full">Full</SelectItem>
                                        <SelectItem value="Partial">Partial</SelectItem>
                                        <SelectItem value="Loan">Loan</SelectItem>
                                        <SelectItem value="Bursary">Bursary</SelectItem>
                                        <SelectItem value="Grant">Grant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Description</Label>
                            <Input
                                name="description"
                                placeholder="Brief description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Official Link *</Label>
                            <Input
                                name="link"
                                type="url"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Amount (KES)</Label>
                                <Input
                                    name="amount"
                                    type="number"
                                    placeholder="e.g. 60000"
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Amount Display</Label>
                                <Input
                                    name="amountDisplay"
                                    placeholder="e.g. Up to KES 60,000"
                                    value={formData.amountDisplay}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Deadline *</Label>
                                <Input
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Application Method</Label>
                                <Select
                                    value={formData.method}
                                    onValueChange={v => handleSelectChange('method', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Online">Online</SelectItem>
                                        <SelectItem value="Physical">Physical</SelectItem>
                                        <SelectItem value="Both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Source</Label>
                            <Select
                                value={formData.source}
                                onValueChange={v => handleSelectChange('source', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Manual">Manual</SelectItem>
                                    <SelectItem value="Scraped">Scraped</SelectItem>
                                    <SelectItem value="API">API</SelectItem>
                                    <SelectItem value="Self-Registered">Self-Registered</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAddDialog(false)}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary-light text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</>
                                    : <><Plus className="w-4 h-4 mr-2" />Add Scholarship</>
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Scholarship Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-primary">
                            Edit Scholarship
                        </DialogTitle>
                        <DialogDescription>
                            Update the details for this scholarship below
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4">

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Title *</Label>
                                <Input
                                    name="title"
                                    placeholder="Scholarship title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Provider *</Label>
                                <Input
                                    name="provider"
                                    placeholder="Provider name"
                                    value={formData.provider}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={v => handleSelectChange('category', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Government">Government</SelectItem>
                                        <SelectItem value="NGO">NGO</SelectItem>
                                        <SelectItem value="County">County</SelectItem>
                                        <SelectItem value="University">University</SelectItem>
                                        <SelectItem value="Corporate">Corporate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Funding Type *</Label>
                                <Select
                                    value={formData.fundingType}
                                    onValueChange={v => handleSelectChange('fundingType', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full">Full</SelectItem>
                                        <SelectItem value="Partial">Partial</SelectItem>
                                        <SelectItem value="Loan">Loan</SelectItem>
                                        <SelectItem value="Bursary">Bursary</SelectItem>
                                        <SelectItem value="Grant">Grant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Description</Label>
                            <Input
                                name="description"
                                placeholder="Brief description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Official Link *</Label>
                            <Input
                                name="link"
                                type="url"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Amount (KES)</Label>
                                <Input
                                    name="amount"
                                    type="number"
                                    placeholder="e.g. 60000"
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Amount Display</Label>
                                <Input
                                    name="amountDisplay"
                                    placeholder="e.g. Up to KES 60,000"
                                    value={formData.amountDisplay}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Deadline *</Label>
                                <Input
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Application Method</Label>
                                <Select
                                    value={formData.method}
                                    onValueChange={v => handleSelectChange('method', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Online">Online</SelectItem>
                                        <SelectItem value="Physical">Physical</SelectItem>
                                        <SelectItem value="Both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Source</Label>
                            <Select
                                value={formData.source}
                                onValueChange={v => handleSelectChange('source', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Manual">Manual</SelectItem>
                                    <SelectItem value="Scraped">Scraped</SelectItem>
                                    <SelectItem value="API">API</SelectItem>
                                    <SelectItem value="Self-Registered">Self-Registered</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowEditDialog(false);
                                    setEditingScholarship(null);
                                    setFormData(defaultForm);
                                }}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary-light text-white"
                                disabled={isUpdating}
                            >
                                {isUpdating
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</>
                                    : <><Edit className="w-4 h-4 mr-2" />Update Scholarship</>
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog
                open={!!confirmDeleteId}
                onOpenChange={(open) => !open && setConfirmDeleteId(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <DialogTitle>Delete Scholarship</DialogTitle>
                        </div>
                        <DialogDescription className="pt-2">
                            This will permanently remove this scholarship from the platform.
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={deletingId === confirmDeleteId}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white gap-1"
                            disabled={deletingId === confirmDeleteId}
                            onClick={async () => {
                                if (confirmDeleteId) {
                                    await handleDelete(confirmDeleteId);
                                    setConfirmDeleteId(null);
                                }
                            }}
                        >
                            {deletingId === confirmDeleteId
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Trash2 className="w-4 h-4" />
                            }
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ManageScholarships;