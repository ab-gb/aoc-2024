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

import { log, logList } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";


const findAnswers = (input: string, entries: string[][] | string[][][]) => {
	const parts = input.split("\n\n");

	const sortingRules = parts[0].split("\n");
	const validPageSets = [] as string[];
	const invalidPageSets = [] as string[];

	const pages = parts[1].split("\n");
	log ("pagecount:" + pages.length);

	const start = performance.now();
	pages.forEach((page, index) => {
		const pageNumbers = page.split(",");
		let sortOk = true;

		const relevantRules = sortingRules.filter(rule => pageNumbers.some(num => rule.includes(num))); // 11 seconds
		// const relevantRules = sortingRules; // 37 seconds
		let sortFailed = true;

		let i = 0;
		while (sortFailed && i<relevantRules.length) {

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
				const firstIndex = pageNumbers.indexOf(first);
				const secondIndex = pageNumbers.indexOf(second);
				if(firstIndex === -1 || secondIndex === -1){
					return true;
				}
				return firstIndex < secondIndex;
			})){
				sortFailed = false;
			}

			i++;
		}

		if (sortFailed) {
			invalidPageSets.push(page);
		} else {
			validPageSets.push(page);
		}

	});

	const end = performance.now();
	log ("time to process:" + (end-start));

	log ("invalidPageSets.length:" + invalidPageSets.length);

	let part2 = 0;
	// TODO  determine time it takes to sort the invalid pagesets


	const sortedPageSets = invalidPageSets.map(pageSet => {
		return sortPageset (pageSet, sortingRules).join(",");
	});
	part2 = sumMiddleNumber(sortedPageSets);

	const answers = { first: sumMiddleNumber(validPageSets), second: part2 };

	// Create a Set of all the numbers and the numbers they need to precede.
	// Then loop over each row and for each number, check if if there are any numbers in the remaining portion of the list that is need to be before.

	return answers;
};

const findMyAnswers = (input: string, entries: string[][] | string[][][]) => {
	const parts = input.split("\n\n");

	const sortingRules = parts[0].split("\n");
	const sortingRulesMap = createSortingMap(sortingRules);
	log ("sortMap for 75:", sortingRulesMap.get("75"));

	const validPageSets = [] as string[];
	const invalidPageSets = [] as string[];

	const pageLists = parts[1].split("\n");
	log ("pageListCount:" + pageLists.length);

	pageLists.forEach((pages, index) => {
		log ("page:" + index);
		const pageNumbers = pages.split(",");
		let sortOk = true;
		
		let i = 0;

		while (sortOk && i<pageNumbers.length) {
			const pageNumber = pageNumbers[i];
			const numbersThatPageMustBeBefore = sortingRulesMap.get(pageNumber);
			const numbersThatPageMustBeAFter = sortingRulesMap.get(pageNumber);

			const remainingPages = pageNumbers.slice(i+1);
			// log ("pgNumber" + pageNumber);
			// log ("numbers that MUST be after:" + numbersThatMustBeAfter);
			sortOk = remainingPages.some(remainingPage => {
				if(numbersThatPageMustBeAFter && numbersThatPageMustBeAFter.includes(remainingPage)){
					// log ("remainingPage:" + remainingPage);
					return true;
				}
				return false;
			});
			// if(numbersToPrecede){
			// 	const numbersToPrecedeIndexes = numbersToPrecede.map(num => pageNumbers.indexOf(num));
			// 	if(numbersToPrecedeIndexes.some(index => index > i)){
			// 		sortOk = false;
			// 	}
			// }
			i++;
		}

		if (sortOk) {
			validPageSets.push(pages);
		} else {
			invalidPageSets.push(pages);
		}

	});

	log ("invalidPageSets:" + invalidPageSets);

	let part2 = 0;
	// const sortedPageSets = invalidPageSets.map(pageSet => {
	// 	return sortPageset (pageSet, sortingRules).join(",");
	// });
	// part2 = sumMiddleNumber(sortedPageSets);

	const answers = { first: sumMiddleNumber(validPageSets), second: part2 };

	// Create a Set of all the numbers and the numbers they need to precede.
	// Then loop over each row and for each number, check if if there are any numbers in the remaining portion of the list that is need to be before.

	return answers;
};

const createSortingMap = (sortingRules: string[]): Map<string, string[]> => {
	const sortingRulesMap = new Map<string, string[]>();
	sortingRules.forEach(rule => {
		const [first, second] = rule.split("|");
		if(sortingRulesMap.has(first)){
			sortingRulesMap.get(first)?.push(second);
		} else {
			sortingRulesMap.set(first, [second]);
		}
	});
	return sortingRulesMap;
}

export const sortPageset = (page: string, rules: string[]): string[] => {
	const pageNumbers = page.split(",");
	const pageNumbersCopy = [...pageNumbers];
	const relevantRules = rules.filter(rule => pageNumbers.some(num => rule.includes(num)));

	let sortOk = false;
	while (!sortOk) {
		sortOk = true;
		relevantRules.forEach(rule => {
			const [first, second] = rule.split("|");
			const firstIndex = pageNumbersCopy.indexOf(first);
			const secondIndex = pageNumbersCopy.indexOf(second);
			if(firstIndex === -1 || secondIndex === -1){
				return;
			}
			if(firstIndex > secondIndex){
				pageNumbersCopy[firstIndex] = second;
				pageNumbersCopy[secondIndex] = first;
				sortOk = false;
			}
		});
	}
	return pageNumbersCopy;
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
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(puzzle_input.input,entries);
	return answers.first;
};

const solveBoth = async (): Promise<{first: number, second: number}> => {
	if(tests.first === 0){ return {first: 0, second: 0}; }
	const puzzle_input = await puzzle.parseInput();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(puzzle_input.input,entries);
	return answers;
};

const testPart2 = async (input: string): Promise<boolean> => {
	if(tests.second === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(input, entries);
	return answers.second === tests.second;
};
const solvePart2 = async (): Promise<number> => {
	if(tests.second === 0){ return 0; }
	const puzzle_input = await puzzle.parseInput();
	const entries = puzzle_input.blocks.length > 0 ? puzzle_input.blocks : puzzle_input.blocks[0];
	const answers = findAnswers(puzzle_input.input,entries);
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

const part2_correct = await testPart2(tests.input);
check = part2_correct ? '✅' : '❌';

const both = await solveBoth();

// const part1 = part1_correct ? await solvePart1(): null;
log("    part 1: ", both.first, check);

// const part2 = part2_correct ? await solvePart2(): null;
log("    part 2: ", both.second, check);