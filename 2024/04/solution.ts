const tests = {
	input:
`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
	first: 18,
	second: 9
};

import { log, logList } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";

const findAnswers = (input: string, entries: string[][] | string[][][]) => {
	const part1 = solutionPart1(input);
	const part2 = solutionPart2(input);

	const answers = { first: part1, second: part2 };
	return answers;
};

export const solutionPart2 = (input: string): number => {
	const sum = countXedMas(getGrid(input.trim()));

	return sum;
}

export const countXedMas = (grid: string[][]) : number => {
	let sum = 0;

	// Loop over the grid and get all the 3x3 subgrids
	const threeByThreeGrids = getThreeByThreeGrids(grid);

	// Now loop over the 3x3 subgrids and check if they are XMAS
	threeByThreeGrids.forEach(subGrid => {
		if (isXedMas(subGrid)) {
			sum++;
		}
	});

	return sum;
}

export const getThreeByThreeGrids = (grid: string[][]) : string[][][] => {
	const subGrids = [];
	const rowCount = grid.length;
	const columnCount = grid[0].length;
	let x = 0, y = 0;
	while (y + 3 <= rowCount) {
		while (x + 3 <= columnCount) {
			subGrids.push(grid.slice(y, y + 3).map(row => row.slice(x, x + 3)));
			x++;
		}
		x = 0;
		y++;
	}
	return subGrids;
}

export const isXedMas = (grid: string[][]) : boolean => {
	const diagnals = getDiagnals(grid);

	const diagnalsWithLength3 = diagnals.filter(diagnal => diagnal.length === 3);

	const isXmas = diagnalsWithLength3.filter(diagnal => diagnal === "MAS" || diagnal === "SAM");

	return isXmas.length == 2;
}

export const solutionPart1 = (input: string): number => {
	const grid = getGrid(input.trim());

	const rows = getRows(grid);
	const columns = getColumns(grid);
	const diagnals = getDiagnals(grid);

	let sum = 0;

	const rowCount = countXmas(rows);
	const columnCount = countXmas(columns);
	const diagnalCount = countXmas(diagnals);

	sum = rowCount + columnCount + diagnalCount;

	return sum;
}

export const getGrid = (input: string) : string[][] => {
	return input.split("\n").map(row => row.split(""));
}

export const getRows = (grid: string[][]) : string[] => {
	return grid.map(row => row.join(""));
}

export const getColumns = (grid: string[][]) : string[] => {
	return grid[0].map((_, i) => grid.map(row => row[i]).join(""));
}

export const getDiagnals = (grid: string[][]) : string[] => {
	// get ALL the diagnals of the grid, not just the main diagnals
	const diagnals = [];
	const rowCount = grid.length;
	const columnCount = grid[0].length;
	const diagnalCount = rowCount + columnCount - 1;
	for (let i = 0; i < diagnalCount; i++) {
		const diagnal = [];
		for (let j = 0; j <= i; j++) {
			const row = j;
			const column = i - j;
			if (row < rowCount && column < columnCount) {
				diagnal.push(grid[row][column]);
			}
		}
		diagnals.push(diagnal.join(""));
	}

	// get the OPPOSITE diagnals of the grid too
	for (let i = 0; i < diagnalCount; i++) {
		const diagnal = [];
		for (let j = 0; j <= i; j++) {
			const row = rowCount - 1 - j;
			const column = i - j;
			if (row >= 0 && column < columnCount) {
				diagnal.push(grid[row][column]);
			}
		}
		diagnals.push(diagnal.join(""));
	}

	return diagnals;
}

export const countXmas = ( array: string[]) : number => {
	let sum = 0;

	array.forEach( (row) => {
		sum += row.match(/(XMAS)/g)?.length ?? 0;
		sum += row.match(/SAMX/g)?.length ?? 0;
	});

	return sum;
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
	const answers = findAnswers(puzzle_input.entries.join("\n"), entries);
	return answers.first;
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
	const answers = findAnswers(puzzle_input.entries.join("\n"), entries);
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

const part2 = part2_correct ? await solvePart2(): null;
log("    part 2: ", part2, check);