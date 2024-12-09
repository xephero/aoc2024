import { readDayInput } from "../utility";

export function day8() {
    const input = readDayInput(8);

    const grid = input.split('\n').map(l => l.split(''));

    const colMax = grid[0].length;
    const rowMax = grid.length;

    const soloAntinodes = new Set<string>();
    const multiAntinodes = new Set<string>();

    // Scan for origin signals
    for (let baseRow = 0; baseRow < rowMax; baseRow++) {
        for (let baseCol = 0; baseCol < colMax; baseCol++) {
            const freq = grid[baseRow][baseCol];

            if (freq === '.')
                continue;

            for (let scanRow = 0; scanRow < rowMax; scanRow++) {
                for (let scanCol = 0; scanCol < colMax; scanCol++) {
                    if (scanRow === baseRow && scanCol === baseCol)
                        continue;

                    if (grid[scanRow][scanCol] !== freq)
                        continue;

                    multiAntinodes.add(`${scanCol},${scanRow}`);

                    const rowOffset = baseRow - scanRow;
                    const colOffset = baseCol - scanCol;

                    let antiRow = baseRow + (baseRow - scanRow);
                    let antiCol = baseCol + (baseCol - scanCol);

                    if (antiRow >= 0 && antiRow < rowMax && antiCol >= 0 && antiCol < rowMax)
                        soloAntinodes.add(`${antiCol},${antiRow}`);

                    while (antiRow >= 0 && antiRow < rowMax && antiCol >= 0 && antiCol < rowMax) {
                        multiAntinodes.add(`${antiCol},${antiRow}`);
                        antiRow += rowOffset;
                        antiCol += colOffset;
                    }
                }
            }
        }
    }

    for (const node of multiAntinodes) {
        const nums = node.split(',').map(n => parseInt(n));
        grid[nums[1]][nums[0]] = '#';
    }

    console.log(grid.map(l => l.join('')).join('\n'));

    console.log(`Part 1: ${soloAntinodes.size}`);
    console.log(`Part 2: ${multiAntinodes.size}`);
}