function GameView() {
    this.rooms = gameModel.roomsArray;
    this.randomizedCards = gameModel.randomizedCards;
    this.crimes = gameModel.crimes;

    this.displayCrimes = (crimes) =>{
        for(let i=0; i<6; i++){
            let roomWithoutUnderscore = (crimes[i].room).replace('_', ' ');
            let suspectWithoutUnderscore = (crimes[i].suspect).replace('_', ' ');
            let weaponWithoutUnderscore = (crimes[i].weapon).replace('_', ' ');

            let crimeTitle = $('<p>').text(`Crime ${i+1}: `).addClass('crimeTitle');
            let crimeRoom = $('<p>').text(roomWithoutUnderscore).addClass('crimeItem');
            let crimeSuspect = $('<p>').text(suspectWithoutUnderscore).addClass('crimeItem');
            let crimeWeapon = $('<p>').text(weaponWithoutUnderscore).addClass('crimeItem');

            let crime = $('<div>').addClass('crime').append(crimeTitle, crimeRoom, crimeSuspect, crimeWeapon);

            $('#crimes_container').append(crime);
        }
    };

    this.displayCrimes(this.crimes);

    //Create the cards and append them to the card container
    this.makeCards =  (randomizedCards) => {
        for(let i=0; i<12; i++){
            let card = $('<div>').text(randomizedCards[i]).addClass('card').attr({
                id: randomizedCards[i],
                draggable: 'true',
                ondragstart: 'gameView.drag(event)'
            });

            let cardBack = $('<div>').addClass('cardBack');

            let cardFront = $('<div>').addClass('cardFront').css({
                backgroundImage: `url(images/${randomizedCards[i]}.png)`,
                // display: 'none',
            });

            $('#card_container').append(card);

            $(`#${randomizedCards[i]}`).append(cardBack, cardFront);
        }

    };

    this.makeCards(this.randomizedCards);

    //Create the rooms and append them to the room container
    this.makeRooms = (crimes) => {
        for(let i=0; i<6; i++){
            let room = $('<div>').addClass('room').css('background-image', `url(images/${crimes[i].room}.png`).attr({
                id: crimes[i].room,
                ondrop: 'gameView.drop(event)',
                ondragover: 'gameView.allowDrop(event)',
            });

            $('#rooms_container').append(room);
        }
    };

    this.makeRooms(this.crimes);

    //Prevents the default handling of the element as a link (https://www.w3schools.com/html/html5_draganddrop.asp)
    this.allowDrop = (ev) => {
        ev.preventDefault();
    };

    //Sets the data type and value
    //Switched to core JS since it seems easier to use for the parentElement and childElementCount properties
    this.drag = (ev) => {
        if(ev.target.id !== ""){
            ev.dataTransfer.setData("text", ev.target.id);

            //If the parent element has two children, allow ondrop events again (this card is being removed from this room, so more cards should be allowed in)
            if(document.getElementById(ev.target.id).parentElement.childElementCount === 2) {
                document.getElementById(ev.target.id).parentElement.setAttribute('ondrop', 'gameView.drop(event)')
            }

            //If the card is being removed from a room, we'll need to know if it's an item1 or item2
            let item1OrItem2 = '';

            //If the card being dragged was already put in another room, find the index of that card in the matched objects array and record if that card is an item1 or item2
            let cardIndexBeingRemovedFromRoom = this.matchedObjects.findIndex((possibleCrime) => {
                if(possibleCrime.item1 === ev.target.id){
                    item1OrItem2 = 'item1';
                    return possibleCrime.item1
                }
                else if(possibleCrime.item2 === ev.target.id){
                    item1OrItem2 = 'item2';
                    return possibleCrime.item2
                }

            });

            console.log('card being removed', cardIndexBeingRemovedFromRoom);

            //If the card was an item1, remove the item1 from from the right object in this.matchedObjects, and if item2, do the same thing
            switch(item1OrItem2){
                case 'item1':
                    this.matchedObjects[cardIndexBeingRemovedFromRoom].item1 = '';
                    break;
                case 'item2':
                    this.matchedObjects[cardIndexBeingRemovedFromRoom].item2 = '';
                    break;
                default:
                    return null;
            }
        }
    };

    //Declares the data being moved and appends it to the element that it's being dropped on, then uses the information from the dropped element and its new parent to create a matchedObjects array for the model

    this.drop = (ev) =>{
        //Prevents error resulting from this being read before a drag and drop event has happened
        if(ev.dataTransfer !== undefined) {
            ev.preventDefault();
            let data = ev.dataTransfer.getData("text");

            //If the div the card will be dropped into is a room, append the card to that div then add a class to fit in the room
            if(ev.target.className === "room"){
                ev.target.appendChild(document.getElementById(data));

                //If this card is the only child of the room div, give it droppedCard1
                if(document.getElementById(data).previousSibling === null){
                    document.getElementById(data).classList.add('droppedCard1');
                }
                //If another sibling is present, we first need to figure out which droppedCard class it has then give this card the other droppedCard class
                else {
                    let siblingDroppedCardClass = document.getElementById(data).previousSibling.classList[1];

                    switch(siblingDroppedCardClass){
                        case 'droppedCard1':
                            if(document.getElementById(data).classList[1] !== undefined){
                                document.getElementById(data).classList.replace(`${document.getElementById(data).classList[2]}`, 'droppedCard2');
                                // document.getElementById(data).classList.add('droppedCard2');
                            }
                            else{
                                document.getElementById(data).classList.add('droppedCard2');
                            }
                            break;
                        case 'droppedCard2':
                            if(document.getElementById(data).classList[1] !== undefined){
                                document.getElementById(data).classList.replace(`${document.getElementById(data).classList[2]}`, 'droppedCard1');
                                // document.getElementById(data).classList.add('droppedCard1');
                            }
                            else{
                                document.getElementById(data).classList.add('droppedCard1');
                            }
                        console.log('card classes', document.getElementById(data).classList)
                    }
                }
            }

            //If the card is being dropped back into the card container, remove the dropCard class added if it was dropped into a room previously, then append to the card container
            else {
                let whichDroppedCardClass =  document.getElementById(data).classList[2];

                switch(whichDroppedCardClass){
                    case 'droppedCard1':
                        document.getElementById(data).classList.remove('droppedCard1');
                        break;
                    case 'droppedCard2':
                        document.getElementById(data).classList.remove('droppedCard2');
                        break;
                    default:
                        return null;
                }

                ev.target.appendChild(document.getElementById(data));
            }


            //Uses the room the card was dropped into (is now the parent element of the card) to find the index of the room in the crime list (and change id that has underscore to space so it matches what's in the crime list)
            let parentRoomIndex = this.matchedObjects.findIndex((crime) => {
                return crime.room === document.getElementById(data).parentElement.id
            });

            //Item 1 of the correct room in the matchedObjects index is recorded as this card that was dropped (But this can't happen when the card is put back in the card container and parentIndex is -1)
            if(parentRoomIndex !== -1 && this.matchedObjects[parentRoomIndex].item1 === ''){
                this.matchedObjects[parentRoomIndex].item1 = document.getElementById(data).id
            }

            //Item 2 of the correct room in the matchedObjects index is recorded as this card that was dropped (But this can't happen when the card is put back in the card container and parentIndex is -1)
            else if(parentRoomIndex !== -1 && this.matchedObjects[parentRoomIndex].item2 === ''){
                this.matchedObjects[parentRoomIndex].item2 = document.getElementById(data).id;
            }

            //If the room has two items already matched, prevent any more cards being added by removing the ondrop attribute (unless the cards are being put back in )
            if(document.getElementById(data).parentElement.childElementCount === 2 && document.getElementById(data).parentElement.id !== 'card_container'){
                document.getElementById(data).parentElement.removeAttribute('ondrop');

                gameController.detectCrime(parentRoomIndex);
            }

            // //After each card drop, check if that card matches a crime and if a crime is solved (Only do this if the card was not put back in the card container, in which case the parentIndex is -1)
            // if(parentRoomIndex !== -1){
            //     gameController.detectCrime(parentRoomIndex);
            // }
        }
    };

    //Used to record what cards have been dropped into which rooms
    this.matchedObjects = [
        {room: 'Ballroom', item1: '', item2: ''},
        {room: 'Dining_Room', item1: '', item2: ''},
        {room: 'Library', item1: '', item2: ''},
        {room: 'Conservatory', item1: '', item2: ''},
        {room: 'Billiard_Room', item1: '', item2: ''},
        {room: 'Kitchen', item1: '', item2: ''},
    ];

    //Reveal cards to show if a crime was solved, then either flip again or leave the cards there and remove dragging depending on if the crime was solved or not
    this.flipCards = (suspect, weapon, isCrimeSolved) => {

        switch(isCrimeSolved){
            //If the crime has been solved, the cards can be left facing up, but the dragging function needs to be removed
            case true:
                document.getElementById(suspect).children[0].classList.add('cardBackFlip');
                document.getElementById(suspect).children[1].classList.add('flip');

                document.getElementById(weapon).children[0].classList.add('cardBackFlip');
                document.getElementById(weapon).children[1].classList.add('flip');

               setTimeout(()=>{
                   document.getElementById(suspect).children[1].classList.add('cardFrontFlip');
                   document.getElementById(weapon).children[1].classList.add('cardFrontFlip');

               }, 1010);

            //If the crime was not solved, the card needs to wait for the player to see the card front, then remove the added image and
            case false:


        }
    }
}

