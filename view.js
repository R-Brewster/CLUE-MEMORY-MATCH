function GameView() {
    this.rooms = gameModel.roomsArray;
    this.randomizedCards = gameModel.randomizedCards;
    this.crimes = gameModel.crimes;

    //Create the cards and append them to the card container
    this.makeCards =  (randomizedCards) => {
        for(let i=0; i<12; i++){
            let card = $('<div>').text(randomizedCards[i].name).addClass(`card ${randomizedCards[i].type}`).attr({
                id: randomizedCards[i].name,
                draggable: 'true',
                ondragstart: 'gameView.drag(event)'
            });
            $('#card_container').append(card);
        }

    };

    this.makeCards(this.randomizedCards);

    //Create the rooms and append them to the room container
    this.makeRooms = (crimes) => {
        for(let i=0; i<6; i++){
            let room = $('<div>').text(crimes[i].room).addClass('room').attr({
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
    this.drag = (ev) => {
        if(ev.target.id !== undefined){
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
            ev.target.appendChild(document.getElementById(data));

            // console.log(document.getElementById(data));
            // console.log(document.getElementById(data).id);
            // console.log(document.getElementById(data).classList[1]);

            //Uses the room the card was dropped into (is now the parent element of the card) to find the index of the room in the crime list
            let parentRoomIndex = this.matchedObjects.findIndex((crime) => {
                return crime.room === document.getElementById(data).parentElement.id
            });

            //Item 1 of the correct room in the matchedObjects index is recorded as this card that was dropped
            if(this.matchedObjects[parentRoomIndex].item1 === ''){
                this.matchedObjects[parentRoomIndex].item1 = document.getElementById(data).id
            }

            //Item 2 of the correct room in the matchedObjects index is recorded as this card that was dropped
            else if(this.matchedObjects[parentRoomIndex].item2 === ''){
                this.matchedObjects[parentRoomIndex].item2 = document.getElementById(data).id;
            }

            //If the room has two items already matched, prevent any more cards being added by removing the ondrop attribute
            if(document.getElementById(data).parentElement.childElementCount === 2){
                document.getElementById(data).parentElement.removeAttribute('ondrop')
            }

            //After each card drop, check if that card matches a crime and if a crime is solved
            gameController.detectCrime(parentRoomIndex);
        }
    };

    //Used to record what cards have been dropped into which rooms
    this.matchedObjects = [
        {room: 'Ballroom', item1: '', item2: ''},
        {room: 'Dining Room', item1: '', item2: ''},
        {room: 'Library', item1: '', item2: ''},
        {room: 'Conservatory', item1: '', item2: ''},
        {room: 'Billiard Room', item1: '', item2: ''},
        {room: 'Kitchen', item1: '', item2: ''},
    ];
}

