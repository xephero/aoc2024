import { readDayInput } from "../utility";

function arrowsToArrows(arrows: string[]) {
    const keypadRows = ['xUA', 'LDR'];

    let curKeyRow = keypadRows.findIndex(r => r.includes('A'));
    let curKeyCol = keypadRows[curKeyRow].indexOf('A');
    let sequence: string[] = [];

    for (const arrow of arrows) {
        // Get the row and col from the indexes
        const nextKeyRow = keypadRows.findIndex(r => r.includes(arrow));
        const nextKeyCol = keypadRows[nextKeyRow].indexOf(arrow);

        // Avoid the empty spot! Moving from top row to L requires a down press before col movement
        if (curKeyRow === 0 && nextKeyCol === 0) {
            sequence.push('D');
            curKeyRow++;
        }

        while (nextKeyCol > curKeyCol) {
            sequence.push('R');
            curKeyCol++;
        }

        while (nextKeyRow < curKeyRow) {
            sequence.push('U');
            curKeyRow--;
        }

        while (nextKeyRow > curKeyRow) {
            sequence.push('D');
            curKeyRow++;
        }

        while (nextKeyCol < curKeyCol) {
            sequence.push('L');
            curKeyCol--;
        }

        sequence.push('A');
    }

    return sequence;
}

function codeToArrows(code: string[]) {
    const keypadRows = [ '789', '456', '123', 'x0A' ];

    let curKeyRow = keypadRows.findIndex(r => r.includes('A'));
    let curKeyCol = keypadRows[curKeyRow].indexOf('A');
    let sequence: string[] = [];

    for (const button of code) {
        // Get the row and col from the indexes
        const nextKeyRow = keypadRows.findIndex(r => r.includes(button));
        const nextKeyCol = keypadRows[nextKeyRow].indexOf(button);

        // Avoid the empty spot! Moving to left col from bottom row means we need U first
        if (curKeyRow === 3 && nextKeyCol === 0) {
            while (nextKeyRow < curKeyRow) {
                sequence.push('U');
                curKeyRow--;
            }
        }

        if (curKeyCol === 0 && nextKeyRow === 3) {
            while (nextKeyCol > curKeyCol) {
                sequence.push('R');
                curKeyCol++;
            }
        }

        while (nextKeyCol < curKeyCol) {
            sequence.push('L');
            curKeyCol--;
        }

        while (nextKeyRow < curKeyRow) {
            sequence.push('U');
            curKeyRow--;
        }

        while (nextKeyRow > curKeyRow) {
            sequence.push('D');
            curKeyRow++;
        }

        while (nextKeyCol > curKeyCol) {
            sequence.push('R');
            curKeyCol++;
        }
        

        sequence.push('A');
    }

    return sequence;
}

function arrowLoop(sequence: string[], robots: number) {
    let lastInput = sequence;
    for (let bot = 0; bot < robots; bot++)
        lastInput = arrowsToArrows(lastInput);

    return lastInput.length;
}

export function day21() {
    const input = readDayInput(21);

    const codes = input.split('\n').map(l => l.split(''));

    let oneRobotComplexity = 0;
    let allRobotComplexity = 0;

    for (const code of codes) {
        const sequence = codeToArrows(code);
        const keyNumber = parseInt(code.join(''));

        oneRobotComplexity += arrowLoop(sequence, 2) * keyNumber;
        allRobotComplexity += arrowLoop(sequence, 25) * keyNumber;
    }

    // 219366
    console.log(`Part 1: ${oneRobotComplexity}`);
    console.log(`Part 2: ${allRobotComplexity}`);

}