

export function calculateDueDate( type, date, age ) {
    const ageInWeek = parseInt(Math.floor(age / 7));
    let vaccineMessage = '';

    function afterInitialShot( vacDuration ) {
        const vaccinationDate = new Date(date);
        const currentDate = new Date();
        const durationDays = vacDuration[type] || 0;

        const nextDueDate = new Date(vaccinationDate.getTime() + durationDays * 24 * 60 * 60 * 1000);


        if( currentDate.getTime() < nextDueDate.getTime()) {
            vaccineMessage = `Due ${nextDueDate.toISOString().split('T')[0]}`;
        } else {
            vaccineMessage = `Expired. Due ${nextDueDate.toISOString().split('T')[0]}`;
        }
        
        return vaccineMessage;
    }

    if ( ageInWeek < 12  &&  !date ) {
        const vaccineDurations = {
            Rabies: 12, 
            Distemper: 8, 
            Parvovirus: 8,
            Hepatitis: 8, 
            Leptospirosis: 12, 
          };
          const difference = (vaccineDurations[type] - ageInWeek);
          const isOverDue = difference <= 0 ? `Time for first vaccine!` : `Required in ${difference} weeks`

        return vaccineMessage = isOverDue;
    }  
    else if( ageInWeek > 8 && ageInWeek < 52  && date) {
        const vaccineDurations = {
            Rabies: 365, 
            Distemper: 365, 
            Parvovirus: 365,
            Hepatitis: 365, 
            Leptospirosis: 28, 
          };

        afterInitialShot(vaccineDurations);
        return vaccineMessage;

    } else if( age > 365 && date) {
        const vaccineDurations = {
            Rabies: 365 * 3, 
            Distemper: 365 * 3, 
            Parvovirus: 365 * 3,
            Hepatitis: 365 * 3, 
            Leptospirosis: 365, 
          };

          afterInitialShot(vaccineDurations);
          return vaccineMessage;
    } else if ( age > 12 && !date) {
        return vaccineMessage = "No Info"
    } 
    else {
         return vaccineMessage = "Error. Please contact us"
    }
    
}
