function GameController () {
    this.detectCrime = (roomIndex) => {
        let matchedObjects = gameView.matchedObjects;

        let possibleCrime = matchedObjects[roomIndex];
        console.log('possible crime', possibleCrime);

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

