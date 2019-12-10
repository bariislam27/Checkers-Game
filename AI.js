const INFINITY = 10000,
    NINFINITY = -INFINITY


class AI {
    constructor(config) {
        this.vals = 0

        this.config = config;

        this.searchStartTime = 0;
        this.currentMaxDepth = null;

        // overall best action and its value
        this.vAction = null;
        this.bestActionValue = NINFINITY - 1;

        // iteration wise best action and its value
        this.currentBestAction = null;
        this.currentBestActionValue = NINFINITY - 1;
        this.maxPlayer = null;

        this.evals = []
    }
    getAction(state) {
        // console.log(this.config,state)
        return this.IDAlphaBeta(state);
    }
    eval = function (state) {
        let winner = BoardState.winner(state);
        // console.log("winner ", winner)
        if (winner === this.maxPlayer) {
            return INFINITY;
        } else if (winner === 0) {
            return this.heuristic(state)(this.maxPlayer);
        } else if (winner === -this.maxPlayer) {
            return NINFINITY;
        }
    }

    heuristic = (board)=>(player) => {
        let humanPieces = 0,
            humanKings = 0,
            humanPositions = 0,
            computerPieces = 0,
            computerKings = 0,
            computerPositions = 0,
            finalSum = 0;
        board.forEach((x, i) => {
            x.forEach((y, j) => {
                if (parseInt(y)==-player) //human
                {
                    humanPieces++
                    if (y == -1.1) {
                        humanKings++
                    }
                    if (i == 0 || i == 7 || j == 0 || j == 7) {
                        humanPositions += 5
                    } else humanPositions += 3
                } else if (parseInt(y)==player) {
                    computerPieces++
                    if (y == 1.1) {
                        computerKings++
                    }
                    if (i == 0 || i == 7 || j == 0 || j == 7) {
                        computerPositions += 5
                    } else computerPositions += 3
                }
            })
        })
        // console.log("Human and computer",humanPieces,computerPieces)
        let kingsDifference, posDifference, pieceDifference;
        kingsDifference = computerKings - humanKings;
        pieceDifference = computerPieces - humanPieces;
        posDifference = computerPositions - humanPositions;

        let weights = [2, 20, 300],
            vals = [posDifference, kingsDifference, pieceDifference],
            returnValue = 0;
            // console.log(vals)
        weights.forEach((w, i) => {
            returnValue += w * vals[i];
        })
        return returnValue
    }

    IDAlphaBeta = function (state) {
        this.searchStartTime = performance.now();
        this.currentMaxDepth = 1;
        this.bestAction = null;
        this.currentBestOverallActionVal = NINFINITY - 1;
        this.maxPlayer = this.config.player;

        try {
            while (true) {
                this.evals = []
                this.currentBestAction = null;
                this.currentBestActionValue = NINFINITY - 1;
                this.AlphaBeta(state, NINFINITY, INFINITY, 0, this.maxPlayer);
                // console.log("Eval max", Math.max.apply(Math, this.evals))
                // console.log(this.evals,this.currentMaxDepth)
                this.currentMaxDepth++;
            }
        } catch (err) {
            // console.log(err)
        }
        // console.log("currentBestOverallAction", this.currentBestOverallActionVal)
        // return the best action found
        // console.log(this.vals)
        // console.log(this.bestAction)/
        if (this.bestAction !== null)
            return this.bestAction
        return this.currentBestAction;
    }

    TimeOutException = () => {
        throw new Error();
    }

    haveJumpMove() {

    }

    AlphaBeta = function (state, alpha, beta, depth, max) {

        // get array of legal actions
        let legalActions = BoardState.getLegalActions(max, state.getBoard());

        // console.log(legalActions)   
        // if maxdepth or time is 0 then randomly select
        // a legal action
        // if ((depth === 0 && this.currentBestAction === null)) {
        //     this.currentBestAction = legalActions[Math.floor(Math.random() * legalActions.length)];
        // }
        // check time till now
        let timeElapsed = performance.now() - this.searchStartTime;

        // if overtime or overDepth then  get out of recursion
        if (this.config.maxDepth != 0 && this.currentMaxDepth > this.config.maxDepth) {
            throw new Error("Max Depth reached");
        }
        if (this.config["Time limit(ms)"] != 0 && timeElapsed > this.config["Time limit(ms)"]) {
            throw new Error("Max time reached");
        }

        // if (timeElapsed > 500) {
        //     throw new Error("stopped due to debugging");
        // }

        //console.log("depth ",depth)
        // evaluating state
        let evalV = this.eval(state.getBoard());
        // console.log(this.evals)
        this.evals.push(evalV)
        if (depth >= this.currentMaxDepth || legalActions.length === 0 || evalV === INFINITY || evalV === NINFINITY) {
            return evalV;
        }

        // setting up basic variables
        let v;
        let vAction;
        // max player
        if (max==this.maxPlayer) {
            v = NINFINITY;
            for (let i = 0; i < legalActions.length; i++) {
                //console.log(legalActions[i])
                let deepCopiedState = BoardState.copy(state.getBoard());
                BoardState.doAction(legalActions[i], deepCopiedState.getBoard());
                // console.log("Max: ", max)
                // deepCopiedState.getBoard().forEach(element => {
                //     console.log(element)
                // });

                let vprime = this.AlphaBeta(deepCopiedState, alpha, beta, depth + 1, -max);
                // console.log("Max: ","V ", v, "Vprime ", vprime)
                if (vprime > v) {
                    v = vprime;
                    vAction = legalActions[i];
                    // console.log("Max: ","V ", v, "Vprime ", vprime)
                    if (depth==0 &&v > this.currentBestActionValue) {
                        this.currentBestActionValue = v;
                        this.currentBestAction = vAction;
                        if (vprime == INFINITY)
                            throw new Error("Found winning action");
                    }
                }
                if (vprime >= beta) return v;
                if (vprime > alpha) alpha = vprime;
            }
        }
        // minimizing player
        else if (max !=this.maxPlayer) {
            v = INFINITY;
            for (let i = 0; i < legalActions.length; i++) {
                //console.log(legalActions[i])
                let deepCopiedState = BoardState.copy(state.getBoard());
                BoardState.doAction(legalActions[i], deepCopiedState.getBoard());
                // printing
                // console.log("Min: ", max)
                // deepCopiedState.getBoard().forEach(element => {
                //     console.log(element)
                // });

                let vprime = this.AlphaBeta(deepCopiedState, alpha, beta, depth + 1, -max);

                // console.log("Min: ","V ", v, "Vprime ", vprime)
                if (vprime < v) {
                    v = vprime;
                    vAction = legalActions[i];
                }
                if (vprime <= alpha) return v;
                if (vprime < beta) beta = vprime;
            }
        }

        //This iteration of AlphaBeta is finished, so update the current best overall action
        if (depth === 0 && this.currentBestActionValue > this.currentBestOverallActionVal) {
            this.currentBestOverallActionVal = this.currentBestActionValue;
            this.bestAction = this.currentBestAction;
        }
        return v;
    }
}