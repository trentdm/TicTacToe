var infinity = 100;
var boardRows = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
];

function calculateMove(board) {
    side = computerIcon;

    if (isboardEmpty(board))
        return getRandomInt(0, board.length);

    var move = search(board, side, 0, -infinity, +infinity);
    
    return move;
};

function isboardEmpty(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i] !== " ")
            return false;
    }
    return true;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function search(board, side, depth, alpha, beta) {
    if (beta <= alpha) //unoptimal branch, no further evaulation needed
        return 0;

    var bestMove;
    var otherSide = side == playerIcon ? computerIcon : playerIcon;
    
    var score = boardScore(board, side);    

    if (score != 0) {
        if (score > 0)
            return score - depth;
        else
            return score + depth;
    }

    var moves = findLegalMoves(board);

    if (moves.length == 0)
        return score; // Returns in the case of a draw.

    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];

        makeMove(board, move, side);

        var alphaCandidate = -search(board, otherSide, depth + 1, -beta, -alpha);

        undoMove(board, move);        

        if (alphaCandidate > alpha) {

            alpha = alphaCandidate;

            if (depth == 0)
                bestMove = move;
        }
    }

    return depth != 0 ? alpha : bestMove;
};

function boardScore(board, side) {
    var winner = checkGameOver(board);
    if (winner == null || winner == draw)
        return 0;
    else if (winner == side)
        return infinity;
    else
        return -infinity;
};

function checkGameOver(board) {
    for (var i = 0; i < boardRows.length; i++) {
        var row = boardRows[i];

        //check for a winning combination
        if (board[row[0]] != emptyTile
            && board[row[0]] == board[row[1]]
            && board[row[0]] == board[row[2]]) {

            return board[row[0]];
        }
    }

    //check for draw game
    for (var i = 0; i < board.length; i++) {
        if (board[i] == emptyTile)
            return;
        return draw;
    }
}

function findLegalMoves(board) {
    var moves = [];
    for (var i = 0; i < board.length; i++) {
        if (board[i] == emptyTile)
            moves.push(i);
    }
    return moves;
};

function makeMove(board, move, side) {
    board[move] = side;
};

function undoMove(board, move) {
    board[move] = emptyTile;
};