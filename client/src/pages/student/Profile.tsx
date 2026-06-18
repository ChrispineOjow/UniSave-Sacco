import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added import
import { Loader2, Save, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import StudentLayout from '@/components/layout/StudentLayout';
import { createProfile, updateProfile } from '@/services/profile.service';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia',
    'Elgeyo Marakwet', 'Eldoret', 'Embu',
    'Garissa',
    'Homa Bay',
    'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kisii', 'Kisumu', 'Kitale', 'Kwale',
    'Laikipia', 'Lamu',
    'Machakos', 'Makueni', 'Malindi', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyandarua', 'Nyamira', 'Nyeri',
    'Samburu', 'Siaya',
    'Taita Taveta', 'Tana River', 'Trans Nzoia', 'Turkana',
    'Uasin Gishu',
    'Vihiga',
    'West Pokot'
];

const Profile = () => {
    const navigate = useNavigate(); // 2. Initialized navigation hook
    const { student, studentProfile, updateStudentProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        studentAuthId: student?.id || '',
        firstName: studentProfile?.firstName || '',
        lastName: studentProfile?.lastName || '',
        surName: studentProfile?.surName || '',
        gender: studentProfile?.gender || '',
        age: studentProfile?.age?.toString() || '',
        university: studentProfile?.university || '',
        course: studentProfile?.course || '',
        yearOfStudy: studentProfile?.yearOfStudy?.toString() || '',
        schoolRegistrationNumber: studentProfile?.schoolRegistrationNumber || '',
        gpa: studentProfile?.gpa?.toString() || '',
        county: studentProfile?.county || '',
        constituency: studentProfile?.constituency || '',
        disability: studentProfile?.disability ? 'true' : 'false',
        MTI_Score: studentProfile?.MTI_Score?.toString() || '',
        phoneNumber: studentProfile?.phoneNumber || ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelect = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData,
            gender: formData.gender as 'Male' | 'Female',  
            age: Number(formData.age),
            yearOfStudy: Number(formData.yearOfStudy),
            gpa: Number(formData.gpa),
            MTI_Score: Number(formData.MTI_Score),
            disability: formData.disability === 'true'
        };

        try {
            let data;
            if(studentProfile){
                // Update existing profile
                data = await updateProfile(payload);
                toast.success('Profile updated successfully');
            } else {
                // Create new profile
                data = await createProfile(payload);
                toast.success('Profile created successfully');
            }

            updateStudentProfile(data.profile || data.studentProfile);
            
            // 3. Kick off route redirection to student dashboard layout path
            navigate('/dashboard');

        } catch(error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to save profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StudentLayout>
            <div className="space-y-6 max-w-3xl">

                {/* Header  */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-primary">My Profile</h1>
                        <p className="text-muted-foreground text-sm">
                            {studentProfile
                                ? 'Update your academic details'
                                : 'Complete your profile to get matched scholarships'
                            }
                        </p>
                    </div>
                </div>

                {/* Profile Incomplete Banner */}
                {!studentProfile && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
                        Your profile is incomplete. Fill in your details below
                        to get matched to scholarships.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Personal Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base text-primary">
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>First Name</Label>
                                <Input
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Last Name</Label>
                                <Input
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Surname</Label>
                                <Input
                                    name="surName"
                                    placeholder="Surname"
                                    value={formData.surName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Age</Label>
                                <Input
                                    name="age"
                                    type="number"
                                    placeholder="Your age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={v => handleSelect('gender', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Phone Number</Label>
                                <Input
                                    name="phoneNumber"
                                    placeholder="+254..."
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Disability</Label>
                                <Select
                                    value={formData.disability}
                                    onValueChange={v => handleSelect('disability', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Do you have a disability?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="false">No</SelectItem>
                                        <SelectItem value="true">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Info   */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base text-primary">
                                Academic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>University</Label>
                                <Input
                                    name="university"
                                    placeholder="Your university"
                                    value={formData.university}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Course</Label>
                                <Input
                                    name="course"
                                    placeholder="Your course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Year of Study</Label>
                                <Select
                                    value={formData.yearOfStudy}
                                    onValueChange={v => handleSelect('yearOfStudy', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6].map(y => (
                                            <SelectItem key={y} value={y.toString()}>
                                                Year {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Registration Number</Label>
                                <Input
                                    name="schoolRegistrationNumber"
                                    placeholder="School reg number"
                                    value={formData.schoolRegistrationNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>GPA (0 - 4.0)</Label>
                                <Input
                                    name="gpa"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="4.0"
                                    placeholder="Your GPA"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>MTI Score</Label>
                                <Input
                                    name="MTI_Score"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Your MTI score"
                                    value={formData.MTI_Score}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location   */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base text-primary">
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>County</Label>
                                <Select
                                    value={formData.county}
                                    onValueChange={v => handleSelect('county', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select county" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kenyanCounties.map(c => (
                                            <SelectItem key={c} value={c}>
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Constituency (optional)</Label>
                                <Input
                                    name="constituency"
                                    placeholder="Your constituency"
                                    value={formData.constituency}
                                    onChange={handleChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit   */}
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-light text-white font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                            : <><Save className="w-4 h-4 mr-2" />
                                {studentProfile ? 'Update Profile' : 'Save Profile'}
                              </>
                        }
                    </Button>
                </form>
            </div>
        </StudentLayout>
    );
};

export default Profile;