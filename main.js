$(document).ready(initialize);
function initialize() {

    let modalH2 = $('<h2>').text('Who done it?');
    let modalP1 = $('<p>').text('In this twist on the classic game of Clue, you are given six crimes to solve. Mr. Boddy has been killed, and it is your job to figure out who commited the crime, in what room, and with which weapon.');
    let modalP2 = $('<p>').text('Solve the crimes by dragging two cards into a room. The cards will flip to reveal either a person or a weapon. Using the crimes listed above, match the right suspect, weapon, and room.');
    let modalP3 = $('<p>').text('Good luck!');

    $('.modal-body').append(modalH2, modalP1, modalP2, modalP3);
    $('#startModal').modal('show');

    gameModel = new GameModel();
    gameView = new GameView();
    gameController = new GameController();
}



