let
    BOARDSIZE = 8,
    red = 1,
    black = -1,
    redKing = 1.1,
    blackKing = -1.1;


class BoardState {
    constructor() {
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
        this.turn = black;
    }
    getBoard() { return this.board; }

    nextTurn() {
        if (this.turn == red || this.turn == redKing)
            this.turn = black
        else
            this.turn = red;
    }

    sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

    getJumpedPiece(from, to) {
        var distance = { x: to.x - from.x, y: to.y - from.y };
        console.log(distance)
        if (Math.abs(distance.x) == 2) {
            var jumpy = parseInt(from.y) + Math.sign(distance.y);
            var jumpx = parseInt(from.x) + Math.sign(distance.x);
            return [jumpx, jumpy];
        } else return null;

    }

    removeMiddlePiece(x, y) {

    }

    isMoveLegal(from, to, game) {
        let piece = this.board[to.x][to.y],
            removeMiddlePiece = false,
            jumpedPieceIndex;
        if ((to.x < 0) || (to.y < 0) || (to.x > 7) || (to.y > 7)) {
            return false;
        }
        var distance = { x: to.x - from.x, y: to.y - from.y };
        console.log(distance)
        if ((distance.x == 0) || (distance.y == 0)) {
            console.log("ILLEGAL MOVE: horizontal or vertical move");
            return false;
        }
        if (Math.abs(distance.x) != Math.abs(distance.y)) {
            console.log("ILLEGAL MOVE: non-diagonal move");
            return false;
        }
        if (Math.abs(distance.x) > 2) {
            console.log("ILLEGAL MOVE: more than two diagonals");
            return false;
        }
        if (this.board[to.x][to.y] != 0) {
            console.log("ILLEGAL MOVE: cell is not empty");
            return false;
        }
        if (Math.abs(distance.x) == 2) {
            jumpedPieceIndex = this.getJumpedPiece(from, to);
            var jumpedPiece = this.board[jumpedPieceIndex[0]][jumpedPieceIndex[1]]

            if (jumpedPiece == null) {
                console.log("ILLEGAL MOVE: no piece to jump");
                return false;
            }
            var pieceState = parseInt(this.board[from.x][from.y]);
            var jumpedState = parseInt(jumpedPiece);
            if (pieceState != -jumpedState) {
                console.log("ILLEGAL MOVE: can't jump own piece");
                return false;
            }
            removeMiddlePiece = true;
        }
        if ((parseInt(this.board[from.x][from.y]) === this.board[from.x][from.y]) && (Math.sign(this.board[from.x][from.y]) != Math.sign(distance.x))) {
            console.log("ILLEGAL MOVE: wrong direction");
            return false;
        }
        console.log(`Turn ${this.turn}`)
        if (this.turn != parseInt(this.board[from.x][from.y])) {
            console.log("ILLEGAL TURN: wrong player")
            return false;
        }

        if (to.x == 0 || to.x == 7) {
            if (this.turn == red) {
                this.board[from.x][from.y] = redKing
                game.setKing([from.x, from.y], 1)
            } else if (this.turn == black) {
                this.board[from.x][from.y] = blackKing
                game.setKing([from.x, from.y], -1)
            }
        }


        if (removeMiddlePiece) {
            game.removeMiddlePiece(jumpedPieceIndex)
        }
        this.nextTurn()
        return true
    }

    getTurn() { return this.turn }

}