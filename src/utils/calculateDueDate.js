// import { useUserStore } from "../stores/userStore";


export function calculateDueDate( vaccine, age ) {
    const { type, date } = vaccine;
    const ageInWeek = parseInt(Math.floor(age / 7));
    let vaccineMessage = '';


    function afterInitialShot( vacDuration ) {
        console.log(type);
        console.log(date);
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
          console.log('test');

        return vaccineMessage = 'Required in ' + (vaccineDurations[type] - ageInWeek) + ' weeks';
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
    } if ( age > 12 && !date) {
        return vaccineMessage = "No Info"
    }
    






    // if( ageInWeek > 52 ) {
    //     const vaccineDurations = {
    //         Rabies: 3 * 365, // 3 years (in days)
    //         Distemper: 3 * 365, // 3 years
    //         Parvovirus: 3 * 365, // 3 years
    //         Hepatitis: 3 * 365, // 3 years
    //         Leptospirosis: 365, // 1 year
    //       };
        
    //        
            // if( date !== '') {
            //     // Parse the date and calculate the next due date
            //     const vaccinationDate = new Date(date);
            //     const durationDays = vaccineDurations[type.toLowerCase()] || 0;
    
            //     if (!durationDays) {
            //         return rabies = `Unknown vaccine type: ${type}`;
            //     }
    
            //     const nextDueDate = new Date(vaccinationDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    
            //     // Format the next due date as a readable string
            //     vaccineMessage[type] = `Due on ${nextDueDate.toISOString().split('T')[0]}`;
            // } 
            // // else {
            // //     vaccineMessage[type] = 'need vaccine info'
            // //     }
            //  }


}
