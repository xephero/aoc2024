import { readDayInput } from "../utility";

function getPeaks(grid: number[][], row: number, col: number, target: number, from: string = "A"): string[] {
    let peaks: string[] = [];

    if (grid[row][col] === target) {
        // End of the trail, add a point!
        if (target === 9) {
            return [JSON.stringify([row,col])];
        }

        // look in each direction that we didn't just arrive from
        if (from !== "U" && row > 0)
            peaks = peaks.concat(getPeaks(grid, row-1, col, target+1, "D"));

        if (from !== "R" && col+1 < grid[0].length)
            peaks = peaks.concat(getPeaks(grid, row, col+1, target+1, "L"));

        if (from !== "D" && row+1 < grid.length)
            peaks = peaks.concat(getPeaks(grid, row+1, col, target+1, "U"));

        if (from !== "L" && col > 0)
            peaks = peaks.concat(getPeaks(grid, row, col-1, target+1, "R"));

        return peaks;
    }

    // Target not found, return empty set
    return peaks;
}

export function day10() {
    const input = readDayInput(10);

    const grid = input.split('\n').map(l => l.split('').map(c => parseInt(c)));

    let score = 0;
    let rating = 0;

    for (let row = 0; row < grid.length; row++)
        for (let col = 0; col < grid[0].length; col++)
            if (grid[row][col] === 0) {
                const peaks = getPeaks(grid, row, col, 0);
                rating += peaks.length;
                score += (new Set(peaks)).size;
            }

    console.log(`Part 1: ${score}`);
    console.log(`Part 1: ${rating}`);
}