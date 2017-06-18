"use strict";


// SIMPLE_MAZE → only one posibilty

const mazes = {

    SIMPLE_MAZE: `
    0222223
    1211121
    1212121
    1212111
    1112222
    `,
    // there is always only 2 possible movement: the one you were before, and an other one
    COMPLEX_EASY_MAZE: `
    022
    113
    122
    122
    `,
    // there can be more than 2 possibilities

    COMPLEX_MAZE_1: `
    011122221
    122122211
    112221112
    211221222
    211111111
    222222213
    `,

    COMPLEX_MAZE_2: `
    01112211122
    12212212123
    11111111111
    `,

    COMPLEX_EASY_MAZE_1: `
    0211111
    1221222
    1111111
    1222221
    1211111
    1222122
    1211113
    `,

    IMPOSSIBLE_MAZE_1: `
    011121
    122121
    111123
    `
}

if (typeof window === 'undefined') {
    module.exports = mazes
}