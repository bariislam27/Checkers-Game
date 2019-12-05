const board = document.getElementById("board")

class Game {
    constructor(playerNum, score) {
        // state board
        this.boardState = new BoardState()
        this.selected = [null, null]
            // gui board, only contains the  circles
        this.guiState = this.twoDArray(8)

        // contains all the rectangles
        this.checkersBoard = [];
        this.two = new Two({
            width: window.innerHeight * 0.8,
            height: window.innerHeight * 0.8,
        }).appendTo(board);
        this.setUpSvgElements();
        this.addOnClickToElements()
        console.log(this.checkersBoard)
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
        let size = 90;
        for (let i = 0; i < state.length; i++) {
            let checkersBoardRow = []
            for (let j = 0; j < state[i].length; j++) {
                let rec = t.makeRectangle(i * size + size / 1.5, j * size + size / 1.5, size, size);
                if ((i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0))
                    rec.fill = "#444"
                checkersBoardRow.push(rec);
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

                this.checkersBoard[i][j]._renderer.elem.setAttribute("pos", `${i}_${j}`);
                this.checkersBoard[i][j]._renderer.elem.onclick = (e) => {
                    let x = e.target.getAttribute("pos")[0],
                        y = e.target.getAttribute("pos")[2]

                    console.log(x, y)
                    if (this.selected[0] != null)
                        this.guiState[this.selected[0]][this.selected[1]].remove();
                    this.two.update();
                }
            }
        }

        this.two.update();
    }

    getTwoVariable() {
        return this.two;
    }

}