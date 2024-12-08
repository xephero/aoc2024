import { readDayInput } from "../utility";

type Coordinate = {
    x: number,
    y: number,
};

type Direction = {
    x: -1 | 0 | 1,
    y: -1 | 0 | 1,
};

type Spot = {
    cx: number,
    cy: number,
    d: Direction,
};

// 0,0 is top left
const UP: Direction = {x: 0, y: -1}
const RIGHT: Direction = {x: 1, y: 0};
const DOWN: Direction = {x: 0, y: 1};
const LEFT: Direction = {x: -1, y: 0};

function getNextDirection(current: Direction = LEFT) {
    if (current === UP)
        return RIGHT;
    if (current === RIGHT)
        return DOWN;
    if (current === DOWN)
        return LEFT;

    return UP;
}

function simulateRun(initCoord: Coordinate, initDir: Direction, looper: Coordinate, grid: string[][]) {
    const c = structuredClone(initCoord);
    let d = initDir;
    const spots: Spot[] = [];

    while (c.x >= 0 && c.x < grid[0].length && c.y >= 0 && c.y < grid.length) {
        // we walked into an obstacle! or our placed loop candidate obstacle!
        if ((grid[c.y][c.x] === '#') || (looper.x == c.x && looper.y == c.y)) {
            // back up one space and turn
            c.x -= d.x;
            c.y -= d.y;
            d = getNextDirection(d);
        } else {
            // Were we here already?
            if (-1 !== spots.findIndex(s =>
                s.cx === c.x &&
                s.cy === c.y &&
                s.d === d
            ))
                return true;

            spots.push({cx: c.x, cy: c.y, d});
        }

        // walk forward in direction
        c.x += d.x;
        c.y += d.y;
    }

    return false;
}

export function day6() {
    const input = readDayInput(6);

    const grid = input.split('\n').map(l => l.split(''));

    let d: Direction = getNextDirection();
    let c: Coordinate = {x: 0, y: 0};

    // Find the little guy
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === "^") {
                c.x = x;
                c.y = y;
                break;
            }
        }
    }

    // Add the starting spot to a loop spot just to ensure that it doesn't get added later
    
    const loopSpots: Coordinate[] = [structuredClone(c)];

    // Mark starting point as traveled
    grid[c.y][c.x] = 'X';

    while (c.x >= 0 && c.x < grid[0].length && c.y >= 0 && c.y < grid.length) {

        // we walked into an obstacle!
        if (grid[c.y][c.x] === '#') {
            // back up one space and turn
            c.x -= d.x;
            c.y -= d.y;
            d = getNextDirection(d);
        }

        // we can walk forward
        else {
            grid[c.y][c.x] = 'X';

            // check for loopability and add if we haven't seen the spot yet
            const loop = {x: c.x + d.x, y: c.y + d.y};
            if (
                // the prospective obstacle is in-bounds
                loop.x >= 0 && loop.x < grid[0].length &&
                loop.y >= 0 && loop.y < grid.length &&

                // we haven't walked through it before (and so never would have gotten here in the first place)
                grid[loop.y][loop.x] != 'X' &&

                // this isn't already a spot we could put an obstacle for another loop route
                loopSpots.every(l => !(l.x === loop.x && l.y === loop.y)) &&

                // this does in fact call a loop
                simulateRun(c, d, loop, grid)
            ) {
                loopSpots.push(loop);
            }

            c.x += d.x;
            c.y += d.y;
        }
    }

    // Count up all the Xes
    let visited = 0;
    for (let y = 0; y < grid.length; y++)
        for (let x = 0; x < grid[0].length; x++)
            if (grid[y][x] === "X")
                visited += 1;

    // Remove the starting position
    loopSpots.shift();

    console.log(`Part 1: ${visited}`);
    console.log(`Part 2: ${loopSpots.length}`);

}