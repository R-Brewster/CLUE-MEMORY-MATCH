function GameModel(){
    //Array of suspects for creating crimes
    this.suspectArray = ['Mrs_White', 'Professor_Plum', 'Mrs_Peacock', 'Mr_Green', 'Miss_Scarlett', 'Colonel_Mustard'];

    //Array of weapons for creating crimes
    this.weaponsArray = ['Revolver', 'Candlestick', 'Knife', 'Lead_Pipe', 'Wrench', 'Rope'];

    //Array of rooms for creating crimes
    this.roomsArray = ['Billiard_Room', 'Kitchen', 'Conservatory', 'Ballroom', 'Dining_Room', 'Library'];

    //Array of objects with either a suspect or weapon, for randomizing cards
    this.arrayForCards = ['Mrs_White', 'Professor_Plum', 'Mrs_Peacock', 'Mr_Green', 'Miss_Scarlett', 'Colonel_Mustard', 'Revolver', 'Candlestick', 'Knife', 'Lead_Pipe', 'Wrench', 'Rope'];

    //Array of randomized cards used by the view to make the cards
    this.randomizedCards = [];

    //Uses a randomly generated number to chose an object from the arrayForCards, then pushes that object to the randomizedCards array
    this.randomizeCards = (arrayForCards) => {
        while(arrayForCards.length > 0){
            let randomNumber = Math.floor(Math.random() * arrayForCards.length);
            this.randomizedCards.push(arrayForCards[randomNumber]);
            arrayForCards.splice(randomNumber, 1);
        }
    };

    this.randomizeCards(this.arrayForCards);

    //Array to hold the crimes
    this.crimes = [];

    //Use a randomly generated number for each data type (suspect, weapon, or room) to select element for an object that holds one of each data type, representing a crime, which is then pushed to the crimes array
    this.makeCrimes = (roomsArray, suspectArray, weaponsArray) => {
        while(roomsArray.length > 0) {
            let crime = {
                suspect: '',
                weapon: '',
                room: '',
            };
            let randomNumberForSuspect = Math.floor(Math.random() * suspectArray.length);
            crime.suspect =  suspectArray[randomNumberForSuspect];
            suspectArray.splice(randomNumberForSuspect, 1);

            let randomNumberForWeapon = Math.floor(Math.random() * weaponsArray.length);
            crime.weapon =  weaponsArray[randomNumberForWeapon];
            weaponsArray.splice(randomNumberForWeapon, 1);


            let randomNumberForRoom = Math.floor(Math.random() * roomsArray.length);
            crime.room =  roomsArray[randomNumberForRoom];
            roomsArray.splice(randomNumberForRoom, 1);

            this.crimes.push(crime);
        }
    };

    this.makeCrimes(this.roomsArray, this.suspectArray, this.weaponsArray);

    this.crimesSolvedCounter = 0;

}
