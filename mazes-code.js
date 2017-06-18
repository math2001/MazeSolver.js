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
    `,

    VICIOUS_1: `
    02111213
    12121212
    12121112
    12122212
    11111112
    `,

    VICIOUS_2: `
    2221111
    0121221
    2111111
    2221221
    2221113
    `,

    VICIOUS_3: `
    211111
    112221
    122221
    011111
    122222
    111113
    `,

    VICIOUS_4: `
    011121112
    122121211
    121121111
    122221221
    111111111
    222221222
    111111111
    121222122
    111111111
    222222221
    311111111
    `
}

if (typeof window === 'undefined') {
    module.exports = mazes
}