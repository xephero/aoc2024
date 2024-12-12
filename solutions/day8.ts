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

            // Given each origin, scan the field for matching signals
            for (let scanRow = 0; scanRow < rowMax; scanRow++) {
                for (let scanCol = 0; scanCol < colMax; scanCol++) {

                    // Origin doesn't count
                    if (scanRow === baseRow && scanCol === baseCol)
                        continue;

                    // Skip non-matches
                    if (grid[scanRow][scanCol] !== freq)
                        continue;

                    // Every antenna itself is an antinode for multi
                    multiAntinodes.add(`${scanCol},${scanRow}`);

                    const rowOffset = baseRow - scanRow;
                    const colOffset = baseCol - scanCol;

                    let antiRow = baseRow + (baseRow - scanRow);
                    let antiCol = baseCol + (baseCol - scanCol);

                    // Add the first one for solo
                    if (antiRow >= 0 && antiRow < rowMax && antiCol >= 0 && antiCol < colMax)
                        soloAntinodes.add(`${antiCol},${antiRow}`);

                    // Add the first and all others for multi
                    while (antiRow >= 0 && antiRow < rowMax && antiCol >= 0 && antiCol < colMax) {
                        multiAntinodes.add(`${antiCol},${antiRow}`);
                        antiRow += rowOffset;
                        antiCol += colOffset;
                    }
                }
            }
        }
    }

    console.log(`Part 1: ${soloAntinodes.size}`);
    console.log(`Part 2: ${multiAntinodes.size}`);
}