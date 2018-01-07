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

            if(document.getElementById(ev.target.id).parentElement.childElementCount === 2) {
                document.getElementById(ev.target.id).parentElement.setAttribute('ondrop', 'gameView.drop(event)')
            }
        }
    };

    //Declares the data being moved and appends it to the element that it's being dropped on, then uses the information from the dropped element and its new parent to create a matchedObjects array for the model
    this.drop = (ev) =>{
        // let matchedItems = {
        //     suspect: '',
        //     weapon: '',
        //     room: '',
        // };
        //Prevents error resulting from this being read before a drag and drop event has happened
        if(ev.dataTransfer !== undefined) {
            ev.preventDefault();
            let data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));

            console.log(document.getElementById(data));
            console.log(document.getElementById(data).id);
            console.log(document.getElementById(data).classList[1]);

            let parentRoomIndex = this.matchedObjects.findIndex((crime) => {
                return crime.room === document.getElementById(data).parentElement.id
            });

            if(this.matchedObjects[parentRoomIndex].item1 === ''){
                this.matchedObjects[parentRoomIndex].item1 = document.getElementById(data).id
            }

            else if(this.matchedObjects[parentRoomIndex].item2 === ''){
                this.matchedObjects[parentRoomIndex].item2 = document.getElementById(data).id;
            }

            if(document.getElementById(data).parentElement.childElementCount === 2){
                document.getElementById(data).parentElement.removeAttribute('ondrop')
            }

            // if(document.getElementById(data).parentElement.childElementCount === 1){
            //     document.getElementById(data).parentElement.setAttribute( 'ondrop', 'gameView.drop(event)')
            // }

            gameController.comparedObjects();
        }
    };

    this.matchedObjects = [
        {room: 'Ballroom', item1: '', item2: ''},
        {room: 'Dining Room', item1: '', item2: ''},
        {room: 'Library', item1: '', item2: ''},
        {room: 'Conservatory', item1: '', item2: ''},
        {room: 'Billiard Room', item1: '', item2: ''},
        {room: 'Kitchen', item1: '', item2: ''},
    ];
}

