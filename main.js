$(document).ready(initialize);
function initialize() {

    $('#startModal').modal('show');
    
    gameModel = new GameModel();
    gameView = new GameView();
    gameController = new GameController();
}



