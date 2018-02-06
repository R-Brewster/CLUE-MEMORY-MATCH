function GameView() {
    this.rooms = gameModel.roomsArray;
    this.randomizedCards = gameModel.randomizedCards;
    this.crimes = gameModel.crimes;

    //Format the crimes' text and append them to the crimes container
    this.displayCrimes = (crimes) =>{
        for(let i=0; i<6; i++){
            let room = (crimes[i].room).replace('_', ' ');
            let suspect = (crimes[i].suspect).replace('_', ' ');
            let weapon = (crimes[i].weapon).replace('_', ' ');

            let crimeTitle = $('<h4>').text(`Crime ${i+1}: `).addClass('crimeTitle');
            let crimeText = $('<p>').text(`${suspect} in the ${room} with the ${weapon}`).addClass('crimeText');

            let crime = $('<div>').addClass('crime').append(crimeTitle, crimeText);

            $('#crimesContainer').append(crime);
        }
    };

    this.displayCrimes(this.crimes);

    this.cardDragged = '';

    //Create the cards and append them to the card container
    this.makeCards =  (randomizedCards) => {
        for(let i=0; i<12; i++){
            let card = $('<div>').text(randomizedCards[i]).addClass('card').attr({
                id: randomizedCards[i],
            });

            let cardBack = $('<div>').text(randomizedCards[i]).addClass('cardBack');

            let cardFront = $('<div>').text(randomizedCards[i]).addClass('cardFront').css({
                backgroundImage: `url(images/${randomizedCards[i]}.png)`,
            });

            $('#cardContainer').append(card);

            $(`#${randomizedCards[i]}`).append(cardFront, cardBack, );
        }

        $('.card').draggable({
            start: (event, ui) => { jQuery.event.props.push('dataTransfer');  this.cardDragged = event.target; this.handleDrag(event, ui);  $(`${event.target.id}`).css('z-index', '5');},
            stop: () => {$(`${event.target.id}`).css('z-index', '2')},
            containment: '#draggableArea',
            opacity: 0.35,
        });

        $('#cardContainer').droppable({
            drop: (event) => {this.handleDrop(event, this.cardDragged)}
        });

    };

    this.makeCards(this.randomizedCards);

    //Create the rooms and append them to the room container
    this.makeRooms = (crimes) => {
        for(let i=0; i<6; i++){
            let room = $('<div>').addClass('room').css('background-image', `url(images/${crimes[i].room}.png`).attr({
                id: crimes[i].room,
            });

            $('#roomsContainer').append(room);
        }
        $('.room').droppable({
            drop: (event) => {this.handleDrop(event, this.cardDragged)}
        });
    };

    this.makeRooms(this.crimes);

    //Get the statistics and display them in the stats container
    this.showStats = (stats) => {
        $('#crimesSolved').text(`${stats.crimesSolved}`);
        $('#gamesPlayed').text(`${stats.gamesPlayed}`);
        $('#attempts').text(`${stats.attempts}`);
        $('#accuracy').text(`${stats.accuracy}%`);
    };

    //Add the loading screen on top of everything else, so the cards and rooms can reset
    this.displayLoadingScreen = () => {
        let loadingScreen = $('<img>').attr('src', './images/loading_screen.png').addClass('loadingScreen');
        $('body').prepend(loadingScreen);

        //remove the flipped class after the cards are done flipping, but before the loading screen is removed
        setTimeout(() => {
            $('.card').removeClass('flipped')
        }, 4000);

        setTimeout(() => {
            $('.loadingScreen').remove();
        }, 6000);

    };

    //Prevents the default handling of the element as a link (https://www.w3schools.com/html/html5_draganddrop.asp)
    this.allowDrop = (ev) => {
        ev.preventDefault();
    };

    //Sets the data type and value
    this.handleDrag = (ev) => {
        //If a card is being moved from a room that had 2 cards (so droppable was disabled) this enables dropping events for that room again, but just for room tiles and not the card container
        if( $(`#${ev.target.id}`).parent()[0].id !== 'cardContainer'){
            $(`#${ev.target.id}`).parent().droppable('enable')
        };

            //If the parent element has two children, allow ondrop events again (this card is being removed from this room, so more cards should be allowed in)
            if($(`#${ev.target.id}`).parent().children().length === 2) {
                $(`#${ev.target.id}`).parent().droppable({
                    drop: (event) => {this.handleDrop(event, this.cardDragged)}
                });
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
        // }
    };

    this.handleDrop = (ev, card) =>{
            //If the div the card will be dropped into is a room (or the game container), append the card to that div then add a class to fit in the room
            if(ev.target.className === "room ui-droppable" || "ui-droppable"){

                cardId = card.id;

                ev.target.append($(`#${cardId}`)[0]);

                //If the card is being dropped back into the card container, any droppedCard classes need to be removed
                if($(`#${cardId}`).hasClass('droppedCard1')) {
                    $(`#${cardId}`).removeClass('droppedCard1')
                }
                else if ($(`#${cardId}`).hasClass('droppedCard2')) {
                    $(`#${cardId}`).removeClass('droppedCard2')
                }

                //If this card is the only child of the room div, give it droppedCard1
                if($(`#${cardId}`).parent().children().length === 1){

                    //If the card is coming from another room where it was 'droppedCard2', it  needs to become 'droppedCard1'
                    if($(`#${cardId}`).hasClass('droppedCard2')){
                        $(`#${cardId}`).removeClass('droppedCard2').addClass( 'droppedCard1')
                    }

                    //If the card doesn't have 'droppedCard1', add it
                    else if(!$(`#${cardId}`).hasClass('droppedCard1')){
                        $(`#${cardId}`).addClass('droppedCard1')
                    }

                }
                //If another sibling is present, we first need to figure out which droppedCard class it has then give this card the other droppedCard class
                else {
                    let siblingDroppedCardClassList = $(`#${cardId}`).siblings();
                    let siblingDroppedCardClass = '';

                     if(siblingDroppedCardClassList.hasClass('droppedCard1')){
                         siblingDroppedCardClass = 'droppedCard1'
                     }
                     else if (siblingDroppedCardClassList.hasClass('droppedCard2')) {
                         siblingDroppedCardClass = 'droppedCard2'
                     }

                    switch(siblingDroppedCardClass){
                        case 'droppedCard1':
                            if($(`#${cardId}`).hasClass('droppedCard1')){
                                $(`#${cardId}`).removeClass('droppedCard1').addClass('droppedCard2');
                            }
                            else{
                                $(`#${cardId}`).addClass('droppedCard2');
                            }
                            break;
                        case 'droppedCard2':
                            if($(`#${cardId}`).hasClass('droppedCard2')){
                                $(`#${card}`).removeClass('droppedCard2').addClass('droppedCard1');
                            }
                            else{
                                $(`#${cardId}`).addClass('droppedCard1');
                            }
                    }
                }
            }

            else if ( ev.target.className === "card droppedCard1" || ev.target.className === "card droppedCard2") {
                let roomOfCard =   $(`#${cardId}`).parent();
                let card =  $(`#${cardId}`);

                roomOfCard.remove(card);
                roomOfCard.append(card);
            }

            else {
                let whichDroppedCardClass =   $(`#${cardId}`).attr('class');

                switch(whichDroppedCardClass){
                    case 'card droppedCard1':
                        $(`#${cardId}`).removeClass('droppedCard1');
                        break;
                    case 'card droppedCard2':
                        $(`#${cardId}`).removeClass('droppedCard2');
                        break;
                    default:
                        return null;
                }

                ev.target.append( $(`#${cardId}`)[0]);
            }


            //Uses the room the card was dropped into (is now the parent element of the card) to find the index of the room in the crime list (and change id that has underscore to space so it matches what's in the crime list)
            let parentRoomIndex = this.matchedObjects.findIndex((crime) => {
                return crime.room ===  $(`#${cardId}`).parent().attr('id')
            });

            //Item 1 of the correct room in the matchedObjects index is recorded as this card that was dropped (But this can't happen when the card is put back in the card container and parentIndex is -1)
            if(parentRoomIndex !== -1 && this.matchedObjects[parentRoomIndex].item1 === ''){
                this.matchedObjects[parentRoomIndex].item1 =  $(`#${cardId}`).attr('id')
            }

            //Item 2 of the correct room in the matchedObjects index is recorded as this card that was dropped (But this can't happen when the card is put back in the card container and parentIndex is -1)
            else if(parentRoomIndex !== -1 && this.matchedObjects[parentRoomIndex].item2 === ''){
                this.matchedObjects[parentRoomIndex].item2 =  $(`#${cardId}`).attr('id');
            }

            //If the room has two items already matched, prevent any more cards being added by removing the ondrop attribute (unless the cards are being put back in )
            if( $(`#${cardId}`).parent().children().length === 2 &&  $(`#${cardId}`).parent().attr('id') !== 'card_container'){
                $(`#${cardId}`).parent().droppable('disable');

                //Check if the two cards match the room they're in for a solved crime
                gameController.detectCrime(parentRoomIndex);
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

        this.flip = () => {
          //The setTimeout ensures that both cards flip at the same time
          setTimeout(() => {
              $(`#${suspect}`).toggleClass('flipped');
              $(`#${weapon}`).toggleClass('flipped');
          }, 20);

        };


        switch(isCrimeSolved){
            case true:
                $('.card').draggable('disable');
                this.flip();
                //The setTimeout ensures that the border that appears on winning cards will appear during the flip animation
                setTimeout(() => {
                    $(`#${suspect}`).draggable('disable').addClass('matchedCard');
                    $(`#${weapon}`).draggable('disable').addClass('matchedCard');
                }, 300)
                $('.card').draggable('enable');
                break;

            case false:
                $('.card').draggable('disable');
                this.flip();
                setTimeout(()=> {
                    this.flip();
                    $('.card').draggable('enable');
                }, 3000);
                break;
            default:
                return null;
        }
    };

    this.allCrimesSolved = () => {
        // let modalH2 = $('<h2>').text('You solved all of the crimes!');
        // let modalH4 = $('<h4>').text('Want to play again?');
        // let startButton = $('<button>').click(() => {gameController.startNewGame(); $('#startModal').modal('hide')}).text('New Game').addClass('newGameButton').css({
        //     position: 'relative',
        //     left: '-74%'
        // });
        // $('.modal-body').text('');
        // $('.modal-body').append(modalH2, modalH4);
        // $('.modal-footer').append(startButton);
        $('#winModal').modal('show');
    }
}

