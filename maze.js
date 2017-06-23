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

    toArray() {
        return [this.x, this.y]
    }
}

class Maze {

    constructor(plan) {
        if (typeof plan === 'string') {
            plan = plan.trim().split('\n').map(bit => bit.trim().split('').map(nb => parseInt(nb)))
        }
        this.plan = plan
        this.height = this.plan.length
        this.width = this.plan[0].length
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

        this.startPosition = maze.getStartPosition().clone()
        this.currentPosition = this.startPosition.clone()
        this.exploredPositions = []
        this.crossways = []
        this.instructions = []
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
            if (this.crossways.length === 0) {
                return 'impossible'
            }
            const crossway = this.crossways.slice(-1)[0]
            crossway.instructions = []
            this.currentPosition = crossway.clone()
        }

        return this.explore()
    }

    solve(format='instructions') {
        const message = this.explore()
        if (message === 'got out') {
            if (format === 'instructions') {
                return this.instructions
            } else if (format === 'path') {
                return this._getPath()
            }
        } else if (message === 'impossible') {
            return 'impossible'
        } else {
            console.error(`Unexpected return value: "${message}"`)
            return []
        }
    }

    _getPath() {
        const positions = []
        this.instructions.reduce((position, move) => {
            const pos = [position[0] + move[0], position[1] + move[1]]
            positions.push(pos)
            return pos
        }, this.startPosition.toArray())
        return positions
    }

}


function mathMoveToWord(moves) {
    const englishMoves = []
    let move;
    for (let i = 0; i < moves.length; i++) {
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
    const noRepeatEnglishMoves = [
        [englishMoves[0], 1]
    ]
    for (let i = 1; i < englishMoves.length; i++) {
        if (englishMoves[i] === noRepeatEnglishMoves.slice(-1)[0][0]) {
            noRepeatEnglishMoves[noRepeatEnglishMoves.length-1][1]++
        } else {
            noRepeatEnglishMoves.push([englishMoves[i], 1])
        }
    }
    let string = []
    for (var i = 0; i < noRepeatEnglishMoves.length; i++) {
        string.push((noRepeatEnglishMoves[i][1] !== 1 ? noRepeatEnglishMoves[i][1] + ' ' : '')
                + noRepeatEnglishMoves[i][0])
    }
    return string.join(', ')
}


function main(mazes) {

    const solver = new MazeSolver(new Maze(mazes.COMPLEX_MAZE_2))
    const instructions = solver.solve()
    
    if (instructions === 'impossible') {
        // CSW: ignore
        console.log('→ impossible')
    } else {
        // CSW: ignore
        console.log('English instructions:', mathMoveToWord(instructions))
    }
}

if (typeof window === 'undefined') {

    const mazes = require('./mazes-code.js')
    const consoleRender = require('./console-render.js')(CODES)
    consoleRender(new MazeSolver(new Maze(mazes.COMPLEX_MAZE_2)))


}

