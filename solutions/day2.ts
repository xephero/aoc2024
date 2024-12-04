import { readDayInput } from "../utility";

function isSafeChange(levels: number[], index: number) {
    if (index === 0)
        return true;

    const absChange = Math.abs(levels[index] - levels[index-1]);
    return (absChange >= 1 && absChange <= 3);
}

function isSameDirection(levels: number[], index: number) {
    if (index === 0 || index === 1)
        return true;

    return ((levels[index] - levels[index-1]) * (levels[index-1] - levels[index-2])) > 0;
}

function isSafe(levels: number[], index: number) {
    if (!isSafeChange(levels, index))
        return false;

    if (!isSameDirection(levels, index))
        return false;

    return true;
}

function levelsWithRemoved(levels, index) {
    return [...levels.slice(0, index), ...levels.slice(index+1)];
}

export function day2() {
    console.log(
        readDayInput(2)
        .split('\n')
        .map((line): number => {
            const levels = line.split(' ').map(l => parseInt(l));

            const safeNaturally = levels.every((_, i) => isSafe(levels, i));
            let safeWithDamp = false;

            if (!safeNaturally) {
                for (let i = 0; i < levels.length; i++) {
                    const proposal = levelsWithRemoved(levels, i);
                    if (proposal.every((_, i) => isSafe(proposal, i))) {
                        safeWithDamp = true;
                        break;
                    }
                }
            }

            return (safeNaturally || safeWithDamp) ? 1 : 0;
        })
        .reduce((sum, count) => sum += count, 0)
    );
}