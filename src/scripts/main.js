//constants
var player = "Player"; //refactor player and computer into objects holding an icon
var computer = "Computer";
var draw = "Draw";
var playerIcon = 'X';
var computerIcon = 'O';
var emptyTile = " ";
var tileCount = 9;
var boardRows = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
];

//global vars
var viewModel;
var playerTurn = true;
var gameStarted = false;
var gameOver = false;
var winner = "";

function ViewModel() {
    this.playerName = ko.observable();
    this.tiles = ko.observableArray();

    for (var i = 0; i < tileCount; i++) {
        this.tiles.push(emptyTile);
    }

    this.notificationMessage = ko.computed(function () {
        return getNotificationMessage(this.playerName);
    }, this);
}

function init() {
    viewModel = new ViewModel();
    ko.applyBindings(viewModel);
    
    newGame();
}

function newGame() {
    viewModel.tiles.removeAll();
    for (var i = 0; i < tileCount; i++) {
        viewModel.tiles.push(emptyTile);
    }

    playerTurn = true;
    gameStarted = false;
    gameOver = false;
    winner = "";    

    updateNotification();
    $('#newGame').hide();
}

function getDisplayName(playerName) {
    if (playerName())
        return playerName();
    else
        return "You";
}

function getNotificationMessage(playerName) {
    if (gameOver == true) {
        if (winner == player)
            return getDisplayName(playerName) + " won!";
        else if(winner == computer)
            return "The computer won, better luck next time.";
        else
            return "Draw!";
    }
    else if (gameStarted == false) {
        if (playerName())
            return playerName() + " has the first move!";
        else
            return "You have the first move!";
    }
    else if (playerTurn) {
        if (playerName())
            return playerName() + "'s turn.";
        else
            return "Your turn."
    }
    else
        return computer +"'s turn.";
}

function updateNotification() {
    $('#notification').html(
        getNotificationMessage(viewModel.playerName));
}

function executeRound(number) {
    if (gameOver || !tileIsOpen(number))
        return false;

    checkGameStarted();

    playerMove(number, playerIcon);    

    setTimeout(function () {
        computerMove();
    }, 500);
}

function checkGameStarted() {
    if (gameStarted == false) {
        gameStarted = true;
        $('#newGame').fadeIn(400);
    }
}

function playerMove(number) { 
    if (playerTurn) {
        updateTile(number, playerIcon);
        playerTurn = false;

        checkForWinner();        
        updateNotification();        
    }    
}

function computerMove() {
    var number = determineComputerMove();
    
    updateTile(number, computerIcon);

    playerTurn = true;

    checkForWinner();
    updateNotification();
}

function determineComputerMove() {
    var board = getAllTiles();

    return position = calculateMove(board);
}

function updateTile(number, value) {
    if (viewModel.tiles()[number] != emptyTile || gameOver)
        return;

    viewModel.tiles()[number] = value;
    viewModel.tiles.valueHasMutated();
}

function tile(num) {
    return viewModel.tiles()[num]
}

function getAllTiles() {
    var array = [];
    for (var i = 0; i < viewModel.tiles().length; i++)
        array.push(tile(i));
    return array;
}

function tileIsOpen(num) {
    var currentTile = viewModel.tiles()[num];

    if (currentTile != playerIcon && currentTile != computerIcon)
        return true;
    else
        return false;
}

function checkForWinner() {
    for (var i = 0; i < boardRows.length; i++) {
        var row = boardRows[i];

        if (tile(row[0]) != emptyTile
            && tile(row[0]) == tile(row[1])
            && tile(row[0]) == tile(row[2])) {

            declareWinner(tile(row[0]));
            return;
        }
    }

    if (viewModel.tiles().length == 9) {
        for (var i = 0; i < viewModel.tiles().length; i++)
            if(tileIsOpen(i))
                return true;
        
        gameOver = true;
        winner = draw;
    }    
}

function declareWinner(icon) {
    gameOver = true;
    if (icon == playerIcon)
        winner = player;
    else if (icon == computerIcon)
        winner = computer;
}

function logTiles(board) {
    for (var i = 0; i < board.length; i++) {
        console.log("Tile: " + i + ". Value: " + tile(i));
    }
}