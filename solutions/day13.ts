import { readDayInput } from "../utility";

type Game = {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    px: number;
    py: number;
}

function findSolution(game: Game): number[] {
    // I confess: I didn't know about gaussian inversion when I started this.
    // Thanks AoC for teaching me about it!

    // Given the example
    // Button A: X+94, Y+34
    // Button B: X+22, Y+67
    // Prize: X=8400, Y=5400

    // This can be modeled as a system of equations:
    // 94a + 22b = 8400
    // 34a + 67b = 5400

    // To solve this easily, we want to eliminate one variable:
    // 0a + ??b = ??

    // We can put the values into an array like so:
    // [ 94, 22, 8400 ] 
    // [ 34, 67, 5400 ]

    // We subtract the first row from the second, so as to make that 34 into 0
    // Multiply all items in the first row by (34/94) and subtract that value from the second row value
    // [ 94, 22, 8400 ]
    // [ 0, (67 - 34/94 * 22), 5400 - 34/94 * 8400 ]

    // This functionally gives us an equation like:
    // 0a + (bottom middle)b = (bottom right)

    // Solving this is easy: divide bottom right by bottom middle
    // b = (bottom right) / (bottom middle)

    // Now that we have b, we can solve for a with standard algebra.

    // We don't need to do *all* of that in generalized matrices though.
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

    return [aPresses, bPresses];
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
        const naiveSolution = findSolution(game);

        game.px += 10000000000000;
        game.py += 10000000000000;

        const convertedSolution = findSolution(game);

        if (naiveSolution.length > 0)
            naiveTokens += 3 * naiveSolution[0] + naiveSolution[1];

        if (convertedSolution.length > 0)
            convertedTokens += 3 * convertedSolution[0] + convertedSolution[1];
    }

    console.log(`Part 1: ${naiveTokens}`);
    console.log(`Part 2: ${convertedTokens}`);
}