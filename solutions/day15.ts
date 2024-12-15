import { readDayInput } from "../utility";

function move(map: string[][], row: number, col: number, moveRow: number, moveCol: number) {
    // Check in the direction we're going to see if there is a space before the next wall
    let scanRow = row;
    let scanCol = col;
    let lastCell = '';

    // Scan for an open space in our direction to see if movement is even possible
    while (lastCell !== '.') {
        scanRow += moveRow;
        scanCol += moveCol;

        lastCell = map[scanRow][scanCol];

        if (lastCell === '#')
            break;
    }

    // If we didnt find a space in this direction, no moves happen
    if (lastCell !== '.')
        return [row, col];

    // There's a space at scanRow,scanCol. Start there and move everything over
    while (scanRow !== row || scanCol !== col) {
        // Find the block moving *into* this one
        const sourceRow = scanRow - moveRow;
        const sourceCol = scanCol - moveCol;

        // Move the source into this spot
        map[scanRow][scanCol] = map[sourceRow][sourceCol];
        map[sourceRow][sourceCol] = '.';

        // Set the source as the next place to move
        scanRow = sourceRow;
        scanCol = sourceCol;
    }

    // This is where the @ is now, after the last move
    return [row + moveRow, col + moveCol];
}

function canMove(map: string[][], row: number, col: number, moveRow: number) {
    const checkRow = row + moveRow;
    const checkCol = col;
    
    // If this would hit a wall, no good
    if (map[checkRow][checkCol] === '#')
        return false;

    // If this would hit a space, it's fine
    if (map[checkRow][checkCol] === '.')
        return true;

    // If this is one side of a box, check it and the other side
    if (map[checkRow][checkCol] === '[')
        return (
            canMove(map, checkRow, checkCol, moveRow) &&
            canMove(map, checkRow, checkCol+1, moveRow)
        )

    if (map[checkRow][checkCol] === ']')
        return (
            canMove(map, checkRow, checkCol-1, moveRow) &&
            canMove(map, checkRow, checkCol, moveRow)
        )

    // Something weird happened if we get here
    throw new Error(`Unexpected obstacle: ${map[checkRow][checkCol]}`);
}

function doVerticalMove(map: string[][], row: number, col: number, moveRow: number) {
    // Depth first: Do the actual move at the end of the stack first, then come back to do this one
    const nextRow = row + moveRow;

    // Col is the left side of a box. If there's a directly lined up box, move that one
    if (map[nextRow][col] === '[')
        doVerticalMove(map, nextRow, col, moveRow);
    else {
        // If the left side has a left branching box, push that
        if (map[nextRow][col] === ']')
            doVerticalMove(map, nextRow, col-1, moveRow);

        // And if the right side has a right branching box, push that
        if (map[nextRow][col+1] === '[')
            doVerticalMove(map, nextRow, col+1, moveRow);
    }

    // At this point, either all the boxes ahead of it are moved, or there is no box ahead
    // Now we can actually move the box from row into nextRow, which should be clear
    map[nextRow][col] = map[row][col];
    map[nextRow][col+1] = map[row][col+1];
    map[row][col] = '.';
    map[row][col+1] = '.';

}

function wideMove(map: string[][], row: number, col: number, moveRow: number, moveCol: number) {

    // If this is a horizontal move, normal moving is fine
    if (moveRow === 0)
        return move(map, row, col, moveRow, moveCol);

    // Check if we can do the wide vertical move in the first place
    if (!canMove(map, row, col, moveRow))
        return [row, col];

    // Do the vertical move
    const nextRow = row + moveRow;
    
    // If it's an empty space, just move there
    if (map[nextRow][col] === '.') {
        map[nextRow][col] = map[row][col];
        map[row][col] = '.';
        return [nextRow, col];
    }

    const startCol = map[nextRow][col] === ']' ? col - 1 : col;

    // Move the boxes
    doVerticalMove(map, nextRow, startCol, moveRow);

    // Move the guy
    map[row][col] = map[nextRow][col];
    map[nextRow][col] = '@';

    return [nextRow, col];
}

function getGps(map: string[][]) {
    let gps = 0;

    for (let row = 0; row < map.length; row++)
        for (let col = 0; col < map[0].length; col++)
            if (map[row][col] === 'O' || map[row][col] === '[')
                gps += 100 * row + col;

    return gps;
}

export function day15() {
    const input = readDayInput(15);

    const splitInput = input.split('\n\n');
    const map = splitInput[0].split('\n').map(l => l.split(''));
    const instructions = splitInput[1].replaceAll('\n', '');

    // Find start
    let botRow = 0;
    let botCol = 0;
    for (let row = 0; row < map.length; row++)
        for (let col = 0; col < map.length; col++)
            if (map[row][col] === '@') {
                botRow = row;
                botCol = col;
                break;
            }

    // Follow instructions
    for (const instruction of instructions) {
        let moveRow = 0;
        let moveCol = 0;
        if (instruction === '^')
            moveRow = -1;
        else if (instruction === '>')
            moveCol = 1;
        else if (instruction === 'v')
            moveRow = 1;
        else if (instruction === '<')
            moveCol = -1;

        [botRow, botCol] = move(map, botRow, botCol, moveRow, moveCol);
    }

    const gps = getGps(map);

    console.log(`Part 1: ${gps}`);

    const wideMap = splitInput[0]
        .replaceAll('#', '##')
        .replaceAll('O', '[]')
        .replaceAll('.', '..')
        .replaceAll('@', '@.')
        .split('\n')
        .map(l => l.split(''));

    for (let row = 0; row < wideMap.length; row++)
        for (let col = 0; col < wideMap[0].length; col++)
            if (wideMap[row][col] === '@') {
                botRow = row;
                botCol = col;
                break;
            }

    for (const instruction of instructions) {
        let moveRow = 0;
        let moveCol = 0;
        if (instruction === '^')
            moveRow = -1;
        else if (instruction === '>')
            moveCol = 1;
        else if (instruction === 'v')
            moveRow = 1;
        else if (instruction === '<')
            moveCol = -1;

        [botRow, botCol] = wideMove(wideMap, botRow, botCol, moveRow, moveCol);
    }

    const wideGps = getGps(wideMap);

    console.log(`Part 2: ${wideGps}`);

}
