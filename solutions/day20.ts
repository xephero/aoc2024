import { readDayInput } from "../utility";

type Node = {
    row: number;
    col: number;
    distance: number;
    visited: boolean;
    isStart: boolean;
    isEnd: boolean;
}

function getNode(nodes: Node[], row: number, col: number, any = false) {
    return nodes.find(n =>
        n.row === row
        && n.col === col
        && (any || !n.visited)
    );
}

function getNextNode(nodes: Node[]) {
    let lowest: Node | null = null;

    const viableNodes = nodes.filter(n => !n.visited && n.distance !== Infinity);

    for (const node of viableNodes) {
        if (lowest === null || node.distance < lowest.distance)
            lowest = node;
    }

    return lowest;
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

function findCheats(nodes: Node[], max: number) {
    let cheats = new Set<string>;

    for (const start of nodes) {
        const sRow = start.row;
        const sCol = start.col;

        const reachableNodes = nodes.filter(n => Math.abs(n.row - sRow) + Math.abs(n.col - sCol) <= max);

        for (const end of reachableNodes) {
            const eRow = end.row;
            const eCol = end.col;

            const travel = Math.abs(eRow - sRow) + Math.abs(eCol - sCol);
            const timeSaved = end.distance - start.distance - travel;

            if (timeSaved >= 100)
                cheats.add(`${sRow},${sCol}=>${eRow},${eCol}`);
        }
    }

    return cheats.size;
}

export function day20() {
    const input = readDayInput(20);

    const grid = input.split('\n').map(l => l.split(''));

    const nodes: Node[] = [];

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const spot = grid[row][col];

            if (spot !== '#') {
                nodes.push({
                    row,
                    col,
                    visited: false,
                    distance: spot === 'S' ? 0 : Infinity,
                    isStart: spot === 'S',
                    isEnd: spot === 'E',
                });
            }
        }
    }

    solveNodes(nodes);

    console.log(`Part 1: ${findCheats(nodes, 2)}`);
    console.log(`Part 2: ${findCheats(nodes, 20)}`);
}