function getMTIBand(score) {
    if(score <= 25){
    return 'Vulnerable';
    } else if (score <= 50){
        return 'Extremely Needy';
    } else if (score <= 75){
        return 'Needy';
    } else {
        return 'Less Needy';
    }
}

export {getMTIBand};