import { readDayInput } from "../utility";

const recurseMap: {[key: string]: number} = {};

function findLowest(code: string, maxIteration: number, iteration = 0, numpad = true) {
    // Base case: the code is the final length here
    if (maxIteration === iteration)
        return code.length;

    const mapKey = `${code}.${numpad ? 'N' : 'A'}.${maxIteration - iteration}`;

    if (mapKey in recurseMap)
        return recurseMap[mapKey];

    const keypad = numpad ? [ '789', '456', '123', 'x0A' ] : [ 'xUA', 'LDR' ];
    const invalidRow = numpad ? 3 : 0;
    const invalidCol = 0;

    let curKeyRow = keypad.findIndex(r => r.includes('A'));
    let curKeyCol = keypad[curKeyRow].indexOf('A');

    let total = 0;

    for (const button of code) {
        const nextKeyRow = keypad.findIndex(r => r.includes(button));
        const nextKeyCol = keypad[nextKeyRow].indexOf(button);

        let horiz = '';
        let vert = '';
        let forceHorizFirst = false;
        let forceVertFirst = false;

        // Special case: maneuvering around the void spot
        // Happens if we're on the invalid column and need to move to the invalid row, or vice versa
        // Numpad: on 147 and need 0A, or vice versa
        // D-pad: on UA and need L, or vice versa

        // 147 -> 0A or L -> UA
        if (curKeyCol === invalidCol && nextKeyRow === invalidRow)
            forceHorizFirst = true;

        // 0A -> 147 or UA -> L
        else if (curKeyRow === invalidRow && nextKeyCol === invalidCol)
            forceVertFirst = true;

        // Gather the horizontal and vertical directions needed
        while (nextKeyCol > curKeyCol) {
            horiz += 'R';
            curKeyCol++;
        }

        while (nextKeyCol < curKeyCol) {
            horiz += 'L';
            curKeyCol--;
        }

        while (nextKeyRow > curKeyRow) {
            vert += 'D';
            curKeyRow++;
        }

        while (nextKeyRow < curKeyRow) {
            vert += 'U';
            curKeyRow--;
        }

        // Forced ordering is easy
        if (forceVertFirst) {
            total += findLowest(vert + horiz + 'A', maxIteration, iteration + 1, false);
            continue;
        } else if (forceHorizFirst) {
            total += findLowest(horiz + vert + 'A', maxIteration, iteration + 1, false);
            continue;
        }

        total += Math.min(
            findLowest(vert + horiz + 'A', maxIteration, iteration + 1, false),
            findLowest(horiz + vert + 'A', maxIteration, iteration + 1, false)
        );
    }

    recurseMap[mapKey] = total;
    return total;
}

export function day21() {
    const input = readDayInput(21);

    const codes = input.split('\n');

    let oneRobotComplexity = 0;
    let allRobotComplexity = 0;

    for (const code of codes) {
        const keyNumber = parseInt(code);
        
        oneRobotComplexity += findLowest(code, 2 + 1) * keyNumber;
        allRobotComplexity += findLowest(code, 25 + 1) * keyNumber;
    }

    console.log(`Part 1: ${oneRobotComplexity}`);
    console.log(`Part 2: ${allRobotComplexity}`);
}