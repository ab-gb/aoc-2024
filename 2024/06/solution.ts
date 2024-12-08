const tests = {
	input: 
`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
	first: 41,
	second: 6
};

import { getGrid, log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";
import { assert } from "@std/assert";

interface StepDirection {
	dx: number;
	dy: number;
	name: string;
}

const directions = {
	UP: { dx: 0, dy: -1, name: "UP" },
	DOWN: { dx: 0, dy: 1, name: "DOWN" },
	LEFT: { dx: -1, dy: 0, name: "LEFT" },
	RIGHT: { dx: 1, dy: 0, name: "RIGHT" }
};

const defineSymbols = () => {
	const symbols = {
		CURRENT_POSITION: "^",
		OBSTACLE: "#",
	};
	return symbols;
};

const symbols = defineSymbols();

let steps = new Set<string>();

const findAnswers = (input: string) => {
	let grid = getGrid(input.trim());

	steps = new Set<string>(); // need to reset the steps for each evaluation
	const startingPosition = getPosition(grid);

	let direction = directions.UP;
	let position = startingPosition;

	while (true) {
		try {
			grid = walk(grid, position.x, position.y, direction.dx, direction.dy);
			position = getPosition(grid)
			direction = turnRight (direction);
		}
		catch (e) {
			break;
		}
	}

	log ("part1:");
	const part1 = perf( () => grid.reduce((acc, row) => acc + row.filter(cell => cell === "X").length, 0));
	log ("part2:");
	const part2 = perf ( () => solve2(grid, startingPosition));

	const answers = { first: part1, second: part2 };
	return answers;
};

const solve2 = (grid: string[][], startingPosition: { x: number, y: number }) => {
	// Now we have the grid with the path walked
	// for each of the walked locations (except for our starting path, place an "X" and walk the path again)
	const obstaclePositionsToTest = grid
		.reduce((acc, row, y) => {
			row.forEach((cell, x) => {
				if (cell === "X") {
					acc.push( `${x},${y}`);
				}
			});
			return acc;
		}, [])
		.filter(xy => xy !== `${startingPosition.x},${startingPosition.y}`);

	assert ( obstaclePositionsToTest.filter(xy => xy === `${startingPosition.x},${startingPosition.y}`).length === 0, "Starting position is in the list of obstacles");

	let loopObstacles = 0;
	grid[startingPosition.y][startingPosition.x] = symbols.CURRENT_POSITION; 

	obstaclePositionsToTest.forEach(xy => {
		const [x, y] = xy.split(",").map(Number);
		const gridCopy = grid.map(row => [...row]);
		gridCopy[y][x] = "#";

		loopObstacles += evaluateGrid(gridCopy) ? 1 : 0;
	});

	return loopObstacles;
}

const evaluateGrid = (grid: string[][]) => {
	let direction = directions.UP;
	let position = getPosition(grid);
	let isLoop = false;
	steps = new Set<string>(); // need to reset the steps for each evaluation
	while (true) {
		try {
			grid = walk(grid, position.x, position.y, direction.dx, direction.dy);
			position = getPosition(grid)
			direction = turnRight (direction);
		}
		catch (e) {
			if ((e as Error).message === "Loop detected") {
				isLoop = true;
			}
			break;
		}
	}

	return isLoop;
}

const walk = (grid: string[][], x: number, y: number, dx: number, dy: number) => {
	while (grid[y][x] !== "#" ) {
		if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) {
			throw new Error("Out of bounds");
		}
		if (steps.has(`${x},${y},${dx},${dy}`)) {
			throw new Error("Loop detected");
		}
		steps.add(`${x},${y},${dx},${dy}`);
		grid[y][x] = "X";
		x += dx;
		y += dy;
	}

	grid[y-dy][(x-dx)] = symbols.CURRENT_POSITION; // set the current position

	return grid;
}

const getPosition = (grid: string[][]) => {
	return grid.reduce((acc, row, y) => {
		const x = row.indexOf(symbols.CURRENT_POSITION);
		if (x >= 0) {
			acc.x = x;
			acc.y = y;
		}
		return acc;
	}, { x: 0, y: 0 });
}

const turnRight = (direction: StepDirection) => {
	const { dx, dy } = direction;
	if (dx === 0 && dy === -1) {
		return directions.RIGHT;
	}
	if (dx === 0 && dy === 1) {
		return directions.LEFT;
	}
	if (dx === -1 && dy === 0) {
		return directions.UP;
	}
	if (dx === 1 && dy === 0) {
		return directions.DOWN;
	}
	return direction;
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

