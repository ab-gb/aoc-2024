const tests = {
	input:
`2333133121414131402`,
	first: 1928,
	second: 2858
};

import { log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";
import { assert } from "@std/assert";

const FREE_SPACE = ".";

interface Block {
	fileId?: number,
	size: number
}

export const checkSum = ( input: string[] ): number => {
	log("checkSum...");

	const arr = input.map( (n) => {
		if ( n.indexOf(FREE_SPACE) > -1 ) {
			// return 0 for each FREE_SPACE character
			// fill an array with 0's for each FREE_SPACE character.
			return Array(n.length).fill(0);
		} else {
			return parseInt(n);
		}
	}).flat();

	const sum = arr.reduce((acc, n, i) => {
		acc += parseInt(n) * i;
		return acc;
	}, 0);
	log ("sum:", sum);
	return sum;
}

const checkSumBlocks = ( blocks: Block[] ): number => {

	const arr = blocks.map( (b) => {
		if (b.size <= 0) {
			return [];
		}

		if ( b.fileId == null ) {
			// return 0 for each FREE_SPACE character
			// fill an array with 0's for each FREE_SPACE character.
			// log ("filling with 0's", b.size);
			return b.size > 0 ? Array(b.size).fill(0): [];
		} else {
			// log (`filling with ${b.fileId}s`, b.size);
			return Array(b.size).fill(b.fileId);
		}
	}).flat();

	const sum = arr.reduce((acc, n, i) => {
		acc += parseInt(n) * i;
		return acc;
	}, 0);
	log ("sum:", sum);
	return sum;
}

assert (checkSum(["0", "0", "9", "9", "8", "1", "1", "1", "8", "8", "8", "2", "7", "7", "7", "3", "3", "3", "6", "4", "4", "6", "5", "5", "5", "5", "6", "6"] ) == 1928, "check sum failed");
assert (checkSum(["0","0","9","9","2","1","1","1","7","7","7",".","4","4",".","3","3","3",".",".",".",".","5","5","5","5",".","6","6","6","6",".",".",".",".",".","8","8","8","8"] ) == 2858, "check sum failed");
assert (checkSum(["0","0","9","9","2","1","1","1","7","7","7",".","4","4",".","3","3","3","..",".",".","5","5","5","5",".","6","6","6","6",".",".",".",".",".","8","8","8","8"] ) == 2858, "check sum failed");

interface DiskMap {
	condensed: string;
	expanded: string;
	reformatted: string;
}

const findAnswers = (input: string) => {

	log ("expanding...");
	const expanded = expand ( input.trim() );

	log ("reformatting...");
	const reformatted = reformat ( expanded );

	if ( input == "2333133121414131402") {
		log (reformatted);
		log (reformatted.join(""));
	}

	const part1 = checkSum(reformatted);

	let part2 = 0;
	const reformattedWholeFiles = reformatWholeFiles ( expandWithFreeSpaceBlocks ( input.trim() ) );
	part2 = checkSumBlocks(reformattedWholeFiles);
	log ( "part2", part2);

	const answers = { first: part1, second: part2 };
	return answers;
};

export const expand = ( diskMap: string ): string[] => {
	const files = diskMap.split("").filter( (n,i) => i % 2 === 0);
	const freeSpaces = diskMap.split("").filter( (n,i) => i % 2 === 1);

	const expandedDiskMap : string[] = [];
	for (let i=0; i<files.length; i++){
		const fileSize = parseInt(files[i]);
		for (let j=0; j<fileSize; j++){
			expandedDiskMap.push (i.toString());
		}
		if ( i < freeSpaces.length ) {
			for (let j=0; j<parseInt(freeSpaces[i]); j++){
				expandedDiskMap.push(FREE_SPACE);
			}
		}
	}

	return expandedDiskMap;
}

export const reformat = ( diskMapArray: string[] ) : string[]=> {
	const reformattedDisk :string[] = [];

	while (diskMapArray.includes(FREE_SPACE)) {

		const char = diskMapArray.shift();
		if (char === FREE_SPACE) {
			let block = diskMapArray.pop();

			while ( block === FREE_SPACE && diskMapArray.length > 0 ) {
				block = diskMapArray.pop();
			}

			reformattedDisk.push(block!);

		} else {
			reformattedDisk.push(char!);
		}
	}

	while (diskMapArray.length > 0)
	{
		reformattedDisk.push(diskMapArray.pop()!);
	}

	return reformattedDisk;
}

export const expandWithFreeSpaceBlocks = ( diskMap: string ): Block[] => {
	const files = diskMap.split("").filter( (n,i) => i % 2 === 0);
	const freeSpaces = diskMap.split("").filter( (n,i) => i % 2 === 1);

	const blocks: Block[] = [];

	for (let i=0; i<files.length; i++){
		const fileSize = parseInt(files[i]);

		blocks.push({ fileId: i, size: fileSize });

		if ( i < freeSpaces.length ) {
			blocks.push({ size: parseInt(freeSpaces[i]) });
		}
	}

	return blocks;
}

const logBlocks = (blocks: Block[] ) => {
	const arr = blocks.map( (b) => {
		if (b.size <= 0) {
			return [];
		}

		if ( b.fileId == null ) {
			// return 0 for each FREE_SPACE character
			// fill an array with 0's for each FREE_SPACE character.
			// log ("filling with 0's", b.size);
			return b.size > 0 ? Array(b.size).fill(0): [];
		} else {
			// log (`filling with ${b.fileId}s`, b.size);
			return Array(b.size).fill(b.fileId);
		}
	}).flat();

	log ( "arr:" + arr.join(""));
}

export const reformatWholeFiles = ( blocks: Block[] ) : Block[]=> {

	const fileIds = blocks
		.filter( (b) => b.fileId != null)
		.sort ( (a,b) => a.fileId! - b.fileId!);

	// loop over the fildIds in descending order.
	for (let i=fileIds.length-1; i>=0; i--){
		const fileBlock = fileIds[i];

		// if a FreeSpace block exists that can fit the file, then go find it.
		const freeSpaceIndex = blocks.findIndex ( (b) => b.fileId == null && b.size >= fileBlock.size );

		if (freeSpaceIndex == -1) {
			// log ("no free space found for fileId:", fileId);
			continue;
		}

		const fileIndex = blocks.findIndex ( (b) => b.fileId == fileBlock.fileId );

		if (freeSpaceIndex > fileIndex) {
			// log("Don't move, it's already in the right place.");
			continue;
		}

		// log ( `fileId (${fileId.fileId} at index ${fileIndex}) can fit in freeSpace (${freeSpaceIndex})`);

		// we can move the file, so set these as freespace.
		blocks.splice(fileIndex, 1, { size: fileBlock.size });

		const freeSpaceBlock = blocks[freeSpaceIndex];
		if ( freeSpaceBlock.size == fileBlock.size)
		{
			blocks[freeSpaceIndex] = fileBlock;
		} else {
			// move the fileBlock and preserve any unused freespace.
			const freeSpaceItem = blocks[freeSpaceIndex];
			freeSpaceItem.size = freeSpaceItem.size - fileBlock.size;
			blocks.splice(freeSpaceIndex, 1, fileBlock, freeSpaceItem);
		}
	}

	return blocks;
}

const solvePart1 = (): number=> {
	return 0;
}

const solvePart2 = (): number=> {
	return 0;
}

const solveBoth = async (): Promise<{first:number, second:number}> => {
	if(tests.first === 0){ return {first: 0, second: 0 }};
	const puzzle_input = await puzzle.parseInput();
	const answers = findAnswers(puzzle_input.input);
	return answers;
};

const testPart1 = async (input: string): Promise<boolean> => {
	if(tests.first === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const answers = findAnswers(puzzle_input.input);

	log ( answers.first, tests.first);
	return answers.first == tests.first;
};

const testPart2 = async (input: string): Promise<boolean> => {
	if(tests.second === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const answers = findAnswers(puzzle_input.input);
	log ( answers.second, tests.second);

	return answers.second === tests.second;
};

const part1_correct = await testPart1(tests.input);
const checkPart1 = part1_correct ? '✅' : '❌';

const part2_correct = await testPart2(tests.input);
const checkPart2 = part2_correct ? '✅' : '❌';

const {first, second} = await solveBoth();

log("    part 1: ", first, checkPart1);
log("    part 2: ", second, checkPart2);

