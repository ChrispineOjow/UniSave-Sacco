function getMTIBand(score) {
    if(score <= 25){
    return 'Vulnerable';
    } else if (score <= 50){
        return 'Needy';
    } else if (score <= 75){
        return 'Less Needy';
    } else {
        return 'Well-off';
    }
}

export {getMTIBand};