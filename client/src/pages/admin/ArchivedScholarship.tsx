import { useState, useEffect } from 'react';
import {
    BookOpen,
    Trash2,
    Search,
    Loader2,
    X,
    RefreshCw,
    Calendar,
    AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    updateScholarship,
    deleteScholarship,
    getArchivedScholarships
   
} from '@/services/scholarship.service';
import {  getAllScholarshipsAdmin} from '@/services/admin.service';
import type { Scholarship } from '@/types/index';
import toast from 'react-hot-toast';

const categoryColor: Record<string, string> = {
    Government: 'bg-blue-100 text-blue-700 opacity-75',
    Corporate:  'bg-purple-100 text-purple-700 opacity-75',
    County:     'bg-green-100 text-green-700 opacity-75',
    NGO:        'bg-orange-100 text-orange-700 opacity-75',
    University: 'bg-pink-100 text-pink-700 opacity-75'
};

const ArchiveScholarships = () => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Renewal Dialog State
    const [showRenewDialog, setShowRenewDialog] = useState(false);
    const [renewingScholarship, setRenewingScholarship] = useState<Scholarship | null>(null);
    const [newDeadline, setNewDeadline] = useState('');
    const [isRenewing, setIsRenewing] = useState(false);

    // Hard Delete Confirmation State
    const [confirmDeleteScholarship, setConfirmDeleteScholarship] = useState<Scholarship | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchArchivedScholarships = async () => {
        try {
            const data = await getArchivedScholarships();
            setScholarships(data.scholarships || data);
        } catch (error) {
            toast.error('Failed to load archived scholarships');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArchivedScholarships();
    }, []);

    const openRenewDialog = (s: Scholarship) => {
        setRenewingScholarship(s);
        // Pre-fill with existing deadline baseline formatted safely for HTML5 inputs
        setNewDeadline(s.dates.deadline ? String(s.dates.deadline).slice(0, 10) : '');
        setShowRenewDialog(true);
    };

    const handleRenewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renewingScholarship) return;
        setIsRenewing(true);

        try {
            // Restore visibility by advancing the cycle deadline and setting isActive back to true
            await updateScholarship(renewingScholarship._id, {
                dates: {
                    deadline: newDeadline
                },
                isActive: true,
                isArchived: false
            } as any);

            toast.success('Scholarship successfully renewed and moved back to Active listings');
            setShowRenewDialog(false);
            setRenewingScholarship(null);
            fetchArchivedScholarships();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to renew scholarship');
        } finally {
            setIsRenewing(false);
        }
    };

    const handleHardDelete = async () => {
        if (!confirmDeleteScholarship) return;
        setIsDeleting(true);

        try {
            await deleteScholarship(confirmDeleteScholarship._id);
            toast.success('Scholarship permanently deleted from database');
            setConfirmDeleteScholarship(null);
            fetchArchivedScholarships();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to permanently delete records');
        } finally {
            setIsDeleting(false);
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
                <div>
                    <h1 className="text-2xl font-bold text-primary">Archived Scholarships</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Review expired or inactive programs. You can roll over programs to a new operational cycle or hard delete them.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search archives by title or provider..."
                        className="pl-9"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Content Loader States */}
                {isLoading && (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                )}

                {!isLoading && filtered.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">No archived listings matches your criteria.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Main Component Card Mapping */}
                <div className="space-y-3">
                    {!isLoading && filtered.map(s => (
                        <Card key={s._id} className="bg-muted/40 hover:shadow-sm transition-shadow opacity-90 border-muted">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Badge className={categoryColor[s.category] || 'bg-gray-100'}>
                                                {s.category}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {s.funding.fundingType}
                                            </Badge>
                                            <Badge variant="outline" className="text-muted-foreground bg-white text-xs">
                                                Status: Inactive / Expired
                                            </Badge>
                                        </div>

                                        <h3 className="font-semibold text-primary/80 truncate">
                                            {s.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {s.provider}
                                        </p>
                                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                            <span>
                                                Last Known Value: <span className="font-medium text-primary/70">{s.funding.amountDisplay || 'N/A'}</span>
                                            </span>
                                            <span>
                                                Passed Deadline: <span className="font-medium text-destructive/80">
                                                {s.dates?.deadline ? new Date(s.dates.deadline).toDateString() : 'Expired'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Operations Tool Matrix */}
                                    <div className="flex gap-2 shrink-0 self-center">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                                            onClick={() => openRenewDialog(s)}
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            Renew / Rollover
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-1.5"
                                            onClick={() => setConfirmDeleteScholarship(s)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Hard Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Rollover Lifecycle/Renewal Modal Dialog */}
            <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary">
                            <Calendar className="w-5 h-5 text-green-600" />
                            Renew Scholarship Cycle
                        </DialogTitle>
                        <DialogDescription>
                            You are pushing this scholarship back to production visibility. Simply assign the updated application deadline date for this upcoming funding intake cycle.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleRenewSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="newDeadline">New Application Deadline *</Label>
                            <Input
                                id="newDeadline"
                                type="date"
                                value={newDeadline}
                                onChange={e => setNewDeadline(e.target.value)}
                                required
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setShowRenewDialog(false); setRenewingScholarship(null); }}
                            >
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={isRenewing}
                            >
                                {isRenewing ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                                ) : (
                                    <><RefreshCw className="w-4 h-4 mr-2" /> Republish Live</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Permanent Database Wipe Dialog */}
            <Dialog open={confirmDeleteScholarship !== null} onOpenChange={(open) => !open && setConfirmDeleteScholarship(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            Permanent Record Removal
                        </DialogTitle>
                        <DialogDescription>
                            Are you absolutely certain? This performs a hard delete from the server. This action operation completely breaks historical records for tracking allocations and cannot be rolled back.
                        </DialogDescription>
                    </DialogHeader>

                    {confirmDeleteScholarship && (
                        <div className="p-3 bg-muted rounded-lg text-sm border">
                            <p className="font-semibold text-primary">{confirmDeleteScholarship.title}</p>
                            <p className="text-muted-foreground text-xs mt-0.5">{confirmDeleteScholarship.provider}</p>
                        </div>
                    )}

                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmDeleteScholarship(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleHardDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Purging records...</>
                            ) : (
                                'Yes, Hard Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ArchiveScholarships;