const tests = {
	input: 
`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
	first: 36,
	second: 81
};

import { getGrid, log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";

const STARTING_ELEVATION = "0";

interface Coordinate {
	y: string;
	x: string;
}

interface Step {
	coord: Coordinate;
	elevation: number;
}

const possibleDesinations = new Set<string>();


const findAnswers = (input: string) => {
	log (input);

	const grid = getGrid(input);

	let part1 = 0;
	let part2 = 0;

	const startingCoordinates = getStartingPositions(grid); 	// find all x,y coordinates  of "0"
	log ( "startingCoordinates:" , startingCoordinates.length);
	startingCoordinates.forEach((coord: Coordinate) => {
		possibleDesinations.clear();
		const validPathCount = getTrailScore(grid, coord);
		log (validPathCount);
		log ( "possibleDesinations.size:" , possibleDesinations.size);
		log ( "possibleDesinations:", possibleDesinations);

		part1 += possibleDesinations.size
		part2 += validPathCount;
	});

	log ("part1:", part1);
	log ("part2:", part2);

	const answers = { first: part1, second: part2 };
	return answers;
};


const getStartingPositions = (grid: string[][]) : Coordinate[] => {
	const rows = grid.length;
	const cols = grid[0].length;

	const coords: Coordinate[] = [];
	for(let y = 0; y < rows; y++){
		for(let x = 0; x < cols; x++){
			if(grid[y][x] === STARTING_ELEVATION){
				coords.push({y: y.toString(), x: x.toString()});
			}
		}
	}
	return coords;
}

const getTrailScore = (grid: string[][], current: Coordinate) => {
	let validPaths = 0;

	const currentStep: Step = {coord: current, elevation: parseInt(grid[parseInt(current.y)][parseInt(current.x)])};

	// Possible Paths
	const upCoordinate = getStepCoordinate(current, "up");
	const downCoordinate = getStepCoordinate(current, "down");
	const leftCoordinate = getStepCoordinate(current, "left");
	const rightCoordinate = getStepCoordinate(current, "right");

	const stepUp : Step = {coord: upCoordinate, elevation: getCellValueAsNumber(grid, upCoordinate)};
	const stepDown : Step = {coord: downCoordinate, elevation: getCellValueAsNumber(grid, downCoordinate)};
	const stepLeft : Step = {coord: leftCoordinate, elevation: getCellValueAsNumber(grid, leftCoordinate)};
	const stepRight : Step = {coord: rightCoordinate, elevation: getCellValueAsNumber(grid, rightCoordinate)};

	// base case
	if (currentStep.elevation == 9) {
		// This is a valid path, we should return
		possibleDesinations.add(currentStep.coord.y + "," + currentStep.coord.x);
		return 1;
	}

	// return the sum of all possibly valid trails
	// Try a step in each direction.
	if (stepUp.elevation - currentStep.elevation == 1) {
		validPaths += getTrailScore(grid, stepUp.coord);
	}

	if (stepDown.elevation - currentStep.elevation == 1) {
		validPaths += getTrailScore(grid, stepDown.coord);
	}

	if (stepLeft.elevation - currentStep.elevation == 1) {
		validPaths += getTrailScore(grid, stepLeft.coord);
	}

	if (stepRight.elevation - currentStep.elevation == 1) {
		validPaths += getTrailScore(grid, stepRight.coord);
	}

	return validPaths;
}

const FALLING_COORDINATE = {y: "-1", x: "-1"};

const getStepCoordinate = ( current: Coordinate, direction: string) : Coordinate => {
	const currentX = parseInt(current.x);
	const currentY = parseInt(current.y);

	switch (direction) {
		case "up":
			return {y: (currentY - 1).toString(), x: current.x};
		case "down":
			return {y: (currentY + 1).toString(), x: current.x};
		case "left":
			return {y: current.y, x: (currentX - 1).toString()};
		case "right":
			return {y: current.y, x: (currentX + 1).toString()};
	}
	return FALLING_COORDINATE;
}

const getCellValueAsNumber = (grid: string[][], coord: Coordinate) : number=> {
	try {
		return parseInt ( grid[parseInt(coord.y)][parseInt(coord.x)]);
	} catch (e) {
		return -1;
	}
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

const {first, second} = part1_correct ? await solveBoth() : {first: null, second: null};

log("    part 1: ", first, checkPart1);
log("    part 2: ", second, checkPart2);

