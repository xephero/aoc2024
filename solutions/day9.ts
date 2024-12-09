import { readDayInput } from "../utility";

export function day9() {
    const input = readDayInput(9);

    const diskMap = input.split('').map(n => parseInt(n));

    const fileSizes: number[] = [];
    const freeSizes: number[] = [];
    const disk: number[] = [];

    // Split into respective types
    for (let i = 0; i < diskMap.length; i++) {
        if (i % 2 === 0)
            fileSizes.push(diskMap[i]);
        else
            freeSizes.push(diskMap[i]);
    }

    // Create the sparse array with free blocks represented by negatives
    let id = 0;
    while (fileSizes.length > 0 || freeSizes.length > 0) {
        const nextSize = fileSizes.shift() ?? 0;
        const nextFree = freeSizes.shift() ?? 0;

        for (let i = 0; i < nextSize; i++)
            disk.push(id);

        for (let i = 0; i < nextFree; i++)
            disk.push(-nextFree);

        id += 1;
    }

    const fragmentedDisk = [...disk];

    // Move the files
    while (!fragmentedDisk.every(f => f >= 0)) {
        const lastFile = fragmentedDisk.pop() ?? -1;
        fragmentedDisk[fragmentedDisk.findIndex(f => f < 0)] = lastFile;
    }

    // Calculate the checksum
    let total = 0;
    for (let i = 0; i < fragmentedDisk.length; i++)
        total += i * fragmentedDisk[i];

    console.log(`Part 1: ${total}`);

    // Iterate forward to find empty spaces
    for (let cursor = 0; cursor < disk.length; cursor++) {
        if (disk[cursor] >= 0)
            continue;

        // We are in some contiguous block of free space now
        const sizeToFill = -disk[cursor];

        // Scan backwards for a file that is <= that size
        let foundRev = disk.length;
        for (let rev = disk.length - 1; rev > cursor; rev--) {
            // Not a file, move on
            if (disk[rev] < 0)
                continue;

            // we have found a file! check its size by finding its start
            const fileStart = disk.indexOf(disk[rev]);
            const fileSize = rev - fileStart + 1;

            // Too big, skip past this file and move on
            if (fileSize > sizeToFill) {
                rev = fileStart;
                continue;
            }

            // Got a file, fits in the space, let's move it
            for (let move = 0; move < fileSize; move++) {
                disk[cursor + move] = disk[rev - move];
                disk[rev - move] = -fileSize;
            }

            // Update the free block size past this
            const newFreeSpace = sizeToFill - fileSize;
            for (let updateFree = 0; updateFree < newFreeSpace; updateFree++) {
                disk[cursor + fileSize + updateFree] = -newFreeSpace;
            }

            // All done, next file
            foundRev = rev;
            break;
        }

        // If the search completed without finding a solution, we're done
        if (foundRev <= cursor + 1)
            break;
    }

    // Calculate the checksum
    let contigTotal = 0;
    for (let i = 0; i < disk.length; i++) {
        if (disk[i] > 0)
            contigTotal += i * disk[i];
    }

    console.log(`Part 2: ${contigTotal}`);

}