import { readDayInput } from "../utility";

export function day1() {
    const input = readDayInput(1);

    const lists = input.split('\n').map(line => line.split('   '));

    const left = lists.map(e => parseInt(e[0]));
    const right = lists.map(e => parseInt(e[1]));

    left.sort((a,b) => a - b);
    right.sort((a,b) => a - b);


    const distance = left
        .map((val, i) => Math.abs(val - right[i]))
        .reduce((sum, val) => sum += val, 0);

    const similarity = left
        .map((lval) => (
            right
                .map((rval) => rval === lval ? lval : 0)
                .reduce((sum, count) => sum += count, 0)
        ))
        .reduce((sum, val) => sum += val, 0);

    console.log(`Part 1: ${distance}`);
    console.log(`Part 2: ${similarity}`);
}