"use strict";

// 0 is where you start
// 1 is where you can go
// 2 is a wall
// 3 is where you have to go (the finish line)

const MAZE = [
    [0, 2, 2, 2, 2, 2, 3],
    [1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 1],
    [1, 1, 1, 2, 2, 2, 2]
]

class Maze {

    constructor(maze) {
        // maze is an array of array
        this.maze = maze
        this.height = this.maze.length
        this.width = this.maze[0].length
    }

}

class MazeSolver {

    constructor(maze) {
        // maze is an instance of a Maze
        this.maze = maze
    }

}