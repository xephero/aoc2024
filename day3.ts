import { readDayInput } from "./utility";

export function day3() {
    const matches = readDayInput(3)
        .replaceAll('\n', '')
        .split('do()')
        .map(line => line.replace(/don't\(\).+/, ''))
        .join()
        .matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);

    let total = 0;

    for (const match of matches)
        total += parseInt(match[1]) * parseInt(match[2]);

    console.log(total);
}