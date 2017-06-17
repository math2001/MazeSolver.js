"use strict";


// 0 is where you start
// 1 is where you can go
// 2 is a wall
// 3 is where you have to go (the finish line)



const CODES = {
    start: 0,
    path: 1,
    wall: 2,
    end: 3
}

// SIMPLE_MAZE → only one posibilty

const SIMPLE_MAZE = `
0222223
1211121
1212121
1212111
1112222
`


// there is always only 2 possible movement: the one you were before, and an other one
const COMPLEX_EASY_MAZE = `
022
113
122
122
`

// there can be more than 2 possibilities

const COMPLEX_MAZE = `
011122221
122122211
112221112
211221222
211111111
222222213
`

const COMPLEX_EASY_MAZE_1 = `
0211111
1221222
1111111
1222221
1211111
1222122
1211113
`

class Position {

    // just a class to use words instead of arrays

    // the following attributes can be set by other classes to a 'Position' instance:
    // - squareCode        (int)
    // - explored          (bool)
    // - moveNeeded        (Array of ints)
    // - instructionFromIt (Array of arrays of ints)
    // - isCrossway        (bool)

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    clone() {
        return new Position(this.x, this.y)
    }

    move(x, y) {
        this.x += x
        this.y += y
        return this
    }

    sameAs(position) {
        return position instanceof Position && position.x === this.x && position.y === this.y
    }

    inspect() {
        return `<Pos ${this.x},${this.y}>`
    }

    toString() {
        return this.inspect()
    }
}

class Maze {

    constructor(plan) {
        if (typeof plan === 'string') {
            plan = plan.trim().split('\n').map(bit => bit.split('').map(nb => parseInt(nb)))
        }
        this.plan = plan
    }

    isInPlan(position) {
        return position.y >= 0 && position.y < this.plan.length
        && position.x >= 0 && position.x < this.plan[0].length
    }

    squareCodeFor(position) {
        if (!this.isInPlan(position)) return null
            return this.plan[position.y][position.x]
    }

    getStartPosition() {
        for (var i = this.plan.length - 1; i >= 0; i--) {
            for (var j = this.plan[i].length - 1; j >= 0; j--) {
                if (this.plan[i][j] === CODES.start) {
                    return new Position(j, i)
                } 
            }
        }
        throw new Error("The maze is invalid, there is no starting position (0)")
    }
}

class MazeSolver {

    constructor(maze) {
        this.maze = maze

        this.currentPosition = maze.getStartPosition().clone()
        this.exploredPositions = []
        this.crossways = []
        this.instructions = []
        this.callCount = 0
    }

    hasExplored(position, isCrossway=false) {
        for (var i = this.exploredPositions.length - 1; i >= 0; i--) {
            if (this.exploredPositions[i].sameAs(position) && !(isCrossway === true && this.exploredPositions[i].isCrossway !== true)) {
                return true
            }
        }
        return false
    } 

    getPotentialPositionsAround(position) {
        // returns a list of positions around 'position' where it is possible to go, and that
        // haven't been explored yet
        const moves = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ]

        let move, targetPosition, squareCode, possibleDirections = []
        for (var i = moves.length - 1; i >= 0; i--) {
            move = moves[i]
            targetPosition = this.currentPosition.clone().move(...move)
            squareCode = this.maze.squareCodeFor(targetPosition)
            if ((squareCode === CODES.path || squareCode === CODES.end)
                && !this.hasExplored(targetPosition)) {
                targetPosition.squareCode = squareCode
                targetPosition.moveNeeded = move
                possibleDirections.push(targetPosition)
            }
        }
        return possibleDirections
    }

    moveTo(position) {
        const instructionRecoreder = (this.crossways.slice(-1)[0] || this)
        if (instructionRecoreder.instructions === undefined) {
            instructionRecoreder.instructions = []
        }
        instructionRecoreder.instructions.push(position.moveNeeded)

        this.exploredPositions.push(position)
        this.currentPosition.move(...position.moveNeeded)
        this.currentPosition.isCrossway = false
    }

    explore() {
        this.callCount++
        if (this.callCount > 50) {
            return 'call count stop'
        }
        let potentialPositionsAround = this.getPotentialPositionsAround(this.currentPosition)

        for (var i = potentialPositionsAround.length - 1; i >= 0; i--) {
            if (this.maze.squareCodeFor(potentialPositionsAround[i]) === CODES.end) {
                this.moveTo(potentialPositionsAround[i])
                this.crossways.map(crossway => this.instructions.push(...crossway.instructions))

                return 'got out'
            }
        }

        if (potentialPositionsAround.length === 1) {
            this.moveTo(potentialPositionsAround[0])
        }

        else if (potentialPositionsAround.length >= 2) {
            this.currentPosition.isCrossway = true

            if (!this.hasExplored(this.currentPosition, true)) {
                this.crossways.push(this.currentPosition.clone())
            } else {
                potentialPositionsAround = this.getPotentialPositionsAround(this.crossways.slice(-1)[0]).slice(0)
            }
            this.moveTo(potentialPositionsAround[0])
        }

        else {
            if (this.crossways.slice(-1)[0].sameAs(this.currentPosition)) {
                this.crossways.pop()
            }
            const crossway = this.crossways.slice(-1)[0]
            crossway.instructions = []
            this.currentPosition = crossway.clone()
        }

        return this.explore()
    }

    solve() {
        const message = this.explore()
        if (message === 'got out') {
            return this.instructions
        } else {
            console.error(`Unexpected return value: "${message}"`)
            return []
        }
    }
}


function mathMoveToWord(moves) {
    const englishMoves = []
    let move;
    for (var i = 0; i < moves.length; i++) {
        move = moves[i]
        if (!(move instanceof Array) || move.length !== 2) {
            englishMoves.push('?')
        } else if (move[0] === 0 && move[1] === -1) {
            englishMoves.push('up')
        } else if (move[0] === 0 && move[1] === 1) {
            englishMoves.push('down')
        } else if (move[0] === -1 && move[1] === 0) {
            englishMoves.push('left')
        } else if (move[0] === 1 && move[1] === 0) {
            englishMoves.push('right')
        } else {
            englishMoves.push('other')
        }
    }
    return englishMoves.join(', ')
}

function main() {

    const solver = new MazeSolver(new Maze(COMPLEX_MAZE))
    const instructions = solver.solve()
    // CSW: ignore
    console.log('English instructions:', mathMoveToWord(instructions))

}

main()