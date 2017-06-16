"use strict";

// 0 is where you start
// 1 is where you can go
// 2 is a wall
// 3 is where you have to go (the finish line)

// SIMPLE_MAZE → only one posibilty

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
        for (var i = maze.length - 1; i >= 0; i--) {
            for (var j = maze[i].length - 1; j >= 0; j--) {
                if (maze[i][j] === 0) {
                    return new Position(j, i)
                } 
            }
        }
        throw new Error("The maze is invalid, there is no starting position (0)")
    }

    codeCaseFor(position) {
        return this.maze[position.y][position.x]
    }

    getPositionAround(position) {
        // return 4 pairs: [position, caseCode]: above, below, on the left, and on the right
        const above = position.clone().move(0, -1),
              below = position.clone().move(0, 1),
              left = position.clone().move(-1, 0),
              right = position.clone().move(1, 0)
        return [
            [above, this.codeCaseFor(above)],
            [below, this.codeCaseFor(below)],
            [left, this.codeCaseFor(left)],
            [right, this.codeCaseFor(right)],
        ]
    } 

}

class MazeSolver {

    constructor(maze) {
        // maze is an instance of a Maze
        this.maze = maze
    }

}