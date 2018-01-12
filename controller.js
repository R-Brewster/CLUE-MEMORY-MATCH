function GameController () {

    this.stats = {
        crimesSolved: 0,
        gamesPlayed: 0,
        attempts: 0,
        accuracy: 0,
    };

    //Calculates the player's statistics
    this.calculateStats = (registeredEvent) => {
        switch(registeredEvent){
            case 'crimeSolved':
                this.stats.crimesSolved++;
                this.stats.accuracy = (this.stats.crimesSolved / this.stats.attempts).toFixed(2);
                break;
            case 'matchAttempted':
                this.stats.attempts++;
                this.stats.accuracy = (this.stats.crimesSolved / this.stats.attempts).toFixed(2);
                break;
            default:
                return null;
        }
        console.log('current stats', this.stats);
        gameView.showStats(this.stats)
    };

    //Figures out if the cards placed in the room match one of the generated crimes
    this.detectCrime = (roomIndex) => {
        //Defines matched objects from the gameView and finds the room the cards were dropped into and the cards
        let matchedObjects = gameView.matchedObjects;
        let possibleCrime = matchedObjects[roomIndex];

        //Matches the room the cards were dropped into to the room in the generated crime list
        let crimeForThisRoom =  gameModel.crimes.find((crime) => {
           return (crime.room) === possibleCrime.room
        });

        let isCrimeSolved = '';

        //If the suspect, room, and item from the matchedObjects (from the gameView) are the same as those in the crime list, the crime has been solved and the view is notified that the crime is solved and the matching items passed in
        if(( (crimeForThisRoom.suspect === possibleCrime.item1 || crimeForThisRoom.suspect === possibleCrime.item2)) && ((crimeForThisRoom.weapon === possibleCrime.item1 || crimeForThisRoom.weapon === possibleCrime.item2))){
            isCrimeSolved = true;
            console.log('crime solved');
            gameView.flipCards(possibleCrime.item1 , possibleCrime.item2, isCrimeSolved);

            this.calculateStats('crimeSolved')
        }
        //If the crime is not solved, the view is still notified and the items are passed in
        else {
            isCrimeSolved = false;
            gameView.flipCards(possibleCrime.item1 , possibleCrime.item2, isCrimeSolved);

            this.calculateStats('matchAttempted')
        }
    };
}

