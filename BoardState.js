let
    BOARDSIZE = 8,
    red = 1,
    black = -1,
    redKing = 1.1,
    blackKind = -1.1;


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
    }
    getBoard() { return this.board; }
}