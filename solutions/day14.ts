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

function getStandardDeviation(robots: Robot[]) {
    const xValues = robots.map(r => r.fx);
    const yValues = robots.map(r => r.fy);
    
    const xMean = xValues.reduce((a,b) => a + b) / xValues.length;
    const yMean = yValues.reduce((a,b) => a + b) / yValues.length;

    const xSquares = xValues.map(x => Math.pow(x - xMean, 2)).reduce((a,b) => a + b);
    const ySquares = yValues.map(y => Math.pow(y - yMean, 2)).reduce((a,b) => a + b);

    const xStdDev = Math.sqrt(xSquares / (xValues.length - 1));
    const yStdDev = Math.sqrt(ySquares / (yValues.length - 1));

    return (xStdDev + yStdDev) / 2;
}

function getSafetyFactor(robots: Robot[], xMax: number, yMax: number) {
    const horizLimit = Math.floor(xMax / 2);
    const vertLimit = Math.floor(yMax / 2);

    const topLeft = robots.filter(r => r.fx < horizLimit && r.fy < vertLimit).length;
    const topRight = robots.filter(r => r.fx > horizLimit && r.fy < vertLimit).length;
    const bottomLeft = robots.filter(r => r.fx < horizLimit && r.fy > vertLimit).length;
    const bottomRight = robots.filter(r => r.fx > horizLimit && r.fy > vertLimit).length;

    return topLeft * topRight * bottomLeft * bottomRight;
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

    const safetyFactor = getSafetyFactor(robots, xMax, yMax);

    console.log(`Part 1: ${safetyFactor}`);

    let seconds = 0;
    let stdDev = getStandardDeviation(robots);

    while (stdDev > 20 && seconds < 10000) {
        seconds += 1;
        updateAllPositions(robots, xMax, yMax, seconds);
        stdDev = getStandardDeviation(robots);
    }

    console.log(`Possible christmas found at ${seconds} seconds. Manual scanning now`);
    console.log('Scanning for easter egg. Left/right to move time, enter to accept, q to quit');

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
            seconds -= 1;

        else if (key.name === 'right')
            seconds += 1;

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

        const stdDev = getStandardDeviation(robots);
        const safety = getSafetyFactor(robots, xMax, yMax);

        console.log(output);
        console.log(`${seconds} seconds, std dev ${stdDev}, safety ${safety}`);

    });
}