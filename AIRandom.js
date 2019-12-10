
class AIRandom {
    constructor() {
    }
    getAction(state) {
        let legalActions = BoardState.getLegalActions(max, state.getBoard());
        return legalActions[Math.ceil(Math.random()*legalActions.length)];
    }
}