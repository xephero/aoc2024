import { readDayInput } from "../utility";

export function day23() {
    const input = readDayInput(23);

    const links = input.split('\n').map(l => l.split('-'));

    const computers: {[key: string]: string[]} = {};

    // Find all first-order links
    for (const link of links) {
        const a = link[0];
        const b = link[1];

        if (a in computers)
            computers[a].push(b);
        else
            computers[a] = [b];

        if (b in computers)
            computers[b].push(a);
        else
            computers[b] = [a];
    }

    // Find triplets
    const networks = new Set<string>();

    for (const [source, links] of Object.entries(computers)) {
        // No t computers in this network, pass
        if (!source.startsWith('t'))
            continue;

        for (const sourceLink of links) {
            for (const nextLink of links) {
                if (sourceLink === nextLink)
                    continue;

                if (computers[sourceLink].includes(nextLink))
                    networks.add([source, sourceLink, nextLink].sort().join(','));
            }
        }
    }

    console.log(`Part 1: ${networks.size}`);

    // Find full sets of connections
    const fullNetworks: string[][] = [];
    for (const [source, links] of Object.entries(computers)) {

        // Scan through all existing networks
        for (const candidate of fullNetworks) {
            let foundBreak = false;

            // If every link in that network is also linked to source, add this
            for (const candidateLink of candidate)
                if (!links.includes(candidateLink))
                    foundBreak = true;

            if (!foundBreak)
                candidate.push(source);
        }

        // Add these networks
        for (const link of links) {
            let foundMatch = false;
            for (const candidate of fullNetworks)
                if (candidate.length === 2 && candidate.includes(source) && candidate.includes(link))
                    foundMatch = true;

            if (!foundMatch)
                fullNetworks.push([source, link]);
        }  
    }

    // Find the longest array and join it
    const biggest = fullNetworks.reduce((a, b) => a.length > b.length ? a : b);
    const password = biggest.sort().join(',');

    console.log(`Part 2: ${password}`);

}