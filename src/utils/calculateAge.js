export function calculateAge( data ) {
    let currentDate = new Date();
    let birthday = new Date(data);

    let age = currentDate.getTime() - birthday.getTime();
    // let ageType = 'days old';
    return Math.floor(age / (1000 * 60 * 60 * 24 ));

    // if( (ageDays / 7) > 12 && (ageDays / 365) < 1 ) {
    //     age = Math.floor(ageDays / 28);
    //     ageType = 'months old'
    // } else if ((ageDays / 365) > 1) {
    //     age = Math.floor(ageDays / 365);
    //     ageType = 'year(s) old'
    // } else {
    //     age = Math.floor(ageDays / 7 );
    //     ageType = 'weeks old'
    // }


    // return {
    //     ageDays,
    //     age,
    //     ageType
    // }
}