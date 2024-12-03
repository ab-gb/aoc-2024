const tests = {
	input: 
`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
// `49 50 52 54 54`,
	first: 2,
	second: 4
};

import { log, logList } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";

const findAnswers = async (rows: string[], entries: string[][] | string[][][]) => {
	log ("-------------------");

	// log ("rows: ", rows);

	const part1Try1 = countSafe(rows, 0);
	// const part1Try2 = countSafer(rows, 0);

	log ( "part1Try1.count", part1Try1.count);
	// log ( "part1Try2.count", part1Try2.count);


	const part2Try1 = countSafe(rows, 1);
	// const part2Try2 = countSafer(rows, 1);

	const part2BruteForce = countSafeBruteForce(rows, 1);

	// find the difference between the two.
	const diff = part2Try1.safeRows.filter((row) => !part2BruteForce.safeRows.includes(row));

	// await Deno.writeTextFile("./safe.txt", part2Try1.safeRows.join("\n"));
	// await Deno.writeTextFile("./brute.txt", part2BruteForce.safeRows.join("\n"));

	// log (part2Try1.safeRows);
	// log (diff);
	// log (part2BruteForce.safeRows);

	const answers = { first: part1Try1.count, second: part2Try1.count };
	return answers;
};

export const countSafeBruteForce = (rows: string[], damper: number) => {
	const safeRows: string[] = [];
	const unsafeRows: string[] = [];
	for (let index = 0; index < rows.length; index++) {
		const row = rows[index];
		const rowAsNumbers = row.split(" ").map((num) => parseInt(num));
		if (isSafe(rowAsNumbers, 0)) {
			safeRows.push(row);
			continue;
		}

		// if we're here, it wasn't safe.
		if (damper > 0 ) {
			for (let i = 0; i < rowAsNumbers.length; i++) {
				// remove the number at index i
				const rowCopy = rowAsNumbers.slice();
				rowCopy.splice(i, 1);
				if (isSafe(rowCopy, 0)) {
					safeRows.push(row);
					break;
				}
			}
		}
	}

	log ("safeRows", safeRows);

	return { count: safeRows.length, safeRows, unsafeRows };
}

export const countSafe = (rows: string[], damper: number) => {
	const safeRows: string[] = [];
	const unsafeRows: string[] = [];
	rows.forEach((row, index) => {

		const rowAsNumbers = row.split(" ").map((num) => parseInt(num));
		if (isSafe(rowAsNumbers, damper) ||
				(damper > 0 && (
					isSafe (rowAsNumbers.slice(1), 0) || 
					isSafe (rowAsNumbers.slice(0, rowAsNumbers.length - 1), 0))
				)
			){
				safeRows.push(row);
		} else {
			unsafeRows.push(row);
			// log ( rowAsNumbers.join(" ") );
		}
	});
	

	return { count: safeRows.length, safeRows, unsafeRows };
}

export const isSafe = (numberList: number[], damper: number) : boolean => {
	let increasedUnsafeLevelCount = 0;
	let decreasedUnsafeLevelCount = 0;

	let incOffset = 1;
	let decOffset = 1;

	for (let i=1; i<numberList.length; i++){
		if (increasedUnsafeLevelCount <= damper){
			const otherNumber = numberList[i-incOffset];
			const difference = numberList[i] - otherNumber;
			log ( numberList.join(" ") );
			log ("compare..." + numberList[i] + "-" + otherNumber +  "=" + difference);

			if (difference <= 0 || difference > 3){
				increasedUnsafeLevelCount++;
				incOffset++;
				log ("bad!");
			} else {
				incOffset = 1;
				log ("good!");
			}
		}

		if (decreasedUnsafeLevelCount <= damper){
			const otherNumber = numberList[i-decOffset];

			const difference = otherNumber - numberList[i];

			if (difference <= 0 || difference > 3){
				decreasedUnsafeLevelCount++;
				decOffset++;
			}
			else {
				decOffset = 1;
			}
		}

		if (increasedUnsafeLevelCount > damper && decreasedUnsafeLevelCount > damper){
			break; // stop execution.
		}
	}

	// if ( damper != 0 &&  ( allIncreasing == damper + 1 || allDecreasing == damper + 1)){
	// 	const listWithoutFirst = numberList.slice(1);
	// 	const listWithoutFirstIsSafe = isSafe(listWithoutFirst, 0);
	// 	log ("listWithoutFirstIsSafe", listWithoutFirstIsSafe);
	// }

	return (increasedUnsafeLevelCount <=damper || decreasedUnsafeLevelCount <=damper);
}

export const countSafer = (rows: string[], damper: number) => {
	const safeRows: string[] = [];
	const unsafeRows: string[] = [];
	rows.forEach((row) => {
		const rowAsNumbers = row.split(" ").map((num) => parseInt(num));
		if (isSafer(rowAsNumbers, damper)){
			safeRows.push(row);
		} else {
			unsafeRows.push(row);
		}
	});

	return { count: safeRows.length, safeRows, unsafeRows };
}

export const isSafer = (numberList: number[], damper: number) : boolean => {

	// create a copy of the list
	const increasingList = numberList.map((x) => x);
	const decreasingList = numberList.map((x) => x);

	let i = 1;
	while ( i < increasingList.length) {
		const difference = increasingList[i] - increasingList[i-1];
		if ( difference == 0 || difference > 3 ) {
			increasingList.splice(i-1, 1);
		} else if ( difference <0 )
		{
			increasingList.splice(i, 1);
		}
		i++;
	}

	let d = 1;
	while ( d < decreasingList.length) {
		const difference = increasingList[d-1] - increasingList[d];
		if ( difference == 0 || difference > 3 ) {
			// remove an item from an array
			decreasingList.splice(d-1, 1);
		} else if ( difference <0 )
		{
			decreasingList.splice(d, 1);
		}
		d++;
	}

	return ( numberList.length - increasingList.length == damper ) || ( numberList.length - decreasingList.length == damper );
}


const testPart1 = async (input: string): Promise<boolean> => {
	if(tests.first === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = await findAnswers(puzzle_input.entries, entries);
	return answers.first === tests.first;
};
const solvePart1 = async (): Promise<number> => {
	if(tests.first === 0){ return 0; }
	const puzzle_input = await puzzle.parseInput();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = await findAnswers(puzzle_input.entries, entries);
	return answers.first;
};
const testPart2 = async (input: string): Promise<boolean> => {
	if(tests.second === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = await findAnswers(puzzle_input.entries, entries);
	return answers.second === tests.second;
};
const solvePart2 = async (): Promise<number> => {
	if(tests.second === 0){ return 0; }
	const puzzle_input = await puzzle.parseInput();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = await findAnswers(puzzle_input.entries, entries);
	return answers.second;
};


const defineSymbols = () => {
	const symbols = {};
	return symbols;
};
const symbols = defineSymbols();
const scorePart1 = () => {
	const scoring = {} as {[key: string]: number};
	return scoring;
}
const scoring = scorePart1();
const scorePart2 = () => {
	const scoring = {} as {[key: string]: number};
	return scoring;
}
const scoring_2 = scorePart2();

// const part1_correct = await testPart1(tests.input);
// let check = part1_correct ? '✅' : '❌';

// const part1 = await solvePart1();
// log("    part 1: ", part1, check);

// const part2_correct = await testPart2(tests.input);
// check = part2_correct ? '✅' : '❌';

// const part2 = await solvePart2();
// log("    part 2: ", part2, check);