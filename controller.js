function GameController () {
    //Figures out if the cards placed in the room match one of the generated crimes
    this.detectCrime = (roomIndex) => {
        //The matched objects from the gameView
        let matchedObjects = gameView.matchedObjects;

        //The object that contains the room the cards were dropped into
        let possibleCrime = matchedObjects[roomIndex];
        console.log('possible crime', possibleCrime);

        //If the room has two cards that have been dropped into it, decide if they match the crime associated with that room
        if(possibleCrime.item1 && possibleCrime.item2 !== undefined ) {
           let crimeForThisRoom =  gameModel.crimes.find((crime) => {
               return crime.room === possibleCrime.room
           });
            // console.log( 'crime for this room', crimeForThisRoom);

            if(( (crimeForThisRoom.suspect ===possibleCrime.item1 || crimeForThisRoom.suspect ===possibleCrime.item2)) && ((crimeForThisRoom.weapon === possibleCrime.item1 || crimeForThisRoom.weapon === possibleCrime.item2))){
                console.log('crime solved');
            }
        }
    };
}

