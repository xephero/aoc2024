import { readDayInput } from "../utility";

export function day5() {
    const input = readDayInput(5);

    const sections = input.split('\n\n');
    const earlier: number[] = [];
    const later: number[] = [];
    const ruleLines = sections[0].split('\n');
    const pageLines = sections[1].split('\n');
    let middleSum = 0;

    for (const rule of ruleLines) {
        const pageNumbers = rule.split('|').map(p => parseInt(p));
        earlier.push(pageNumbers[0]);
        later.push(pageNumbers[1]);
    }

    for (const pageLine of pageLines) {
        const pages = pageLine.split(',').map(p => parseInt(p));

        let failed = false;
        const seen: number[] = [];

        for (const page of pages) {
            // Only look backwards
            for (let i = 0; i < earlier.length; i++) {
                if (earlier[i] === page && seen.includes(later[i])) {
                    failed = true;
                    break;
                }
            }

            seen.push(page);
        }

        if (!failed)
            middleSum += pages[Math.floor(pages.length/2)];
    }

    console.log(`Part 1: ${middleSum}`);
}