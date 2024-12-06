const tests = {
	input: 
// `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
	first: 161,
	second: 48
};

import { log, logList } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";

const findAnswers = (input: string, entries: string[][] | string[][][]) => {

	const singleLine = puzzle.entries.join();

	const answers = { first: part1Solution(singleLine), second: part2Solution(singleLine) };
	return answers;
};

const part1Solution = (input: string): number => {
	return sumProducts(input);
}

const part2Solution = (input: string): number => {
	const doParts = removeDontParts(input);
	log (input);
	log (doParts);
	const sum = sumProducts(doParts.join(""));
	log (sum);

	// 2234960 is too low
	// 50493123 is too low
	// 101158777 is too high

	//99532691
	return sum;
}

export const removeDontParts = (input: string): string[] => {
	const doParts = input.split(/don't\(\).*do\(\)/g);
	log (input);
	log (doParts);
	const doPartsWithDoRemoved = doParts.map(part => part.replace(/do\(\)/g, ""));
	return doPartsWithDoRemoved;
}

const sumProducts = (input: string): number => {
	const attemptsFromRegex = input.match(/mul\(([0-9])*,([0-9])*\)/g);
	// console.log (attemptsFromRegex);
	// console.log ( attemptsFromRegex?.length);
	const sum = attemptsFromRegex?.reduce((acc, attempt) => {
		// given a string like mul(2,4), multiply the 2 and the 4 together, then add it to the accumulator
		const nums = attempt.substring(4, attempt.length - 1).split(",");
		const product = parseInt(nums[0]) * parseInt(nums[1]);
		return acc + product;
	}, 0);
	log (sum);
	return sum ?? 0;
}


const testPart1 = async (input: string): Promise<boolean> => {
	if(tests.first === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(input, entries);
	return answers.first === tests.first;
};
const solvePart1 = async (): Promise<number> => {
	if(tests.first === 0){ return 0; }
	const puzzle_input = await puzzle.parseInput();
	const input = puzzle_input.entries.join();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(input, entries);
	return answers.first;
};
const testPart2 = async (input: string): Promise<boolean> => {
	log ("==================================== testPart2 ====================================")
	if(tests.second === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(input, entries);
	return answers.second === tests.second;
};
const solvePart2 = async (): Promise<number> => {
	if(tests.second === 0){ return 0; }
	const puzzle_input = await puzzle.parseInput();
	const input = puzzle_input.entries.join();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(input, entries);
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

const part1_correct = await testPart1(tests.input);
let check = part1_correct ? '✅' : '❌';

const part1 = part1_correct ? await solvePart1() : null;
log("    part 1: ", part1, check);

const part2_correct = await testPart2(tests.input);
check = part2_correct ? '✅' : '❌';

const part2 = part2_correct ? await solvePart2() : null;
log("    part 2: ", part2, check);