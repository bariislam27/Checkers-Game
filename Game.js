// Caching the dom
const board = document.getElementById("board")
const redScore = document.getElementById("redScore")
const blackScore = document.getElementById("blackScore")
const playerTurn = document.getElementById("player")

// fix for different screen size
const size = parseInt((window.innerHeight * 0.8) / 8)


const playingWith = {
        "Opponent (Red)": ""
    },
    config = {
        "Time limit(ms)": 1000,
        "maxDepth": 0,
        player: 1
    }


const dgui = new dat.GUI();


class Game {
    constructor(playerNum, score) {

        this.AI = null;
        // state board
        this.boardState = new BoardState()
        this.selected = [null, null]
        // gui board, only contains the  circles
        this.guiState = this.twoDArray(8)

        // contains all the rectangles
        this.checkersBoard = [];
        this.two = new Two({
            width: window.innerHeight * 0.9,
            height: window.innerHeight * 0.9,
        }).appendTo(board);

        this.setUpSvgElements();
        this.addOnClickToElements()
        this.setUpController()
    }

    setUpController() {
        let opp = dgui.add(playingWith, "Opponent (Red)", ['Human', 'AI']);
        opp.setValue("AI")
        dgui.add(config, "Time limit(ms)", 0)
        dgui.add(config, "maxDepth", 0)
    }

    twoDArray(x) {
        let k = []
        for (let i = 0; i < x; i++) {
            k.push([])
            for (let j = 0; j < x; j++) {
                k[i].push(0)
            }
        }
        return k
    }

    setUpSvgElements() {
        let state = this.boardState.getBoard()
        let guiState = this.guiState
        let t = this.two;
        for (let i = 0; i < state.length; i++) {
            let checkersBoardRow = []
            for (let j = 0; j < state[i].length; j++) {
                // the board rectangles
                let rec = t.makeRectangle(i * size + size / 1.5, j * size + size / 1.5, size, size);
                if ((i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0))
                    rec.fill = "rgba(0,0,0,1)"
                else if (!(i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)) {
                    rec.fill = "rgba(255,255,255,1)"
                }

                checkersBoardRow.push(rec);

                // player circles
                // red =1
                if (state[j][i] == 1) {
                    let c = t.makeCircle(i * size + size / 1.5, j * size + size / 1.5, size / 2.1);
                    c.fill = "#FF0000"
                    c.noStroke();
                    guiState[j][i] = c;
                }
                // black =-1 
                else if (state[j][i] == -1) {
                    let c = t.makeCircle(i * size + size / 1.5, j * size + size / 1.5, size / 2.1);
                    c.fill = "#000000"
                    c.noStroke();
                    guiState[j][i] = c;
                }
            }
            this.checkersBoard.push(checkersBoardRow)
        }
        t.update();
    }

