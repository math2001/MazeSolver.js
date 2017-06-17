"use strict";

class RenderMaze {

    static init() {
        this.cacheDOM()
        this.SQUARE_SIZE = 50
    }

    static cacheDOM() {
        this.canvas = document.querySelector('#canvas')
        this.context = this.canvas.getContext('2d')
    }

    static renderMaze(maze) {
        this.context.fillStyle = '#eee'
        this.context.fillRect(0, 0, this.SQUARE_SIZE * maze.width, this.SQUARE_SIZE * maze.height)
        let row, square
        for (var y = 0; y < maze.plan.length; y++) {
            row = maze.plan[y]
            for (var x = 0; x < row.length; x++) {
                square = row[x]
                if (square === CODES.wall) {
                    this.context.fillStyle = 'black'
                } else if (square === CODES.start) {
                    this.context.fillStyle = '#0f0'
                } else if (square === CODES.end) {
                    this.context.fillStyle = '#f00'
                }
                if (square !== CODES.path) {
                    this.context.fillRect(x * this.SQUARE_SIZE, y * this.SQUARE_SIZE, 
                                      this.SQUARE_SIZE, this.SQUARE_SIZE)
                }
            }
        }
    }

}

RenderMaze.init()
RenderMaze.renderMaze(new Maze(SIMPLE_MAZE))