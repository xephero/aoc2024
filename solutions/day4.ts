import { readDayInput } from "../utility";

function countXmas(line: string) {
    const forward = (line.match(/XMAS/g) || []).length;
    const backwards = (line.match(/SAMX/g) || []).length;
    return forward + backwards;
}

function findHorizontal(input: string[][]) {
    let total = 0;

    for (let lineArray of input)
        total += countXmas(lineArray.join(''));

    return total;
}

function findVertical(input: string[][]) {
    let total = 0;

    for (let col = 0; col < input[0].length; col++) {
        let column = "";

        for (let row = 0; row < input.length; row++)
            column += input[row][col];

        total += countXmas(column);
    }

    return total;
}

function findDiagonal(input: string[][]) {
    let total = 0;

    const rows = input.length - 1;
    const cols = input[0].length - 1;
    const diagonals = rows + cols + 1;

    // Up diagonals

    // 0,0
    // 1,0 0,1
    // 2,0 1,1 0,2
    // 3,0 2,1 1,2 0,3
    // 138,0 137,1 136,3 ... 1,137 1,138
    // 139,0 138,1 137,2 ... 1,138 0,139 <-- middle row
    // 139,1 138,2 137,3 ... 2,138 1,139
    // 139,137 138,138 137,139
    // 139,138 138,139
    // 139,139
    for (let d = 0; d < diagonals; d++) {
        let diag = "";

        let row = Math.min(d, rows); // 0, 1, 2, 3 ... 137, 138, 139, 139, 139 ... 139
        let col = Math.max(0, d-cols); // 0, 0, 0, 0 ... 0, 0, 1, 2, 3 ... 138, 139
        let diagSize = row - col + 1;

        for (let i = 0; i < diagSize; i++)
            diag += input[row--][col++]; // up one row, right one column

        total += countXmas(diag);
    }

    // Down diagonals

    // 139,0
    // 138,0 139,1
    // 137,0 138,1 139,2
    // 136,0 137,1 138,2 139,3
    // 1,0 2,1 3,2 ... 138,137 139,138
    // 0,0 1,1 2,2 ... 138,138 139,139 <-- middle row
    // 0,1 1,2 2,3 ... 137,138 138,139
    // 0,137 1,138 2,139
    // 0,138 1,139
    // 0,139
    for (let d = 0; d < diagonals; d++) {
        let diag = "";

        let row = Math.max(0, rows-d); // 139, 138, 137, ... 2, 1, 0, 0, 0 ... 0
        let col = Math.max(0, d-cols); // 0, 0, 0, ... 0, 0, 1, 2 ... 138, 139
        let diagSize = Math.max(rows, cols) - (row + col) + 1;

        for (let i = 0; i < diagSize; i++)
            diag += input[row++][col++]; // down one row, down one column

        total += countXmas(diag);
    }

    return total;
}

function findXmas(input: string[][]) {
    let total = 0;

    // Taking in this pattern:
    // 1 2
    //  A
    // 3 4
    // Four configurations are X-MASes
    const matches = ['MSMS', 'MMSS', 'SSMM', 'SMSM'];

    for (let row = 0; row < input.length-2; row++) {
        for (let col = 0; col < input[0].length-2; col++) {
            if (input[row+1][col+1] === 'A') {
                const candidate =
                    input[row][col]   + input[row][col+2] +
                                   // A
                    input[row+2][col] + input[row+2][col+2];

                if (matches.includes(candidate))
                    total += 1;
            }
        }
    }

    return total;
}

export function day4() {
    const input = readDayInput(4);

    const grid = input.split('\n').map(line => line.split(''));

    const total = findHorizontal(grid) + findVertical(grid) + findDiagonal(grid);
    const p2total = findXmas(grid);

    console.log(`Part 1: ${total}`);
    console.log(`Part 2: ${p2total}`);
}
