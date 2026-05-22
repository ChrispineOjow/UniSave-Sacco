import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, BookmarkPlus, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import StudentLayout from '@/components/layout/StudentLayout';
import { getMatchedScholarships } from '@/services/scholarship.service';
import { saveScholarship } from '@/services/application.service';
import { useAuth } from '@/context/AuthContext';
import type { Scholarship } from '@/types/index';
import toast from 'react-hot-toast';

const categoryColor: Record<string, string> = {
    Government: 'bg-blue-100 text-blue-700',
    Corporate:  'bg-purple-100 text-purple-700',
    County:     'bg-green-100 text-green-700',
    NGO:        'bg-orange-100 text-orange-700',
    University: 'bg-pink-100 text-pink-700'
};

const MatchedScholarships = () => {
    const { studentProfile } = useAuth();
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatched = async () => {
            try {
                const data = await getMatchedScholarships();
                setScholarships(data.scholarships);
            } catch(error) {
                console.error('Error fetching matched scholarships:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if(studentProfile) fetchMatched();
        else setIsLoading(false);

    }, [studentProfile]);

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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-primary">
                            Matched For Me
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Scholarships matched to your profile
                        </p>
                    </div>
                </div>

                {/* ── No Profile Warning ─────────────────────── */}
                {!studentProfile && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold text-amber-800">
                                Profile incomplete
                            </p>
                            <p className="text-amber-700 text-sm mt-1">
                                Complete your profile so we can match you to
                                the right scholarships.
                            </p>
                            <Link to="/profile">
                                <Button
                                    size="sm"
                                    className="mt-3 bg-amber-500 hover:bg-amber-600 text-white"
                                >
                                    Complete Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── Match Stats ────────────────────────────── */}
                {!isLoading && studentProfile && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center gap-4">
                        <Sparkles className="w-8 h-8 text-purple-500 shrink-0" />
                        <div>
                            <p className="font-semibold text-purple-800">
                                {scholarships.length} scholarships matched to your profile
                            </p>
                            <p className="text-purple-600 text-sm">
                                Based on your MTI score, GPA, county, course and year of study
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Loading ────────────────────────────────── */}
                {isLoading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-5">
                                    <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                                    <div className="h-10 bg-muted rounded" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ── Empty ──────────────────────────────────── */}
                {!isLoading && studentProfile && scholarships.length === 0 && (
                    <div className="text-center py-16">
                        <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground font-medium">
                            No matches found yet
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            More scholarships are added regularly — check back soon
                        </p>
                        <Link to="/scholarships">
                            <Button variant="outline" className="mt-4">
                                Browse All Scholarships
                            </Button>
                        </Link>
                    </div>
                )}

                {/* ── Matched Cards ──────────────────────────── */}
                {!isLoading && scholarships.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scholarships.map(s => (
                            <Card
                                key={s._id}
                                className="hover:shadow-md transition-shadow border-purple-100"
                            >
                                <CardContent className="p-5">
                                    {/* Matched badge */}
                                    <div className="flex items-center gap-1 text-purple-600 text-xs font-semibold mb-3">
                                        <Sparkles className="w-3 h-3" />
                                        Matched for you
                                    </div>

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
                                                : <><BookmarkPlus className="w-4 h-4 mr-1" />Save</>
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

export default MatchedScholarships;