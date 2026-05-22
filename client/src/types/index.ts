export interface StudentAuth{
    id:string;
    email:string;
    nationalId:string;
    accountStatus: 'pending' | 'approved' |'rejected';

}

export interface StudentProfile{

    _id:string;
    studentAuthId:string;
    nationalId:string;
    firstName:string;
    lastName:string;
    surName:string;
    gender: 'Male' | 'Female';
    disability:boolean;
    age:number;
    email:string;
    university:string;
    course:string;
    schoolRegistrationNumber: string;
    gpa:number;
    county:string;
    constituency:string;
    MTI_Score:number;
    yearOfStudy:number;
    MTI_Band: 'Vulnerable' | 'Extremely Needy' | 'Needy' | 'Less Needy';
    phoneNumber: string;

}

export interface Scholarship {
    _id: string;
    title: string;
    provider: string;
    category: 'Government' | 'NGO' | 'County' | 'University' | 'Corporate';
    description: string;
    link: string;
    logoUrl?: string;
    eligibility: {
        mtiBand: string;
        mtiScoreMin: number;
        mtiScoreMax: number;
        minGPA: number | null;
        yearOfStudy: number[];
        courseOfStudy: string[];
        university: string[];
        county: string;
        gender: string;
        ageMin: number;
        ageMax: number;
        disability: boolean | null;
    };
    funding: {
        amount: number;
        amountDisplay: string;
        coversTuition: boolean;
        coversUpkeep: boolean;
        coversMaterials: boolean;
        fundingType: 'Full' | 'Partial' | 'Loan' | 'Bursary' | 'Grant';
        renewable: boolean;
    };
    dates: {
        openingDate?: string;
        deadline: string;
        announcementDate?: string;
        academicYear?: string;
    };
    application: {
        method: 'Online' | 'Physical' | 'Both';
        documentsRequired: string[];
        hasDirectApply: boolean;
        applicationSteps?: string;
    };
    isVerified: boolean;
    isActive: boolean;
    isFeatured: boolean;
}

export interface Application{
    _id:string;
    studentId:string;
    scholarshipId:Scholarship;
    status: 'Saved' | 'Applied' | 'Pending' | 'Approved' | 'Rejected';
    appliedAt: string | null;
    notes?: string;
    createdAt: string;
}

export interface Admin{
    id:string;
    email:string;
    role:'superadmin' | 'moderator';
}

export interface AuthResponse{
    message:string;
    token:string;
    student?:{
        id:string;
        email:string;
        accountStatus:string;
        hasProfile:boolean;
        profile: StudentProfile | null;
    };
    admin?:Admin;
}