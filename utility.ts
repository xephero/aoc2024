import fs from 'node:fs';

export function readDayInput(day: number): string {
    if (day < 1 || day > 25)
        return '';

    return fs.readFileSync(`day${day}.txt`).toString().trim();
}