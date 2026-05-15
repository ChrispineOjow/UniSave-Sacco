import {studentMeetsGPARequirement} from '../utils/gpa.utils.js';

async function matchScholarships(student, scholarships){  

    const auth = await StudentAuth.findById(student.studentAuthId);

    if(auth.accountStatus !== 'approve'){
        throw new Error('Student account is not yet approved. Scholarship matching is only available for approved accounts')
    }
    return scholarships.filter(scholarship => { 
        const meetsGPA = studentMeetsGPARequirement(
            student.gpa,
            scholarship.eligibility.minGPA
        );

        return meetsGPA;
    })
}

export {matchScholarships};