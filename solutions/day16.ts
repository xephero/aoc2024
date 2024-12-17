import { readDayInput } from "../utility";

const DIRECTIONS = {
    'U': [-1, 0],
    'R': [0, 1],
    'D': [1, 0],
    'L': [0, -1],
    'A': [0, 0],
};

const TURNS = {
    'U': ['R', 'L'],
    'R': ['D', 'U'],
    'D': ['L', 'R'],
    'L': ['U', 'D'],
    'A': ['A', 'A'],
}

type AtlasEntry = {
    U?: number;
    R?: number;
    D?: number;
    L?: number;
};

function backTraceMaze(
    grid: string[][],
    atlas: AtlasEntry[][],
    row: number,
    col: number,
    from: string = 'A',
    stack: number = 0,
) {
    const spot = grid[row][col];

    // Hit a wall, end the branch
    if (spot === '#')
        return;

    const entry = atlas[row][col];
    const [moveRow, moveCol] = DIRECTIONS[from];
    const [cwTurn, ccwTurn] = TURNS[from];
    const aheadEntry = atlas[row+moveRow][col+moveCol];

    if (spot === 'E') {
        // If this is our first time at the end, make the static ending atlas and explore every direction
        if (entry === undefined) {
            atlas[row][col] = { U: 0, R: 0, D: 0, L: 0 };
            backTraceMaze(grid, atlas, row - DIRECTIONS.U[0], col - DIRECTIONS.U[1], 'U', stack+1);
            backTraceMaze(grid, atlas, row - DIRECTIONS.R[0], col - DIRECTIONS.R[1], 'R', stack+1);
            backTraceMaze(grid, atlas, row - DIRECTIONS.D[0], col - DIRECTIONS.D[1], 'D', stack+1);
            backTraceMaze(grid, atlas, row - DIRECTIONS.L[0], col - DIRECTIONS.L[1], 'L', stack+1);
            return;
        }
        // Otherwise, we've looped around back to it, cut the branch
        else
            return;
    }

    // If this is a normal tile, update the atlas
    else if (spot === '.' || spot === 'S') {
        // Special handling for starting space to include the extra turn
        const initialTurn = (spot === 'S' && from !== 'R') ? 1000 : 0;

        // Get the score if we take the optimal route through the next tile
        const score = initialTurn + Math.min(
            (aheadEntry[from] ?? 999999) + 1,
            (aheadEntry[cwTurn] ?? 999999) + 1001,
            (aheadEntry[ccwTurn] ?? 999999) + 1001
        );

        // Useless branch if we get here
        if (score > 80000 || stack > 3000)
            return;

        // An atlas entry tells us what the lowest score route is from this space to the end.
        // The score in it does not include the potential need to turn to enter it
        // i.e., if entry['R'] = 12345, that means that's the score if you enter it already facing right
        // If you enter it from below or above, that would mean it's 13346 from those prior tiles
        // (and 13345 from this one)

        if (entry !== undefined) {
            // No route recorded in this direction yet
            if (!(from in entry))
                entry[from] = score;

            // If there's a better route to the end from here than the branch we're on, stop the branch
            else if (entry[from] <= score)
                return;

            // If there's an existing route but our branch is better, overwrite it
            else if (from in entry && entry[from] > score)
                atlas[row][col][from] = score;
        }

        // If there's no entry at all, just create it with this score
        else {
            atlas[row][col] = {};
            atlas[row][col][from] = score;
        }
    }

    // If this is the start spot, stop the branch
    if (spot === 'S')
        return;

    // Backtrace going straight
    backTraceMaze(grid, atlas, row - DIRECTIONS[from][0], col - DIRECTIONS[from][1], from, stack+1);

    // Backtrace from a clockwise turn (e.g., if from=R, do row-1 and say from=D) (cw D,ccw U)
    backTraceMaze(grid, atlas, row - DIRECTIONS[cwTurn][0], col - DIRECTIONS[cwTurn][1], cwTurn, stack+1);

    // Backtrace from a counterclockwise turn
    backTraceMaze(grid, atlas, row - DIRECTIONS[ccwTurn][0], col - DIRECTIONS[ccwTurn][1], ccwTurn, stack+1);
}

function countTiles(grid: string[][], atlas: AtlasEntry[][], row: number, col: number, to: string = 'R') {
    if (grid[row][col] === 'E' || grid[row][col] === 'O') {
        grid[row][col] = 'O';
        return;
    }

    grid[row][col] = 'O';

    const entry = atlas[row][col];

    let cwDir = TURNS[to][0];
    let ccwDir = TURNS[to][1];

    let forward = entry[to] ?? 999999;
    let cwTurn = 1000 + (entry[cwDir] ?? 999999);
    let ccwTurn = 1000 + (entry[ccwDir] ?? 999999);

    let lowest = Math.min(forward, cwTurn, ccwTurn);

    if (lowest === 999999)
        return;

    if (forward === lowest)
        countTiles(grid, atlas, row + DIRECTIONS[to][0], col + DIRECTIONS[to][1], to);

    if (cwTurn === lowest)
        countTiles(grid, atlas, row + DIRECTIONS[cwDir][0], col + DIRECTIONS[cwDir][1], cwDir);

    if (ccwTurn === lowest)
        countTiles(grid, atlas, row + DIRECTIONS[ccwDir][0], col + DIRECTIONS[ccwDir][1], ccwDir);
}

export function day16() {
    const input = readDayInput(16);

    const grid = input.split('\n').map(l => l.split(''));

    let startRow;
    let startCol;
    let endRow;
    let endCol;

    let atlas: AtlasEntry[][] = [];

    for (let row = 0; row < grid.length; row++) {
        // Initialize atlas rows
        atlas[row] = [];
        for (let col = 0; col < grid[0].length; col++) {
            const location = grid[row][col];
            if (location === 'S') {
                startRow = row;
                startCol = col;
            } else if (location === 'E') {
                endRow = row;
                endCol = col;
            }
        }
    }

    backTraceMaze(grid, atlas, endRow, endCol);


    const startAtlas = atlas[startRow][startCol];
    const lowScore = Math.min(
        startAtlas?.U ?? 9999999,
        startAtlas?.R ?? 9999999,
        startAtlas?.D ?? 9999999,
        startAtlas?.L ?? 9999999
    );

    console.log(`Part 1: ${lowScore}`);

    
    countTiles(grid, atlas, startRow, startCol);

    const totalTiles = grid.reduce((rSum, r) => rSum += r.reduce((cSum, c) => cSum += (c === 'O' ? 1 : 0), 0), 0);

    console.log(`Part 2: ${totalTiles}`);
}