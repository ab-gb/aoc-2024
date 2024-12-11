const tests = {
	input: 
`125 17`,
	first: 55312,
	second: 65601038650482
};

import { log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";
import { assert } from "@std/assert";
import { LinkedList } from "./linked-list.ts";


interface Pair {
	first: number;
	second: number;
}

const splitMap = new Map<number, Pair>();
const multMap = new Map<number, number>();

const findAnswers = (input: string) => {

	log (input);

	log ("part1");
	const part1 = perf( () => numberAsObjectWithCountSolution(input, 25)) ;

	log ("part2");
	const part2 = perf( () =>numberAsObjectWithCountSolution(input, 75) );

	const answers = { first: part1, second: part2 };
	return answers;
};

interface Stone {
	value: number;
	count: number;
}

const numberAsObjectWithCountSolution = (input: string, blinks: number) => {

	const stones = input.split(" ").map(Number);

	let stoneMap = getUniqueStoneMap(stones);

	for (let i=0; i<blinks; i++){
		const newStoneMap = new Map<number, Stone>();

		stoneMap.forEach( (stone) => {

			if (stone.value == 0 ) {
				const currentCount = newStoneMap.get(1)?.count ?? 0;
				newStoneMap.set(1, {value: 1, count: currentCount + stone.count});
			} else if (isEvenLength(stone.value)) {
				const first = parseInt(stone.value.toString().substring(0, stone.value.toString().length / 2));
				const second = parseInt(stone.value.toString().substring(stone.value.toString().length / 2));
				let currentCount = newStoneMap.get(first)?.count ?? 0;
				newStoneMap.set(first, {value: first, count: currentCount + stone.count});

				currentCount = newStoneMap.get(second)?.count ?? 0;
				newStoneMap.set(second, {value: second, count: currentCount + stone.count});
			} else {
				const product = stone.value * 2024;
				const currentCount = newStoneMap.get(product)?.count ?? 0;
				newStoneMap.set(product, {value: product, count: currentCount + stone.count});
			}
		});

		stoneMap = newStoneMap;

	}

	return totalStones(stoneMap);
}

const totalStones = (stoneMap: Map<number, Stone>): number => {
	let sum = 0;
	stoneMap.forEach( stone => sum += stone.count);
	return sum;
}

const getUniqueStoneMap = (stones: number[]): Map<number, Stone> => {
	const stoneMap = new Map<number, Stone>();
	stones.forEach( n => {
		const stone = stoneMap.get(n);
		if (stone == null) {
			stoneMap.set(n, {value: n, count: 1});
		} else {
			stone.count++;
		}
	});
	return stoneMap;
}

const arraySolution = (input: string, blinks: number) => {
	let stones = input.split(" ").map(Number);

	for (let i=0; i<blinks; i++){
		const new_stones = [];

		log (`applying ${i}...`);
		// iterate over the list
		for (let j=0; j<stones.length; j++) {
			const n = stones[j];
			if (n == 0 ) {
				new_stones.push(1);
			} else if (isEvenLength(n)) {
				const first = parseInt(n.toString().substring(0, n.toString().length / 2));
				const second = parseInt(n.toString().substring(n.toString().length / 2));
				new_stones.push(first);
				new_stones.push(second);
			} else {
				new_stones.push(n * 2024);
			}
		}
		stones = new_stones;
	}

	const length = stones.length;
	log ( length );
	return length;
}

const listSolution = (input: string) => {

	const list = new LinkedList<number>();

	const numbers = input.split(" ").map(Number);
	numbers.forEach(n => list.append(n));

	for (let i=0; i<75; i++){
		log (`applying ${i}...`);
		// iterate over the list
		let current = list.head;
		while (current != null) {

			if (current.data == 0 ) {
				current.data = 1;
			} else if (isEvenLength(current.data)) {
				let pair = splitMap.get(current.data);
				if (pair == null) {
					const first = parseInt(current.data.toString().substring(0, current.data.toString().length / 2));
					const second = parseInt(current.data.toString().substring(current.data.toString().length / 2));
					pair = {first, second};
					splitMap.set(current.data, pair);
				}

				list.replaceNode(current, pair.first, pair.second);
			} else {
				let product = multMap.get(current.data);
				if (product == null) {
					product = current.data * 2024;
					multMap.set(current.data, current.data * 2024);
				}
				current.data = product;
			}

			current = current.next;
		}
	}

	const length = list.length();
	log ( length );
	return length;
}

const isEvenLength = (n: number): boolean => {
	const numberOfDigits = countDigits(n);
	return numberOfDigits % 2 == 0;
}

function countDigits(num: number): number {
	if (num === 0) return 1;
	let count = 0;
	while (num > 0) {
		count++;
		num = Math.floor(num / 10);
	}
	return count;
}

assert(isEvenLength(17) === true);
assert(isEvenLength(1234) === true);

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



