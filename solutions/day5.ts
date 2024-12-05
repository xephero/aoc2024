import { readDayInput } from "../utility";

export function day5() {
    const input = readDayInput(5);

    const sections = input.split('\n\n');
    const earlier: number[] = [];
    const later: number[] = [];
    const ruleLines = sections[0].split('\n');
    const pageLines = sections[1].split('\n');
    let middleSumCorrect = 0;
    let middleSumFixed = 0;

    const wrongOrdered: number[][] = [];

    for (const rule of ruleLines) {
        const pageNumbers = rule.split('|').map(p => parseInt(p));
        earlier.push(pageNumbers[0]);
        later.push(pageNumbers[1]);
    }

    for (const pageLine of pageLines) {
        const pages = pageLine.split(',').map(p => parseInt(p));

        let failed = false;
        const seen: number[] = [];

        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            const page = pages[pageIndex];

            for (let i = 0; i < earlier.length; i++) {
                // If the current page is in the earlier list, and we've
                // seen a page in the later list, this fails
                if (earlier[i] === page && seen.includes(later[i])) {
                    failed = true;
                    break;
                }
            }

            seen.push(page);
        }

        if (failed) {
            // Fix the page ordering
            pages.sort((a, b) => {
                // If a should go before b, a|b exists, return a negative number
                if (ruleLines.indexOf(`${a}|${b}`) > 0)
                    return -1;

                // If a should go after b, b|a exists, return a positive number
                else if (ruleLines.indexOf(`${b}|${a}`))
                    return 1;

                // If neither exist, return 0
                else return 0;
            });

            console.log(`Fixed: ${pages.join(',')}`);
        }

        const middlePage = pages[Math.floor(pages.length/2)];

        if (!failed)
            middleSumCorrect += middlePage;
        else
            middleSumFixed += middlePage;
    }

    console.log(`Part 1: ${middleSumCorrect}`);
    console.log(`Part 2: ${middleSumFixed}`);
}