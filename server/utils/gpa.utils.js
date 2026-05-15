const gpaRank = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'F': 1
};

function studentMeetsGPARequirement(studentGPA, requiredGPA){
    if(!requiredGPA) return true;
    return studentGPA >= requiredGPA;
}

export {gpaRank, studentMeetsGPARequirement};