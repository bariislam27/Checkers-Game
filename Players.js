class AIRandom {
    constructor(config) {
        this.config = config
    }
    getAction(state) {
        let legalAction = BoardState.getLegalActions(this.config.player, state.getBoard());
        legalAction = legalAction[Math.floor(Math.random() * legalAction.length)]
        if (legalAction == undefined)
            return null
        return legalAction
    }
}

class AIGreedy {
    constructor(config) {
        this.config = config
    }
    getAction(state) {
        let legalAction = BoardState.getLegalActions(this.config.player, state.getBoard());
        let action = null
        legalAction.forEach((x) => {
            if (Math.abs(x[0].x - x[1].x) == 2)
                action = x
        })
        if (action == null && legalAction.length >= 1)
            return legalAction[Math.floor(Math.random() * legalAction.length)]
        return action
    }
}