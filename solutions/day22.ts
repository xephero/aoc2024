import { readDayInput } from "../utility";

function nextSecret(secret: bigint) {
    secret ^= secret << 6n;
    secret &= (1n << 24n) - 1n;
    secret ^= secret >> 5n;
    secret &= (1n << 24n) - 1n;
    secret ^= secret << 11n;
    secret &= (1n << 24n) - 1n;

    return secret;
}

export function day22() {
    const input = readDayInput(22);

    const secrets = input.split('\n').map(l => BigInt(l));

    let total = 0n;

    let prices: number[][] = [];
    let changes: number[][] = [];

    for (const secret of secrets) {
        let next = secret;

        prices.push([Number(next % 10n)]);
        changes.push([-999])
        const last = prices.length - 1;

        for (let i = 1; i < 2001; i++) {
            next = nextSecret(next);
            const last = prices.length - 1;
            prices[last].push(Number(next % 10n));
            changes[last].push(prices[last][i] - prices[last][i-1]);
        }

        total += next;
    }

    console.log(`Part 1: ${total}`);
    
    const totalPerChange: {[key: string]: number} = {};

    for (let i = 0; i < changes.length; i++) {
        // Get the first result of each change from this seller
        const thisSellerChange: {[key: string]: number} = {};

        for (let j = 4; j < changes[i].length; j++) {
            const changeSet = changes[i].slice(j-3, j+1).join(',');
            const bananas = prices[i][j];
            
            if (changeSet in thisSellerChange)
                continue;

            thisSellerChange[changeSet] = bananas;
        }

        // Add those changes to the total
        for (const [changeSet, bananas] of Object.entries(thisSellerChange)) {
            if (changeSet in totalPerChange)
                totalPerChange[changeSet] += bananas;
            else
                totalPerChange[changeSet] = bananas;
        }
    }

    const maxBananas = Math.max(...Object.values(totalPerChange));

    console.log(`Part 2: ${maxBananas}`);
}
