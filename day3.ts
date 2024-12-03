import { readDayInput } from "./utility";

export function day3() {
    const input = readDayInput(3);

    const matches = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);

    let total = 0;

    for (const match of matches) {
        total += parseInt(match[1]) * parseInt(match[2]);
    }

    console.log(total);
}