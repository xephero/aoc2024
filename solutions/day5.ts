import { readDayInput } from "../utility";

export function day5() {
    const input = readDayInput(5);

    const [ruleLines,pageLines] = input.split('\n\n').map(s => s.split('\n'));
    let middleSumCorrect = 0;
    let middleSumFixed = 0;

    for (const pageLine of pageLines) {
        const pages = pageLine.split(',').map(p => parseInt(p));

        let preSort = JSON.stringify(pages);

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

        const middlePage = pages[Math.floor(pages.length/2)];
        let postSort = JSON.stringify(pages);

        if (preSort === postSort)
            middleSumCorrect += middlePage;
        else
            middleSumFixed += middlePage;
    }

    console.log(`Part 1: ${middleSumCorrect}`);
    console.log(`Part 2: ${middleSumFixed}`);
}