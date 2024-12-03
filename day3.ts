import { readDayInput } from "./utility";

export function day3() {
    const input = readDayInput(3)
        .replace('\r\n', '')
        .split('do()')
        .map(line => line.replace(/don't\(\)[\s\S.]+/, ''))
        .join();

    const matches = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);

    let total = 0;

    for (const match of matches) {
        console.log(`${match[1]} ${match[2]}`);
        total += parseInt(match[1]) * parseInt(match[2]);
    }

    console.log(total);
}