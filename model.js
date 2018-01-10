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
    this.randomizeCards = () => {
        while(this.arrayForCards.length > 0){
            let randomNumber = Math.floor(Math.random() * this.arrayForCards.length);
            this.randomizedCards.push(this.arrayForCards[randomNumber]);
            this.arrayForCards.splice(randomNumber, 1);
        }
    };

    this.randomizeCards();

    //Array to hold the crimes
    this.crimes = [];

    //Use a randomly generated number for each data type (suspect, weapon, or room) to select element for an object that holds one of each data type, representing a crime, which is then pushed to the crimes array
    this.makeCrimes = () => {
        while(this.roomsArray.length > 0) {
            let crime = {
                suspect: '',
                weapon: '',
                room: '',
            };
            let randomNumberForSuspect = Math.floor(Math.random() * this.suspectArray.length);
            crime.suspect =  this.suspectArray[randomNumberForSuspect];
            this.suspectArray.splice(randomNumberForSuspect, 1);

            let randomNumberForWeapon = Math.floor(Math.random() * this.weaponsArray.length);
            crime.weapon =  this.weaponsArray[randomNumberForWeapon];
            this.weaponsArray.splice(randomNumberForWeapon, 1);


            let randomNumberForRoom = Math.floor(Math.random() * this.roomsArray.length);
            crime.room =  this.roomsArray[randomNumberForRoom];
            this.roomsArray.splice(randomNumberForRoom, 1);

            this.crimes.push(crime);
        }
    };

    this.makeCrimes();

}

