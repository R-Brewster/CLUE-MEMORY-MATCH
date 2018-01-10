function GameController () {
    //Figures out if the cards placed in the room match one of the generated crimes
    this.detectCrime = (roomIndex) => {
        //The matched objects from the gameView
        let matchedObjects = gameView.matchedObjects;

        //The object that contains the room the cards were dropped into (not set if the card was moved back to the holding area and the roomIndex is -1)
        // let possibleCrime = () => {
        //     if (roomIndex !== -1) {
        //         return matchedObjects[roomIndex]
        //     }
        //     else {
        //         return undefined
        //     }
        // };
        let possibleCrime = matchedObjects[roomIndex];



        console.log('possible crime', possibleCrime);

        //If the room has two cards that have been dropped into it, decide if they match the crime associated with that room
        if(possibleCrime.item1 && possibleCrime.item2 !== undefined ) {
           let crimeForThisRoom =  gameModel.crimes.find((crime) => {
               return (crime.room) === possibleCrime.room
           });
            // console.log( 'crime for this room', crimeForThisRoom);
            let isCrimeSolved = '';

            if(( (crimeForThisRoom.suspect === possibleCrime.item1 || crimeForThisRoom.suspect === possibleCrime.item2)) && ((crimeForThisRoom.weapon === possibleCrime.item1 || crimeForThisRoom.weapon === possibleCrime.item2))){
                isCrimeSolved = true;
                console.log('crime solved');
                gameView.flipCards(crimeForThisRoom.suspect , crimeForThisRoom.weapon, isCrimeSolved);
            }
            else {
                isCrimeSolved = false;
                gameView.flipCards(possibleCrime.item1 , possibleCrime.item2, isCrimeSolved);
            }
        }
    };
}

