import { readDayInput } from "../utility";

type Game = {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    px: number;
    py: number;
}

function findSolutions(game: Game): number[][] {
    // I confess: I didn't know about gaussian inversion when I started this.
    // Thanks AoC for teaching me about it!

    // Given the example
    // Button A: X+94, Y+34
    // Button B: X+22, Y+67
    // Prize: X=8400, Y=5400
    //
    // This can be modelled as a system of equations:
    // 94a + 22b = 8400
    // 34a + 67b = 5400
    //
    // This can be put into an array like so:
    // [ 94, 22, 8400 ] 
    // [ 34, 67, 5400 ]

    // We subtract the first row from the second so as to make that 34 into 0
    // Multiply all items in the first row by (34/94) and subtract
    // [ 94, 22, 8400 ]
    // [ 0, (67 - 34/94 * 22), 5400 - 34/94 * 8400 ]

    // This functionally gives us an equation like:
    // 0a + (bottom middle)b = (bottom right)
    
    // Solving this is easy: divide bottom right by bottom middle
    // It's then trivial to solve for b

    // We don't need to do *all* of that in generalized matrices.
    // Just enough for this specific problem.

    const bottomRight = (game.py - (game.ay / game.ax) * game.px);
    const bottomMiddle = (game.by - (game.ay / game.ax) * game.bx);

    // We can't reliably divide without js floating point weirdness
    const bPresses = Math.round(bottomRight / bottomMiddle);

    const remainingX = (game.px - (game.bx * bPresses))
    const aPresses = Math.round(remainingX / game.ax);

    // Check that rounded numbers actually produce results
    if (
        (aPresses * game.ax + bPresses * game.bx !== game.px) ||
        (aPresses * game.ay + bPresses * game.by !== game.py)
    )
        return [];    

    return [[aPresses, bPresses]];
}

function findMinTokens(solutions: number[][]) {
    const first = solutions.pop() ?? [-1,-1];

    let minTokens = 3 * first[0] + first[1];

    for (const solution of solutions)
        minTokens = Math.min(minTokens, 3 * solution[0] + solution[1]);

    return minTokens;
}

export function day13() {
    const input = readDayInput(13);

    const games = input.split('\n\n').map(txt => {
        const matches = txt.match(/Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/) ?? [];

        const game: Game = {
            ax: parseInt(matches[1]),
            ay: parseInt(matches[2]),
            bx: parseInt(matches[3]),
            by: parseInt(matches[4]),
            px: parseInt(matches[5]),
            py: parseInt(matches[6]),
        };

        return game;        
    });

    let naiveTokens = 0;
    let convertedTokens = 0

    for (const game of games) {
        const naiveSolutions = findSolutions(game);
        const naiveMinTokens = findMinTokens(naiveSolutions);

        game.px += 10000000000000;
        game.py += 10000000000000;

        const convertedSolutions = findSolutions(game);
        const convertedMinTokens = findMinTokens(convertedSolutions);

        naiveTokens += naiveMinTokens > 0 ? naiveMinTokens : 0;
        convertedTokens += convertedMinTokens > 0 ? convertedMinTokens : 0;
    }

    console.log(`Part 1: ${naiveTokens}`);
    console.log(`Part 2: ${convertedTokens}`);
}