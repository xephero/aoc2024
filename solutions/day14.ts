import * as readline from "node:readline";
import { readDayInput } from "../utility";

type Robot = {
    px: number;
    py: number;
    vx: number;
    vy: number;
    fx: number;
    fy: number;
}

function updateAllPositions(robots: Robot[], xMax: number, yMax: number, iterations: number) {
    for (const robot of robots) {
        const newX = (robot.px + robot.vx * iterations) % xMax;
        const newY = (robot.py + robot.vy * iterations) % yMax;
        robot.fx = newX >= 0 ? newX : newX + xMax;
        robot.fy = newY >= 0 ? newY : newY + yMax;
    }
}

export function day14() {
    const input = readDayInput(14);

    const robots = input.split('\n').map(l => {
        const coords = l.match(/p=([\-\d]+),([\-\d]+) v=([\-\d]+),([\-\d]+)/) ?? [];
        
        const robot: Robot = {
            px: parseInt(coords[1]),
            py: parseInt(coords[2]),
            vx: parseInt(coords[3]),
            vy: parseInt(coords[4]),
            fx: -1,
            fy: -1,
        }

        return robot;
    });

    const xMax = 101;
    const yMax = 103;
    const iterations = 100;

    updateAllPositions(robots, xMax, yMax, iterations);

    const horizLimit = Math.floor(xMax / 2);
    const vertLimit = Math.floor(yMax / 2);

    const topLeft = robots.filter(r => r.fx < horizLimit && r.fy < vertLimit).length;
    const topRight = robots.filter(r => r.fx > horizLimit && r.fy < vertLimit).length;
    const bottomLeft = robots.filter(r => r.fx < horizLimit && r.fy > vertLimit).length;
    const bottomRight = robots.filter(r => r.fx > horizLimit && r.fy > vertLimit).length;

    const safetyFactor = topLeft * topRight * bottomLeft * bottomRight;

    console.log(`Part 1: ${safetyFactor}`);

    console.log('Scanning for easter egg. Left/right to move time, q to quit');
    let seconds = 11;

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', (str, key) => {
        if (key.name === 'q')
            process.exit();

        else if (key.name === 'return') {
            console.log(`Part 2: ${seconds}`);
            process.exit();
        }

        else if (key.name === 'left')
            seconds -= 101;

        else if (key.name === 'right')
            seconds += 101;

        updateAllPositions(robots, xMax, yMax, seconds);

        const grid: string[][] = [];

        // Build the visual
        for (let y = 0; y < yMax; y++) {
            grid[y] = [];

            for (let x = 0; x < xMax; x++) {
                grid[y][x] = ' ';
            }
        }

        // Set the bots
        for (const robot of robots) {
            grid[robot.fy][robot.fx] = '█';
        }

        const output = grid.map(l => l.join('')).join('\n');

        console.log(output);
        console.log(`Seconds elapsed above: ${seconds}`);

    });
}