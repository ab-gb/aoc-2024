const tests = {
	input: 
`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
	first: 0,
	second: 0
};

import { getGrid, log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";
import { assert } from "@std/assert";

const defineSymbols = () => {
	const symbols = {
	};
	return symbols;
};

const symbols = defineSymbols();

const findAnswers = (input: string) => {
	log (input);
	const part1 = perf ( () => solvePart1());
	const part2 = perf ( () => solvePart2());

	const answers = { first: part1, second: part2 };
	return answers;
};

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

const {first, second} = part1_correct ? await solveBoth() : {first: null, second: null};

log("    part 1: ", first, checkPart1);
log("    part 2: ", second, checkPart2);

