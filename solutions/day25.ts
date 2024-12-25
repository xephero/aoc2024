import { readDayInput } from "../utility";

export function day25() {
    const input = readDayInput(25);

    const schematics = input.split('\n\n').map(s => s.split('\n').map(l => l.split('')));
    const locks: number[][] = [];
    const keys: number[][] = [];

    const lockHeight = schematics[0].length;
    const lockWidth = schematics[0][0].length;

    for (const schematic of schematics) {
        const counts: number[] = schematic[0].map(col => 0);

        for (let row = 0; row < lockHeight; row++)
            for (let col = 0; col < lockWidth; col++)
                counts[col] += schematic[row][col] === '#' ? 1 : 0;

        if (schematic[0][0] === '#')
            locks.push(counts);
        else
            keys.push(counts);
    }

    let workingPairs = 0;

    for (const lock of locks)
        for (const key of keys)
            if (lock.every((height, index) => height + key[index] <= lockHeight))
                workingPairs += 1;

    console.log(`Part 1: ${workingPairs}`);                
            
}