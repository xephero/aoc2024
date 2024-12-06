import { readDayInput } from "../utility";

type Coordinate = {
    x: number,
    y: number,
};

type Direction = {
    x: -1 | 0 | 1,
    y: -1 | 0 | 1,
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

    // Mark starting point as traveled
    grid[c.y][c.x] = 'X';

    while (c.x >= 0 && c.x < grid[0].length && c.y >= 0 && c.y < grid.length) {

        // we walked into an obstacle! back up and turn
        if (grid[c.y][c.x] === '#') {
            c.x -= d.x;
            c.y -= d.y;
            d = getNextDirection(d);
        }

        // we're clear! mark this spot as traveled
        else {
            grid[c.y][c.x] = 'X';
        }

        c.x += d.x;
        c.y += d.y;
    }

    // Count up all the Xes
    let visited = 0;
    for (let y = 0; y < grid.length; y++)
        for (let x = 0; x < grid[0].length; x++)
            if (grid[y][x] === "X")
                visited += 1;

    console.log(`Part 1: ${visited}`);
}