import { readDayInput } from "../utility";

const EXIT = 70;
const FIRST = 1024;

type Node = {
    row: number;
    col: number;
    distance: number;
    visited: boolean;
    wall: boolean;
};

function getNode(nodes: Node[], row: number, col: number, any = false) {
    return nodes.find(n =>
        n.row === row
        && n.col === col
        && (any || (!n.wall && !n.visited))
    );
}

function getNextNode(nodes: Node[]) {
    let lowest: Node | null = null;

    const viableNodes = nodes.filter(n => !n.wall && !n.visited && n.distance !== Infinity);

    for (const node of viableNodes) {
        if (lowest === null || node.distance < lowest.distance)
            lowest = node;
    }

    return lowest;
}

function resetNodes(nodes: Node[], corruptions: number[][]) {
    for (const node of nodes) {
        node.visited = false;
        node.distance = Infinity;
        node.wall = false;
    }

    for (const corruption of corruptions) {
        const newWall = getNode(nodes, corruption[1], corruption[0]);

        if (newWall === undefined)
            throw new Error(`Couldn't find new wall node at ${corruption[0]},${corruption[1]}`);

        newWall.wall = true;
    }

    const startNode = getNode(nodes, 0, 0);

    if (startNode === undefined)
        throw new Error(`Couldn't find start node`);

    startNode.distance = 0;
}

function solveNodes(nodes: Node[]) {
    let node = getNextNode(nodes);

    while (node !== null) {
        node.visited = true;
        const row = node.row;
        const col = node.col;

        const neighbors = [
            getNode(nodes, row - 1, col),
            getNode(nodes, row, col + 1),
            getNode(nodes, row + 1, col),
            getNode(nodes, row, col - 1),
        ].filter(n => n !== undefined);

        const nextDistance = node.distance + 1;

        for (const neighbor of neighbors)
            if (neighbor.distance > nextDistance)
                neighbor.distance = nextDistance;

        node = getNextNode(nodes);
    }
}

export function day18() {
    const input = readDayInput(18);

    const corruptions: number[][] = input.split('\n').map(l => l.split(',').map(n => parseInt(n)));
    const nodes: Node[] = [];

    // Set up the nodes
    for (let row = 0; row <= EXIT; row++) {
        for (let col = 0; col <= EXIT; col++) {
            nodes.push({
                row,
                col,
                distance: Infinity,
                visited: false,
                wall: false
            });
        }
    }

    resetNodes(nodes, corruptions.slice(0, FIRST));
    solveNodes(nodes);

    let exitNode = getNode(nodes, EXIT, EXIT, true);

    console.log(`Part 1: ${exitNode?.distance}`);

    let highestWorking = FIRST;
    let lowestBreaking = corruptions.length - 1;
    let lastAttempt = Math.floor((lowestBreaking + highestWorking) / 2);

    while (lowestBreaking - highestWorking > 1) {
        if (!exitNode)
            throw new Error('Lost exit node');

        const corruptionSet = corruptions.slice(0, lastAttempt + 1);
        resetNodes(nodes, corruptionSet);
        solveNodes(nodes);
        const works = exitNode.distance !== Infinity;

        if (!works)
            lowestBreaking = lastAttempt;
        else
            highestWorking = lastAttempt;

        lastAttempt = Math.floor((lowestBreaking + highestWorking) / 2);
    }

    console.log(`Part 2: ${corruptions[lowestBreaking].join(',')}`);
}