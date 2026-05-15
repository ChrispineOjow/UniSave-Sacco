const gpaRank = {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
};

function studentMeetsGPARequirement(studentGPA, requiredGPA){
    if(!requiredGPA) return true;
    return studentGPA >= requiredGPA;
}

export {gpaRank, studentMeetsGPARequirement};