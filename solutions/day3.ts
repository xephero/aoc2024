import { readDayInput } from "../utility";

export function day3() {
    const input = readDayInput(3).replaceAll('\n', '')

    const normalMatches = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);

    const conditionalMatches = input.split('do()')
        .map(line => line.replace(/don't\(\).+/, ''))
        .join()
        .matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);

    let normalTotal = 0;
    let conditionalTotal = 0;

    for (const match of normalMatches)
        normalTotal += parseInt(match[1]) * parseInt(match[2]);

    for (const match of conditionalMatches)
        conditionalTotal += parseInt(match[1]) * parseInt(match[2]);

    console.log(`Part 1: ${normalTotal}`);
    console.log(`Part 2: ${conditionalTotal}`);
}