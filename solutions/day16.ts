import { readDayInput } from "../utility";

const DIRECTIONS = {
    'U': [-1, 0],
    'R': [0, 1],
    'D': [1, 0],
    'L': [0, -1],
}

let LOWEST = 999999;
let FINAL_ROUTE: string[] = [];

function rotateDir(dir: string, deg: number) {
    const cw = ['U', 'R', 'D', 'L', 'U'];
    const ccw = ['U', 'L', 'D', 'R', 'U'];

    if (deg === 90)
        return cw[cw.indexOf(dir)+1];

    if (deg === -90)
        return ccw[ccw.indexOf(dir)+1];

    throw new Error('Invalid degree in rotateDir');
}

function solveMaze(
    grid: string[][],
    explored: string[],
    row: number,
    col: number,
    dir: string = 'R',
    score: number = 0
): void {
    // If this is an explored space or a wall, bail out
    if (grid[row][col] === '#' || explored.includes(`${row},${col}`))
        return;

    // If this wouldn't be the lowest score route, bail out
    if (score >= LOWEST)
        return;

    const newExplored = [`${row},${col}`, ...explored];

    // If this is the end, add no score (the 1 for the step is added beforehand)
    if (grid[row][col] === 'E') {
        console.log(`end @ ${score} w/ ${newExplored.length} steps`);
        if (score < LOWEST) {
            LOWEST = score;
            FINAL_ROUTE = newExplored;
        }
        return;
    }

    // Otherwise get each turn direction
    const straight = DIRECTIONS[dir];
    const cwDir = rotateDir(dir, 90);
    const ccwDir = rotateDir(dir, -90);
    const cwTurn = DIRECTIONS[cwDir];
    const ccwTurn = DIRECTIONS[ccwDir];

    // Get the scores of each branch
    solveMaze(grid, newExplored, row + straight[0], col + straight[1], dir, score + 1);
    solveMaze(grid, newExplored, row + cwTurn[0], col + cwTurn[1], cwDir, score + 1001);
    solveMaze(grid, newExplored, row + ccwTurn[0], col + ccwTurn[1], ccwDir, score + 1001);

    return;
}

export function day16() {
    const input = readDayInput(16);

    const grid = input.split('\n').map(l => l.split(''));

    let startRow;
    let startCol;

    for (let row = 0; row < grid.length; row++)
        for (let col = 0; col < grid[0].length; col++)
            if (grid[row][col] === 'S') {
                startRow = row;
                startCol = col;
                break;
            }

    solveMaze(grid, [], startRow, startCol);

    console.log(`Part 1: ${LOWEST}`);
    
    
}