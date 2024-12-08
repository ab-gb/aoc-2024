const tests = {
	input: 
`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
	first: 143,
	second: 123
};

import { log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";

interface PageLists {
	validPageLists: string[];
	invalidPageLists: string[];
}

const findAnswers = (input: string) => {
	const parts = input.split("\n\n");

	const sortingRules = parts[0]
		.split("\n")
		.map((rule) => rule.split("|"));

	const pages = parts[1].split("\n");

	const sortedPageLists = perf(() => categorizePageListsWithSorting(pages, sortingRules)); // 25 milliseconds

	const answers = { first: sumMiddleNumber(sortedPageLists.validPageLists), second: sumMiddleNumber(sortedPageLists.invalidPageLists) };

	return answers;
};

const categorizePageListsWithSorting = (pageLists: string[], rules: string[][]): PageLists => {
	const validPageLists = [] as string[];
	const invalidPageLists = [] as string[];

	pageLists.forEach((pageList) => {

		const sortedPageSet = sortPageset(pageList, rules).join(",");
		if ( pageList === sortedPageSet ) {
			validPageLists.push(pageList);
		} else {
			invalidPageLists.push(sortedPageSet);
		}

	});

	return {validPageLists: validPageLists, invalidPageLists: invalidPageLists};
}

export const sortPageset = (page: string, rules: string[][]) : string[] => {
	const pageNumbers =page.split(",");

	// only include rules that where both numbers are in the pageNumbers list.
	const relevantRules = rules.filter(rule => {
		const [firstNumber, secondNumber] = rule;
		return pageNumbers.includes(firstNumber) && pageNumbers.includes(secondNumber);
	});

	let sorted = false;
	while (!sorted) {
		sorted = true;
		relevantRules.forEach(rule => {
			const [firstNumber, secondNumber] = rule;
			const firstIndex = pageNumbers.indexOf(firstNumber);
			const secondIndex = pageNumbers.indexOf(secondNumber);
			if(firstIndex > secondIndex){
				swap(pageNumbers, firstIndex, secondIndex);
				sorted = false;
			}
		});
	}
	return pageNumbers;
}

export const swap = (arr: string[], index1: number, index2: number) => {
	const temp = arr[index1];
	arr[index1] = arr[index2];
	arr[index2] = temp;
}

export const sumMiddleNumber = (arr: string[]): number => {
	let sum = 0;
	arr.forEach( pageList =>
	{
		const pageNumbers = pageList.split(",");
		sum += getMiddleOfArray(pageNumbers);
	});

	return sum;
}

export const getMiddleOfArray = (arr: string[]): number => {
	const middle = Math.floor(arr.length / 2);
	return parseInt(arr[middle]);
}

const categorizePageLists = (pageLists: string[], rules: string[]): PageLists => {
	const validPageLists = [] as string[];
	const invalidPageLists = [] as string[];

	const start = performance.now();

	pageLists.forEach((pageList) => {
		const pageNumbers = pageList.split(",");

		const relevantRules = rules.filter(rule => pageNumbers.some(num => rule.includes(num)));
		if (isPageListSorted(pageNumbers, relevantRules)) {
			validPageLists.push(pageList);
		} else {
			invalidPageLists.push(pageList);
		}
	});
	const end = performance.now();
	log ("time:" + (end-start));

	return {validPageLists: validPageLists, invalidPageLists: invalidPageLists};
}

export const isPageListSorted = (pageList: string[], rules: string[]): boolean => {
	let sortFailed = true;

	const relevantRules = rules.filter(rule => pageList.some(num => rule.includes(num))); // 11 seconds

	let i = 0;
	while (sortFailed && i<relevantRules.length) {

		// This seems unnecessary and will process EVERY record.
		// if(relevantRules.some(rule => {
		// 	// does this process every single one?
		// 	const [first, second] = rule.split("|");
		// 	const firstIndex = pageNumbers.indexOf(first);
		// 	const secondIndex = pageNumbers.indexOf(second);
		// 	if(firstIndex === -1 || secondIndex === -1){
		// 		return false;
		// 	}
		// 	return firstIndex > secondIndex;
		// })){
		// 	sortOk = false;
		// }

		if (relevantRules.every(rule => {
			const [first, second] = rule.split("|");
			const firstIndex = pageList.indexOf(first);
			const secondIndex = pageList.indexOf(second);
			if(firstIndex === -1 || secondIndex === -1){
				return true;
			}
			return firstIndex < secondIndex;
		})){
			sortFailed = false;
		}

		i++;
	}

	return !sortFailed;
}

const testPart1 = async (input: string): Promise<boolean> => {
	if(tests.first === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(input);
	return answers.first === tests.first;
};
const solvePart1 = async (): Promise<number> => {
	if(tests.first === 0){ return 0; }
	const puzzle_input = await puzzle.parseInput();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(puzzle_input.input);
	return answers.first;
};

const solveBoth = async (): Promise<{first: number, second: number}> => {
	if(tests.first === 0){ return {first: 0, second: 0}; }
	const puzzle_input = await puzzle.parseInput();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(puzzle_input.input);
	return answers;
};

const testPart2 = async (input: string): Promise<boolean> => {
	if(tests.second === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(input);
	return answers.second === tests.second;
};
const solvePart2 = async (): Promise<number> => {
	if(tests.second === 0){ return 0; }
	const puzzle_input = await puzzle.parseInput();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(puzzle_input.input);
	return answers.second;
};

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

const part2_correct = await testPart2(tests.input);
check = part2_correct ? '✅' : '❌';

const both = await solveBoth();

log("    part 1: ", both.first, check);
log("    part 2: ", both.second, check);