"use strict";

// 0 is where you start
// 1 is where you can go
// 2 is a wall
// 3 is where you have to go (the finish line)

// SIMPLE_MAZE → only one posibilty


const CODES = {
    start: 0,
    path: 1,
    wall: 2,
    end: 3
}

const SIMPLE_MAZE = [
    [0, 2, 2, 2, 2, 2, 3],
    [1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 1],
    [1, 1, 1, 2, 2, 2, 2]
]

class Position {

    // just a class to use words instead of arrays

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

    isPositive() {
        return this.x >= 0 && this.y >= 0
    }

    sameAs(position) {
        return position instanceof Position && position.x === this.x && position.y === this.y
    }


}

class Maze {

    constructor(maze) {
        // maze is an array of arrays of caseCodes
        this.maze = maze
        this.height = this.maze.length
        this.width = this.maze[0].length

        
    }

    getStartPosition() {
        for (var i = this.maze.length - 1; i >= 0; i--) {
            for (var j = this.maze[i].length - 1; j >= 0; j--) {
                if (this.maze[i][j] === CODES.start) {
                    return new Position(j, i)
                } 
            }
        }
        throw new Error("The maze is invalid, there is no starting position (0)")
    }

    caseCodeFor(position) {
        if (!position.isPositive()) {
            return null
        }
        return this.maze[position.y][position.x]
    }

    getPositionAround(position) {
        // in a clockwise direction
        return [
            position.clone().move(0, -1),
            position.clone().move(1, 0),
            position.clone().move(0, 1),
            position.clone().move(-1, 0),
        ]
    } 

}

class MazeSolver {

    constructor(maze) {
        // maze is an instance of a Maze
        this.maze = maze
        this.currentPosition = this.maze.getStartPosition()
        this.instructions = []
    }

    getOut() {
        // move the perso to the case that is a path and call itself again
        // or stop if it is on the finish line
        const moves = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ]
        let caseCode, move, position
        for (let i = moves.length - 1; i >= 0; i--) {
            move = moves[i]
            position = this.currentPosition.clone().move(...move)
            caseCode = this.maze.caseCodeFor(position)
            if (caseCode === CODES.end || caseCode === CODES.path && 
                // so that we don't go back
                !position.sameAs(this.previousPosition)) {
                this.previousPosition = this.currentPosition.clone()
                this.currentPosition.move(...move)
                this.instructions.push(move)
                if (caseCode === CODES.end) {
                    return this.gotOut()
                } else {
                    return this.getOut()
                }
            }
            
        }
    }

    gotOut() {
        return this.instructions
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
    return englishMoves
}

function main() {
    const solver = new MazeSolver(new Maze(SIMPLE_MAZE))
    console.log(mathMoveToWord(solver.getOut()).join('\n'))
}

main()