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
            case 'newGameStarted':
                this.stats.crimesSolved = 0;
                this.stats.gamesPlayed++;
                this.stats.attempts = 0;
                this.stats.accuracy = 0.00;
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

    this.startNewGame = () => {
        let suspectArray = ['Mrs_White', 'Professor_Plum', 'Mrs_Peacock', 'Mr_Green', 'Miss_Scarlett', 'Colonel_Mustard'];
        let weaponsArray = ['Revolver', 'Candlestick', 'Knife', 'Lead_Pipe', 'Wrench', 'Rope'];
        let roomsArray = ['Billiard_Room', 'Kitchen', 'Conservatory', 'Ballroom', 'Dining_Room', 'Library'];
        let arrayForCards = ['Mrs_White', 'Professor_Plum', 'Mrs_Peacock', 'Mr_Green', 'Miss_Scarlett', 'Colonel_Mustard', 'Revolver', 'Candlestick', 'Knife', 'Lead_Pipe', 'Wrench', 'Rope'];

        gameView.displayLoadingScreen();

        $('.crime').remove();
        $('.room').remove();
        $('.card').remove();
        gameView.matchedObjects = [
            {room: 'Ballroom', item1: '', item2: ''},
            {room: 'Dining_Room', item1: '', item2: ''},
            {room: 'Library', item1: '', item2: ''},
            {room: 'Conservatory', item1: '', item2: ''},
            {room: 'Billiard_Room', item1: '', item2: ''},
            {room: 'Kitchen', item1: '', item2: ''},
        ];
        gameModel.crimes = [];
        gameModel.randomizedCards = [];

        gameModel.randomizeCards(arrayForCards);
        gameModel.makeCrimes(roomsArray, suspectArray, weaponsArray);
        gameView.displayCrimes(gameModel.crimes);
        gameView.makeCards(gameModel.randomizedCards);
        gameView.makeRooms(gameModel.crimes);
        this.calculateStats('newGameStarted');
    };
}

