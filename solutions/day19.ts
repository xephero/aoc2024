import { readDayInput } from "../utility";

const MEMOS: {[key: string]: number} = {}

function checkForTowelCombos(towels: string[], target: string) {
    let totalCombos = 0;

    // Base case: If every prior check has sliced the string to nothing, then it's possible to make this
    if (target.length === 0) {
        //console.log(`==> Success!`);
        return 1;
    }

    // Return cache if we have it already
    if (target in MEMOS) {
        return MEMOS[target];
    }

    let nextTowelCandidate = target;

    // Run until we've exhausted all combos
    while (nextTowelCandidate.length > 0) {
        //console.log(`=> Testing candidate ${nextTowelCandidate}`);

        // If this entire segment matches a towel, then check the viability of the remaining section
        if (towels.includes(nextTowelCandidate))
            // Add all the ways we can make combos from beyond this prefix as a starting point
            totalCombos += checkForTowelCombos(towels, target.substring(nextTowelCandidate.length));

        // Chop a character off the end and continue
        nextTowelCandidate = target.substring(0, nextTowelCandidate.length - 1);

    }

    // We've found all the combos we can find from this target
    MEMOS[target] = totalCombos;
    return totalCombos;
}

export function day19() {
    const input = readDayInput(19);

    const sections = input.split('\n\n');
    const towels = sections[0].split(', ');
    const targets = sections[1].split('\n');

    let viablePatterns: number[] = [];

    for (const target of targets)
        viablePatterns.push(checkForTowelCombos(towels, target));

    const totalViablePatterns = viablePatterns.filter(n => n > 0).length;
    const totalCombinations = viablePatterns.reduce((a, b) => a + b);

    console.log(`Part 1: ${totalViablePatterns}`);
    console.log(`Part 1: ${totalCombinations}`);
}