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

    for (const secret of secrets) {
        let next = secret;

        for (let i = 0; i < 2000; i++)
            next = nextSecret(next);

        total += next;
    }

    console.log(`Part 1: ${total}`);
}
