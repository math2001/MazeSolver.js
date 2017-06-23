"use strict";

const SYMBOLS = {
    start: '•',
    end: '○',
    wall: '#',
    explored: '·',
    path: '!'
}

function render(maze, paths, exploredPositions, CODES) {

    const plan = []
    let row;
    for (var i = 0; i < maze.length; i++) {
        row = []
        for (var j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === CODES.wall) {
                row.push(SYMBOLS.wall)
            } else if (maze[i][j] === CODES.start) {
                row.push(SYMBOLS.start)
            } else if (maze[i][j] === CODES.end) {
                row.push(SYMBOLS.end)
            } else {
                row.push(' ')
            }
        }
        plan.push(row)
    }

    for (var i = exploredPositions.length - 1; i >= 0; i--) {
        plan[exploredPositions[i][1]][exploredPositions[i][0]] = SYMBOLS.explored
    }

    for (var i = paths.length - 1; i >= 0; i--) {
        for (var j = paths[i].length - 1; j >= 0; j--) {
            plan[paths[i][j][1]][paths[i][j][0]] = SYMBOLS.path
        }
    }


    for (var i = 0; i < plan.length; i++) {
        // CSW: ignore
        console.log(plan[i].join(''))
    }

}

module.exports = function (CODES) {
    return function main(mazeSolver) {
        render(mazeSolver.maze.plan, [mazeSolver.solve('path')], mazeSolver.exploredPositions.map(pos => pos.toArray()), CODES)
    }
}