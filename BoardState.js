let
    BOARDSIZE = 8,
    red = 1,
    black = -1,
    redKing = 1.1,
    blackKing = -1.1;


class BoardState {
    constructor(board) {
        if (board == null)
            this.board = [
                [red, 0, red, 0, red, 0, red, 0],
                [0, red, 0, red, 0, red, 0, red],
                [red, 0, red, 0, red, 0, red, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, black, 0, black, 0, black, 0, black],
                [black, 0, black, 0, black, 0, black, 0],
                [0, black, 0, black, 0, black, 0, black]
            ]
        else this.board = board
        // this.turn = black;
    }
    getBoard() {
        return this.board;
    }

    // makes a deep copy of a given array
    static copy(board) {
        return new BoardState(JSON.parse(JSON.stringify(board)))
    }

    static doAction(action,board){
        // var distance = {
        //     x: to.x - from.x,
        //     y: to.y - from.y
        // };
        if(Math.abs(action[1].x-action[0].x)==2){
            let jumpedPiece=BoardState.getJumpedPiece(action[0],action[1])
            board[jumpedPiece[0]][jumpedPiece[1]]=0
        }
        let valueAt=board[action[0].x][action[0].y]
        board[action[0].x][action[0].y]=0
        board[action[1].x][action[1].y]=valueAt
    }

    static winner(board) {
        let redN = 0,
            blackN = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (parseInt(board[i][j]) == red)
                    redN++
                else if (parseInt(board[i][j]) == black)
                    blackN++
            }
        }
        if (redN == 0)
            return black
        else if (blackN == 0)
            return red
        else if (blackN > 0 && redN > 0) {
            return 0
        }
        return 0
    }

    static getLegalActions(player,board) {
        let singleActions = [
                [1, 1],
                [-1, -1],
                [-1, 1],
                [1, -1]
            ],
            doubleActions = [
                [2, 2],
                [-2, -2],
                [-2, 2],
                [2, -2]
            ],
            legalPositions = []
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let offset = 0;
                player == 1 ? offset = .1 : offset = -.1;
                if (board[i][j] === player || board[i][j] === (player + offset)) {
                    for (let a = 0; a < singleActions.length; a++) {
                        if (BoardState.isMoveLegal({
                                x: i,
                                y: j
                            }, {
                                x: i + singleActions[a][0],
                                y: j + singleActions[a][1]
                            }, null, board)) {
                            legalPositions.push([{
                                x: i,
                                y: j
                            }, {
                                x: i + singleActions[a][0],
                                y: j + singleActions[a][1]
                            }])
                        }
                    }
                    for (let a = 0; a < doubleActions.length; a++) {
                        if (BoardState.isMoveLegal({
                                x: i,
                                y: j
                            }, {
                                x: i + doubleActions[a][0],
                                y: j + doubleActions[a][1]
                            }, null,board)) {
                            legalPositions.push([{
                                x: i,
                                y: j
                            }, {
                                x: i + doubleActions[a][0],
                                y: j + doubleActions[a][1]
                            }])
                        }
                    }
                }
            }
        }
        return legalPositions
    }

    // nextTurn() {
    //     if (this.turn == red || this.turn == redKing)
    //         this.turn = black
    //     else
    //         this.turn = red;
    // }

    static getJumpedPiece(from, to) {
        var distance = {
            x: to.x - from.x,
            y: to.y - from.y
        };
        if (Math.abs(distance.x) == 2) {
            var jumpy = parseInt(from.y) + Math.sign(distance.y);
            var jumpx = parseInt(from.x) + Math.sign(distance.x);
            return [jumpx, jumpy];
        } else return null;

    }

    static isMoveLegal(from, to, game,board) {
        if ((to.x < 0) || (to.y < 0) || (to.x > 7) || (to.y > 7)) {
            return false;
        }
        let piece = board[to.x][to.y],
            removeMiddlePiece = false,
            jumpedPieceIndex;

        var distance = {
            x: to.x - from.x,
            y: to.y - from.y
        };
        if ((distance.x == 0) || (distance.y == 0)) {
            //console.log("ILLEGAL MOVE: horizontal or vertical move");
            return false;
        }
        if (Math.abs(distance.x) != Math.abs(distance.y)) {
            //console.log("ILLEGAL MOVE: non-diagonal move");
            return false;
        }
        if (Math.abs(distance.x) > 2) {
            //console.log("ILLEGAL MOVE: more than two diagonals");
            return false;
        }
        if (board[to.x][to.y] != 0) {
            //console.log("ILLEGAL MOVE: cell is not empty");
            return false;
        }
        if (Math.abs(distance.x) == 2) {
            jumpedPieceIndex = BoardState.getJumpedPiece(from, to);
            // board[jumpedPieceIndex[0]][jumpedPieceIndex[1]]=0
            var jumpedPiece = board[jumpedPieceIndex[0]][jumpedPieceIndex[1]]

            if (jumpedPiece == null) {
                //console.log("ILLEGAL MOVE: no piece to jump");
                return false;
            }
            var pieceState = parseInt(board[from.x][from.y]);
            var jumpedState = parseInt(jumpedPiece);
            if (pieceState != -jumpedState) {
                //console.log("ILLEGAL MOVE: can't jump own piece");
                return false;
            }
            removeMiddlePiece = true;
        }
        if ((parseInt(board[from.x][from.y]) === board[from.x][from.y]) && (Math.sign(board[from.x][from.y]) != Math.sign(distance.x))) {
            //console.log("ILLEGAL MOVE: wrong direction");
            return false;
        }
        // if (this.turn != parseInt(this.board[from.x][from.y])) {
        //     console.log("ILLEGAL TURN: wrong player")
        //     return false;
        // }

        // if (to.x == 0 || to.x == 7) {

        //     if (board[from.x][from.y] == red) {
        //         board[from.x][from.y] = redKing
        //         if (game != null)
        //             game.setKing([from.x, from.y], 1)
        //     } else if (board[from.x][from.y] == black) {
        //         board[from.x][from.y] = blackKing
        //         if (game != null)
        //             game.setKing([from.x, from.y], -1)
        //     }
        // }


        if (removeMiddlePiece && game != null) {
            board[jumpedPieceIndex[0]][jumpedPieceIndex[1]]=0
            game.removeMiddlePiece(jumpedPieceIndex)
        }
        // if (game != null)
        //     this.nextTurn()
        return true
    }

    // getTurn() {
    //     return this.turn
    // }

}