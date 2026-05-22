import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, BookmarkPlus, Loader2 } from 'lucide-react';
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
import StudentLayout from '@/components/layout/StudentLayout';
import { getAllScholarships } from '@/services/scholarship.service';
import { saveScholarship } from '@/services/application.service';
import type { Scholarship } from '@/types/index';
import toast from 'react-hot-toast';

const categoryColor: Record<string, string> = {
    Government: 'bg-blue-100 text-blue-700',
    Corporate:  'bg-purple-100 text-purple-700',
    County:     'bg-green-100 text-green-700',
    NGO:        'bg-orange-100 text-orange-700',
    University: 'bg-pink-100 text-pink-700'
};

const Scholarships = () => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        fundingType: ''
    });

    const fetchScholarships = async () => {
        setIsLoading(true);
        try {
            const data = await getAllScholarships({
                search: filters.search || undefined,
                category: filters.category || undefined,
                fundingType: filters.fundingType || undefined
            });
            setScholarships(data.scholarships);
        } catch(error) {
            toast.error('Failed to load scholarships');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarships();
    }, [filters.category, filters.fundingType]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchScholarships();
    };

    const handleSave = async (scholarshipId: string) => {
        setSavingId(scholarshipId);
        try {
            await saveScholarship(scholarshipId);
            toast.success('Scholarship saved!');
        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setSavingId(null);
        }
    };

    return (
        <StudentLayout>
            <div className="space-y-6">

                {/* ── Header ─────────────────────────────────── */}
                <div>
                    <h1 className="text-2xl font-bold text-primary">Scholarships</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Browse all available scholarships
                    </p>
                </div>

                {/* ── Filters ────────────────────────────────── */}
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row gap-3">

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search scholarships..."
                                    className="pl-9"
                                    value={filters.search}
                                    onChange={e => setFilters(prev => ({
                                        ...prev,
                                        search: e.target.value
                                    }))}
                                />
                            </div>
                            <Button type="submit" className="bg-primary text-white">
                                <Search className="w-4 h-4" />
                            </Button>
                        </form>

                        {/* Category Filter */}
                        <Select
                            value={filters.category}
                            onValueChange={v => setFilters(prev => ({
                                ...prev,
                                category: v === 'all' ? '' : v
                            }))}
                        >
                            <SelectTrigger className="w-full md:w-44">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Government">Government</SelectItem>
                                <SelectItem value="NGO">NGO</SelectItem>
                                <SelectItem value="County">County</SelectItem>
                                <SelectItem value="University">University</SelectItem>
                                <SelectItem value="Corporate">Corporate</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Funding Type Filter */}
                        <Select
                            value={filters.fundingType}
                            onValueChange={v => setFilters(prev => ({
                                ...prev,
                                fundingType: v === 'all' ? '' : v
                            }))}
                        >
                            <SelectTrigger className="w-full md:w-44">
                                <SelectValue placeholder="Funding Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Full">Full</SelectItem>
                                <SelectItem value="Partial">Partial</SelectItem>
                                <SelectItem value="Loan">Loan</SelectItem>
                                <SelectItem value="Bursary">Bursary</SelectItem>
                                <SelectItem value="Grant">Grant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ── Results Count ──────────────────────────── */}
                {!isLoading && (
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-primary">
                            {scholarships.length}
                        </span> scholarships
                    </p>
                )}

                {/* ── Loading ────────────────────────────────── */}
                {isLoading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-5">
                                    <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                                    <div className="h-10 bg-muted rounded w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ── Empty ──────────────────────────────────── */}
                {!isLoading && scholarships.length === 0 && (
                    <div className="text-center py-16">
                        <Search className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">
                            No scholarships found matching your filters
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setFilters({ search: '', category: '', fundingType: '' })}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* ── Scholarship Cards ──────────────────────── */}
                {!isLoading && scholarships.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scholarships.map(s => (
                            <Card
                                key={s._id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge className={categoryColor[s.category]}>
                                            {s.category}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {s.funding.fundingType}
                                        </Badge>
                                    </div>

                                    <h3 className="font-bold text-primary mb-1 line-clamp-2">
                                        {s.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-3">
                                        {s.provider}
                                    </p>

                                    {s.description && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {s.description}
                                        </p>
                                    )}

                                    <div className="space-y-1.5 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Amount</span>
                                            <span className="font-semibold text-secondary">
                                                {s.funding.amountDisplay || 'See link'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Deadline</span>
                                            <span className="font-semibold text-destructive">
                                                {new Date(s.dates.deadline).toDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Method</span>
                                            <span className="font-medium">
                                                {s.application.method}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                                            onClick={() => handleSave(s._id)}
                                            disabled={savingId === s._id}
                                        >
                                            {savingId === s._id
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <><BookmarkPlus className="w-4 h-4 mr-1" /> Save</>
                                            }
                                        </Button>
                                        <a
                                            href={s.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button
                                                size="sm"
                                                className="w-full bg-primary hover:bg-primary-light text-white"
                                            >
                                                Apply <ArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default Scholarships;