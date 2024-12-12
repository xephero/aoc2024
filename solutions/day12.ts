import { readDayInput } from "../utility";

type Direction = 'U' | 'R' | 'D' | 'L';

type Plot = {
    row: number;
    col: number;
    perimeter: Direction[];
}

type Side = {
    id: number;
    position: number;
    distances: number[];
    direction: Direction;
}

function shouldExplore(
    region: string,
    grid: string[][],
    row: number,
    col: number,
    plots: Plot[]
) {
    return (
        row >= 0 &&
        row < grid.length &&
        col >= 0 &&
        col < grid[0].length &&
        plots.every(p => !(p.row === row && p.col === col)) &&
        grid[row][col] === region
    );
}

function isWall(region: string, grid: string[][], row: number, col: number) {
    // There's a wall if it's the outer edge of the grid
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length)
        return true;

    // There's a wall if it's a separate region
    if (grid[row][col] !== region)
        return true;

    // Otherwise contiguous
    return false;
}

// Record which walls have a fence on them
function measurePerimeters(grid: string[][], row: number, col: number) {
    const region = grid[row][col];
    let perimeters: Direction[] = [];

    if (isWall(region, grid, row-1, col))
        perimeters.push('U');

    if (isWall(region, grid, row, col+1))
        perimeters.push('R');

    if (isWall(region, grid, row+1, col))
        perimeters.push('D');

    if (isWall(region, grid, row, col-1))
        perimeters.push('L');

    return perimeters;
}

function findPlots(
    region: string,
    grid: string[][],
    row: number,
    col: number,
    plots: Plot[]
) {
    // Add this plot if we haven't seen it yet
    if (plots.every(p => !(p.row === row && p.col === col)))
        plots.push({
            row,
            col,
            perimeter: measurePerimeters(grid, row, col),
        });


    // Explore up
    if (shouldExplore(region, grid, row-1, col, plots))
        findPlots(region, grid, row-1, col, plots);

    // Explore right
    if (shouldExplore(region, grid, row, col+1, plots))
        findPlots(region, grid, row, col+1, plots);

    // Explore down
    if (shouldExplore(region, grid, row+1, col, plots))
        findPlots(region, grid, row+1, col, plots);

    // Explore left
    if (shouldExplore(region, grid, row, col-1, plots))
        findPlots(region, grid, row, col-1, plots);
}

function countSides(plots: Plot[]): number {
    const sides: Side[] = [];

    let id: number = 0;

    for (const plot of plots) {
        for (const fence of plot.perimeter) {
            // Record position and distance, basically just direction-normalized coordinates
            const position = (['U','D'].includes(fence) ? plot.row : plot.col);
            const distance = (['R','L'].includes(fence) ? plot.row : plot.col);

            // Find all sides on the same row or col as this fence
            const evens = sides.filter(s => s.direction === fence && s.position === position);

            // If there are none of those, this is definitely a new side
            if (evens.length === 0) {
                sides.push({
                    id: id++,
                    direction: fence,
                    position: position,
                    distances: [distance],
                });

                // No further checks needed
                continue;
            }

            // If there are sides along this same axis, check if any are contiguous
            let found: Side[] = [];
            for (const even of evens) {
                if (even.distances.includes(distance-1) || even.distances.includes(distance+1)) {
                    even.distances.push(distance);
                    found.push(even);
                }
            }

            // If we didn't find any to add to, we add a new one
            if (found.length === 0) {
                sides.push({
                    id: id++,
                    direction: fence,
                    position: position,
                    distances: [distance],
                });
            }

            // If we found more than one, then that means we actually joined two previously separate walls!
            // Both of these will now have our new wall in it, so find one and merge it into the other
            if (found.length > 1) {
                // Remove the first wall
                const removedWall = sides.splice(sides.findIndex(s => s.id === found[0].id), 1)[0];

                // Add its distances to the next wall
                sides[sides.findIndex(s => s.id === found[1].id)].distances.push(...removedWall.distances);
            }
        }
    }

    return sides.length;
}

export function day12() {
    const input = readDayInput(12);

    const grid = input.split('\n').map(l => l.split(''));

    const mapped = new Set<string>();

    let rawPrice = 0;
    let bulkPrice = 0;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            // If we've already mapped this section, skip on to avoid double counting
            if (mapped.has(`${row},${col}`))
                continue;

            const plots: Plot[] = [];

            // Map the region into plots
            findPlots(grid[row][col], grid, row, col, plots);
            
            // Record the mapped coordinates
            for (const plot of plots)
                mapped.add(`${plot.row},${plot.col}`);

            // Calculate price
            const area = plots.length;
            const perimeter = plots.reduce((sum, plot) => sum += plot.perimeter.length, 0);

            rawPrice += area * perimeter;
            bulkPrice += area * countSides(plots);
        }
    }

    console.log(`Part 1: ${rawPrice}`);
    console.log(`Part 2: ${bulkPrice}`);
}