    addOnClickToElements() {
        let guiState = this.guiState;
        for (let i = 0; i < guiState.length; i++) {
            for (let j = 0; j < guiState[i].length; j++) {

                // onclick event for player circle
                if (guiState[i][j] != 0) {
                    guiState[i][j]._renderer.elem.setAttribute("pos", `${i}_${j}`);
                    guiState[i][j]._renderer.elem.onclick = (e) => {

                        if (this.selected[0] != null)
                            this.guiState[this.selected[0]][this.selected[1]].noStroke();
                        let x = e.target.getAttribute("pos")[0],
                            y = e.target.getAttribute("pos")[2]
                        this.guiState[x][y].stroke = "#0F0"
                        this.selected = [x, y]
                        this.guiState[x][y].linewidth = 5;
                        this.two.update()
                    }
                }

                // onclick event for the board rectangles
                this.checkersBoard[i][j]._renderer.elem.setAttribute("pos", `${i}_${j}`);
                this.checkersBoard[i][j]._renderer.elem.onclick = (e) => {
                    let x = e.target.getAttribute("pos")[0],
                        y = e.target.getAttribute("pos")[2]

                    // Human move start
                    if (this.selected[0] != null && BoardState.isMoveLegal({
                            x: this.selected[0],
                            y: this.selected[1]
                        }, {
                            x: y,
                            y: x
                        }, this, this.boardState.getBoard())) {
                        let t = this.two;
                        let boardState = this.boardState.getBoard();
                        this.guiState[this.selected[0]][this.selected[1]].translation.set(x * size + size / 1.5, y * size + size / 1.5)
                        this.guiState[this.selected[0]][this.selected[1]].noStroke()
                        this.guiState[y][x] = Object.assign(t.makeCircle(), this.guiState[this.selected[0]][this.selected[1]])
                        boardState[y][x] = boardState[this.selected[0]][this.selected[1]]
                        boardState[this.selected[0]][this.selected[1]] = 0
                        // console.log("human  move: ", y, x, x * size + size / 1.5, y * size + size / 1.5)
                        this.guiState[y][x]._renderer.elem.setAttribute("pos", `${y}_${x}`)
                        this.guiState[this.selected[0]][this.selected[1]] = 0
                        if (y == 0 || y == 7) {
                            this.setKing([y, x], boardState[y][x])
                        }
                        this.selected = [null, null]
                        //Human move complete

                        // if playing with AI
                        if (playingWith["Opponent (Red)"] == "AI") {
                            if (this.AI == null)
                                this.AI = new AI(config)
                            this.makeComputerMove(this.AI.getAction(this.boardState))
                        }
                        this.updateScore()

                    }
                    this.two.update()
                }
            }
        }

        this.two.update();
    }


    makeComputerMove(action) {
        if(action===null)
            return
        let pX = action[0].x,
            pY = action[0].y,
            nX = action[1].x,
            nY = action[1].y,
            boardState = this.boardState.getBoard();
        // console.log(action)
        BoardState.isMoveLegal({
            x: pX,
            y: pY
        }, {
            x: nX,
            y: nY
        }, this, this.boardState.getBoard())
        this.guiState[pX][pY].translation.set(parseInt(nY * size + size / 1.5), parseInt(nX * size + size / 1.5))
        this.guiState[nX][nY] = Object.assign(this.two.makeCircle(), this.guiState[pX][pY])
        boardState[nX][nY] = boardState[pX][pY]
        boardState[pX][pY] = 0
        this.guiState[nX][nY]._renderer.elem.setAttribute("pos", `${nX}_${nY}`)
        this.guiState[pX][pY] = 0
        if (nX == 0 || nX == 7) {
            this.setKing([nX, nY], 1)
        }
        

    }

    setKing(coord, player) {
        let board=this.boardState.getBoard()
        if (board[coord[0]][coord[1]] == red) {
            board[coord[0]][coord[1]] = 1.1
        } else if (board[coord[0]][coord[1]] == black) {
            board[coord[0]][coord[1]] = -1.1
        }
        // console.log(player)
        if (player == 1)
            this.guiState[coord[0]][coord[1]].fill = "#B55"
        else if (player == -1)
            this.guiState[coord[0]][coord[1]].fill = "#999"
        // this.two.update();
    }

    removeMiddlePiece(coord) {
        // console.log("remove piece", coord)
        document.getElementById(this.guiState[coord[0]][coord[1]].id).remove();
        this.guiState[coord[0]][coord[1]].remove();
        this.guiState[coord[0]][coord[1]] = 0;
        // this.boardState.getBoard()[coord[0]][coord[1]] = 0
        this.two.update();
    }
    updateScore() {
        let board = this.boardState.getBoard(),
            red = 0,
            black = 0;
        for (let i = 0; i < board.length; i++)
            for (let j = 0; j < board[i].length; j++) {
                if (parseInt(board[i][j]) == 1)
                    red++
                else if (parseInt(board[i][j]) == -1) black++
            }
        redScore.innerHTML = red
        blackScore.innerHTML = black
        // if (parseInt(this.boardState.getTurn()) == 1)
        //     playerTurn.innerHTML = "RED"
        // else playerTurn.innerHTML = "BLACK"
        if (red == 0)
            playerTurn.innerHTML = "Black wins"
        else if (black == 0)
            playerTurn.innerHTML = "Red wins"
    }

}