import { Link } from 'react-router-dom';
import {
    GraduationCap,
    Search, 
    Bell,
    CheckCircle,
    ArrowRight,
    BookOpen,
    Users,
    Award,
    ChevronRight

}from 'lucide-react';
import {Button}from '@/components/ui/button';
import {Badge}from '@/components/ui/badge';
import {Card, CardContent}from '@/components/ui/card';
import {getAllScholarships} from '@/services/scholarship.service.ts';
import type{ Scholarship} from '@/types/index';
import {useEffect, useState} from 'react';

const categoryColor: Record<string, string> = {
    Government: 'bg-blue-100 text-blue-700',
    Corporate: 'bg-purple-100 text-purplee-700',
    County: 'bg-green-100 text-green-700',
    NGO: 'bg-orange-100 text-orange-700',
    University: 'bg-pink-100 text-pink-700'
};

const Landing = () => {
    const [featuredScholarships, setFeaturedScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await getAllScholarships();
                const scholarships = Array.isArray(data)
                    ? data
                    : data?.scholarships;

                if (!Array.isArray(scholarships)) {
                    console.error('Unexpected scholarships response:', data);
                    setFeaturedScholarships([]);
                } else {
                    setFeaturedScholarships(scholarships.slice(0, 3));
                }
            } catch(error) {
                console.error('Error fetching scholarships:', error);
                setFeaturedScholarships([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <div className="min-h-screen bg-background font-sans overflow-x-hidden">

            {/* Navbar  */}
            <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-7 h-7 text-accent" />
                    <span className="text-xl font-bold tracking-tight">
                        Uni<span className="text-accent">Save</span> Sacco
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/login">
                        <Button
                            variant="ghost"
                            className="text-white hover:text-accent hover:bg-primary-light"
                        >
                            Login
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button className="bg-accent text-primary font-semibold hover:bg-accent-dark">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section  */}
            <section className="bg-primary text-white py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">


                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                        Find Your Scholarship,{' '}
                        <span className="text-accent">Stay in School</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        UniSave Sacco brings together government, county, and private
                        scholarships in one place — matched to your profile so you
                        never miss an opportunity.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="bg-accent text-primary font-bold hover:bg-accent-dark px-8"
                            >
                                Find My Scholarships
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white bg-primary hover:bg-primary-light px-8"
                            >
                                Login to Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/70 text-sm">
                        {[
                            'Free to use',
                            'Verified scholarships',
                            'Deadline reminders',
                            'Matched to your profile'
                        ].map((text) => (
                            <span key={text} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-accent" />
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="bg-secondary py-16 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {[
                        { icon: Award,       value: '50+',      label: 'Scholarships Listed' },
                        { icon: Users,       value: '1,000+',   label: 'Students Registered' },
                        { icon: BookOpen,    value: 'KES 10M+', label: 'Funding Available' },
                        { icon: CheckCircle, value: '95%',      label: 'Application Success' }
                    ].map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <Icon className="w-8 h-8 text-accent" />
                            <span className="text-3xl font-bold">{value}</span>
                            <span className="text-white/80 text-sm">{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section  */}
            <section className="py-20 px-6 bg-background">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-primary mb-3">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Getting matched to scholarships takes less than 5 minutes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: Users,
                                title: 'Create Your Profile',
                                description: 'Register and fill in your academic details, MTI score, county, and course of study.'
                            },
                            {
                                step: '02',
                                icon: Search,
                                title: 'Get Matched',
                                description: 'Our system automatically matches you to scholarships you qualify for based on your profile.'
                            },
                            {
                                step: '03',
                                icon: Bell,
                                title: 'Apply & Track',
                                description: 'Apply directly through official portals and get email reminders before deadlines.'
                            }
                        ].map(({ step, icon: Icon, title, description }) => (
                            <div key={step} className="relative">
                                <div className="hidden md:block absolute top-8 left-[50%] w-full h-0.5 bg-accent/30" />
                                <Card className="relative z-10 border-none shadow-md hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Icon className="w-8 h-8 text-accent" />
                                        </div>
                                        <span className="text-accent font-bold text-sm">
                                            STEP {step}
                                        </span>
                                        <h3 className="text-lg font-bold text-primary mt-1 mb-2">
                                            {title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-snug">
                                            {description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Scholarships */}
            <section className="py-20 px-6 bg-muted/30">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-2">
                                Featured Scholarships
                            </h2>
                            <p className="text-muted-foreground">
                                A snapshot of opportunities available right now
                            </p>
                        </div>
                        <Link to="/register">
                            <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary hover:text-white"
                            >
                                View All
                                <ChevronRight className="ml-1 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
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

                    {/* No Scholarships */}
                    {!isLoading && featuredScholarships.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No scholarships available yet. Check back soon.</p>
                        </div>
                    )}

                    {/* Scholarship Cards */}
                    {!isLoading && featuredScholarships.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredScholarships.map((s) => (
                                <Card
                                    key={s._id}
                                    className="hover:shadow-lg transition-shadow border border-border"
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

                                        <h3 className="font-bold text-primary text-lg mb-1">
                                            {s.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            {s.provider}
                                        </p>

                                        <div className="space-y-2 text-sm">
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

                                        <Link to="/register" className="block mt-4">
                                            <Button className="w-full bg-primary hover:bg-primary-light text-white">
                                                Apply Now
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/*  Footer  */}
            <footer className="bg-primary text-white py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">

                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <GraduationCap className="w-6 h-6 text-accent" />
                                <span className="text-lg font-bold">
                                    Uni<span className="text-accent">Save</span> Sacco
                                </span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Helping Kenyan university students discover and
                                apply for scholarships to reduce dropout rates
                                caused by financial barriers.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-3 text-accent">Quick Links</h4>
                            <ul className="space-y-2 text-white/70 text-sm">
                                {[
                                    { label: 'Register', to: '/register' },
                                    { label: 'Login', to: '/login' },
                                    { label: 'Admin Portal', to: '/admin/login' }
                                ].map(({ label, to }) => (
                                    <li key={label}>
                                        <Link
                                            to={to}
                                            className="hover:text-accent transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold mb-3 text-accent">Contact</h4>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li>Unisave Sacco Kenya</li>
                                <li>support@unisave.co.ke</li>
                                <li>Nairobi, Kenya</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/20 pt-6 text-center text-white/50 text-sm">
                        © {new Date().getFullYear()} UniSave Sacco. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;