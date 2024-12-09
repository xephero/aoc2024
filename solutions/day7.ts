import { readDayInput } from "../utility";

function getPermutations(length: number, set: string[], current: string[] = []): string[][] {
    let results: string[][] = [];

    if (length === current.length)
        return [current];
    else
        for (let operator of set)
            results = results.concat(getPermutations(length, set, [...current, operator]));

    return results;
}

function valuesCanMakeTarget(values: number[], target: number, operators: string[]): boolean {
    // Get every permutation of + and * operators
    const operatorSets = getPermutations(values.length-1, operators);

    for (const set of operatorSets) {
        const numStack = [...values];
        const opStack = [...set];

        let total = numStack.shift() ?? 0;
        
        while (opStack.length > 0) {
            const op = opStack.shift();

            if (op === '+')
                total += numStack.shift() ?? 0;
            else if (op === '*')
                total *= numStack.shift() ?? 1;
            else if (op === '||')
                total = parseInt(`${total}${numStack.shift()}`);
        }

        if (total === target)
            return true;
    }

    return false;
}

export function day7() {
    const input = readDayInput(7);

    const lines = input.split('\n').map(l => l.split(': '));

    let arithmeticTotal = 0;
    let concatTotal = 0;

    for (const line of lines) {
        const target = parseInt(line[0]);
        const values = line[1].split(' ').map(n => parseInt(n));

        if (valuesCanMakeTarget(values, target, ['+', '*'])) {
            arithmeticTotal += target;
            concatTotal += target;
        } else if (valuesCanMakeTarget(values, target, ['+', '*', '||'])) {
            concatTotal += target;
        }

    }

    console.log(`Part 1: ${arithmeticTotal}`);
    console.log(`Part 1: ${concatTotal}`);
}