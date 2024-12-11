import { readDayInput } from "../utility";

const cache: {[key: number]: number} = {};

function blink(stone: number, times: number, iteration = 0): number {
    const stoneString = stone.toString();
    const handle = `${stoneString}/${times-iteration}`;

    if (handle in cache)
        return cache[handle];

    let result: number;

    // We've iterated all the times we're going to! There is 1 stone here
    if (iteration === times)
        result = 1;

    // If this stone is 0, the next is 1
    else if (stone === 0)
        result = blink(1, times, iteration + 1);        

    // If this stone has an even number of digits, add both branches together
    else if (stoneString.length % 2 === 0) {
        const stone1 = parseInt(stoneString.substring(0, stoneString.length / 2));
        const stone2 = parseInt(stoneString.substring(stoneString.length / 2));
        result = blink(stone1, times, iteration + 1) + blink(stone2, times, iteration + 1);
    }

    // Otherwise, do one more
    else
        result = blink(stone * 2024, times, iteration + 1);

    // Cache result
    cache[handle] = result;

    return result;
}

export function day11() {
    const input = readDayInput(11);

    const stones = input.split(' ').map(s => parseInt(s));

    let count25 = 0;
    let count75 = 0;

    for (const stone of stones) {
        count25 += blink(stone, 25);
        count75 += blink(stone, 75);
    }

    console.log(`Part 1: ${count25}`);
    console.log(`Part 2: ${count75}`);
}