import { readDayInput } from "../utility";

type Device = {
    ra: bigint;
    rb: bigint;
    rc: bigint;
    program: number[];
    instruction: number;
    opcode: number;
    operand: number;
    output: number[];
}

function getCombo(cpu: Device) {
    switch (cpu.operand) {
        case 4: return cpu.ra;
        case 5: return cpu.rb;
        case 6: return cpu.rc;
        default: return cpu.operand;
    }
}

// 0
function adv(cpu: Device) {
    const operand = BigInt(getCombo(cpu));
    cpu.ra = cpu.ra / (2n ** operand);
    cpu.instruction += 2;
}

// 1
function bxl(cpu: Device) {
    cpu.rb ^= BigInt(cpu.operand);
    cpu.instruction += 2;
}

// 2
function bst(cpu: Device) {
    const operand = BigInt(getCombo(cpu));
    cpu.rb = operand % 8n;
    cpu.instruction += 2;
}

// 3
function jnz(cpu: Device) {
    if (cpu.ra === 0n)
        cpu.instruction += 2;
    else
        cpu.instruction = cpu.operand;
}

// 4
function bxc(cpu: Device) {
    cpu.rb ^= cpu.rc;
    cpu.instruction += 2;
}

// 5
function out(cpu: Device) {
    const operand = BigInt(getCombo(cpu));
    cpu.output.push(Number(operand % 8n));
    cpu.instruction += 2;
}

// 6
function bdv(cpu: Device) {
    const operand = BigInt(getCombo(cpu));
    cpu.rb = cpu.ra / (2n ** operand);
    cpu.instruction += 2;
}


// 7
function cdv(cpu: Device) {
    const operand = BigInt(getCombo(cpu));
    cpu.rc = cpu.ra / (2n ** operand);
    cpu.instruction += 2;
}

function makeCpu(a: bigint, matches: string[]) {
    return {
        ra: a,
        rb: BigInt(matches[2]),
        rc: BigInt(matches[3]),
        program: matches[4].split(',').map(o => parseInt(o)),
        instruction: 0,
        opcode: 0,
        operand: 0,
        output: [],
    };
}

function runWith(a: bigint, matches: string[]) {
    const cpu = makeCpu(a, matches);
    execute(cpu);
    return cpu.output;
}

function execute(cpu: Device) {
    while (cpu.instruction >= 0 && cpu.instruction < cpu.program.length) {
        cpu.opcode = cpu.program[cpu.instruction];
        cpu.operand = cpu.program[cpu.instruction+1];

        switch (cpu.opcode) {
            case 0: adv(cpu); break;
            case 1: bxl(cpu); break;
            case 2: bst(cpu); break;
            case 3: jnz(cpu); break;
            case 4: bxc(cpu); break;
            case 5: out(cpu); break;
            case 6: bdv(cpu); break;
            case 7: cdv(cpu); break;
        }
    }
}

export function day17() {
    const input = readDayInput(17);

    const matches = input.match(/Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)\n\nProgram: ([\d\,]+)/) ?? [];

    const firstOutput = runWith(BigInt(parseInt(matches[1])), matches);

    console.log(`Part 1: ${firstOutput.join(',')}`);

    const prog = matches[4].split(',').map(o => parseInt(o));

    let targetLength = prog.length;

    let powers: bigint[] = [];
    for (let i = 1; i < targetLength; i++)
        powers.push(0n);

    powers.push(1n);

    let lastGuess = 0n;
    let lastOutput = [];
    let watchedDigit = targetLength - 1;

    while (JSON.stringify(lastOutput) !== JSON.stringify(prog)) {
        lastGuess = BigInt(0);

        // 1 * 8^0 + 4 * 8^1 + 3 * 8^2 + ... + 2 * 8^15
        for (let i = 0n; i < powers.length; i++)
            lastGuess += powers[Number(i)] * (8n ** i);

        if (powers[powers.length-1] === 9n) {
            break;
        }

        // Guess this value
        lastOutput = runWith(lastGuess, matches);

        // Optional safe-cracking debug view
        //console.log(`${watchedDigit} @ ${JSON.stringify(powers.map(i => Number(i)))}: ${lastGuess} => ${JSON.stringify(lastOutput)}`);

        // If it matches we're done!
        if (JSON.stringify(lastOutput) === JSON.stringify(prog))
            break;

        // If not, generate the next guess

        // If the watched digit matches, change which power we modify
        if (lastOutput[watchedDigit] === prog[watchedDigit])
            watchedDigit -= 1;

        // If there's no match and we've tried all 8, reset guess and start increasing the next one again
        else if (powers[watchedDigit] >= 7) {
            powers[watchedDigit] = 0n;
            watchedDigit += 1;
            powers[watchedDigit] += 1n;
        }

        else {
            powers[watchedDigit] += 1n;
        }
    }

    console.log(`Part 2: ${lastGuess}`);
}