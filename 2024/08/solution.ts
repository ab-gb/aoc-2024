const tests = {
	input:
// `
// T.........
// ...T......
// .T........
// ..........
// ..........
// ..........
// ..........
// ..........
// ..........
// ..........`
`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`
,	first: 14,
	second: 34
};

import { getGrid, log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";
import { assert } from "@std/assert";
import { nodesAndTextNodes } from "https://deno.land/x/deno_dom@v0.1.48/deno-dom-wasm.ts";

const defineSymbols = () => {
	const symbols = {
	};
	return symbols;
};

const symbols = defineSymbols();

interface Coordinate {
	x: number;
	y: number;
}

const findAnswers = (input: string) => {
	const charsToIgnore = ['.', '\n'];

	const freqencies = Array.from(new Set(input.trim().split('').filter(c => !charsToIgnore.includes (c))));

	const grid = getGrid(input.trim());

	const antiNodes: Coordinate[] = [];

	// Part 1
	freqencies.forEach( freq => {
		getAntiNodesForFreq(freq, grid)
			.forEach( node => {antiNodes.push(node);
		});
	});

	const uniqueAntiNodes = Array.from(new Set(antiNodes.map( n => JSON.stringify(n)))).map( n => JSON.parse(n));
	const part1 = uniqueAntiNodes.length;

	antiNodes.length = 0;

	// Part 2
	freqencies.forEach( freq => {
		getAntiNodesForFreqAllDistances(freq, grid)
			.forEach( node => antiNodes.push(node)
		);

		const nodes = getNodesForFreq(freq, grid);
		if (nodes.length > 1) {
			nodes.forEach( node => antiNodes.push(node));
		}
	});


	const part2AntiNodes = Array.from(new Set(antiNodes.map( n => JSON.stringify(n)))).map( n => JSON.parse(n));
	const part2 = part2AntiNodes.length;
	// 867 is too low for part 2.
	// 1327 is too high

	// log ("part2AntiNodes", part2AntiNodes); // 30 instead of 34

	log ("part2", part2); // 30 instead of 34

	const answers = { first: part1, second: part2 };
	return answers;
};

const getAntiNodesForFreq = ( freq: string, grid: string[][]): Coordinate[] => {
	const nodes = getNodesForFreq(freq, grid);
	const antiNodes = nodes.map( node => getAntiNodes(node, nodes.filter( n => n.x !== node.x || n.y !== node.y), grid)).flat();
	return antiNodes;
}

const getAntiNodesForFreqAllDistances = ( freq: string, grid: string[][]): Coordinate[] => {
	const nodes = getNodesForFreq(freq, grid);
	const antiNodes = nodes.map( node => getAntiNodesAllDistances(node, nodes.filter( n => n.x !== node.x || n.y !== node.y), grid)).flat();
	return antiNodes;
}

const getNodesForFreq = ( freq: string, grid: string[][]): Coordinate[] => {
	const nodes: Coordinate[] = [];
	grid.forEach( (row, y) => {
		row.forEach( (cell, x) => {
			if(cell === freq){
				nodes.push({x, y});
			}
		});
	});
	return nodes;
}

const getAntiNodes = (sourceNode: Coordinate, nodes: Coordinate[], grid: string[][]): Coordinate[] => {

	const antiNodes: Coordinate[] = [];

	nodes.forEach( adjacentNode => {
		const { next, previous } = calculateNextAndPreviousPoints(sourceNode, adjacentNode);
		antiNodes.push(next);
		antiNodes.push(previous);
	});

	return antiNodes
		// .filter( n => grid[n.y][n.x] === '.') // Ensure it's available
		.filter( n => n.x >= 0 && n.y >= 0) // Ensure it's not out of bounds
		.filter( n => n.x < grid[0].length && n.y < grid.length); // Ensure it's not out of bounds
}

const calculateNextAndPreviousPoints = (p1: Coordinate, p2: Coordinate): {next: Coordinate, previous: Coordinate} => {
    // Calculate the distance between the two points
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    const direction = { x: dx / distance, y: dy / distance };

    // Calculate the next point
    const next = {
        x: p2.x + direction.x * distance,
        y: p2.y + direction.y * distance
    };

    // Calculate the previous point
    const previous = {
        x: p1.x - direction.x * distance,
        y: p1.y - direction.y * distance
    };

	return {next, previous};
}

const getDistance = (a: Coordinate, b: Coordinate): number => {
	const rise = b.y - a.y;
	const run = b.x - a.x;
	return Math.sqrt(Math.pow(rise, 2) + Math.pow(run, 2));
}

const getSlope = (a: Coordinate, b: Coordinate): number => {
	return (b.y - a.y) / (b.x - a.x);
}

const getYIntercept = (a: Coordinate, slope: number): number => {
	return a.y - slope * a.x;
}

const getAntiNodesAllDistances = (sourceNode: Coordinate, nodes: Coordinate[], grid: string[][]): Coordinate[] => {

	const antiNodes: Coordinate[] = [];

	nodes.forEach( adjacentNode => {
		findLatticePointsWithinGrid(sourceNode, adjacentNode, grid)
			.forEach( node => {
				antiNodes.push(node);
			});
	});

	const antiNodesInGrid = antiNodes
		// .filter( n => grid[n.y][n.x] === '.') // Ensure it's available
		.filter( n => n.x >= 0 && n.y >= 0) // Ensure it's not out of bounds
		.filter( n => n.x < grid[0].length && n.y < grid.length); // Ensure it's not out of bounds

	return antiNodesInGrid;
}

const isAlmostInteger = (n: number): boolean => {
	return Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.0000001;
}

const findLatticePointsWithinGrid = (p1: Coordinate, p2: Coordinate, grid: string[][]): Coordinate[] => {
	const points: Coordinate[] = [];

	const MAX_X = grid[0].length;

	const slope = getSlope(p1, p2);
	const b = getYIntercept(p1, slope);

	for ( let y = 0; y < grid.length; y++) {
		const x = (y - b) / slope;
		const xAsInt = isAlmostInteger(x) ? Math.round(x) : x;

		// if x is an integer, then it's a lattice point
		if (xAsInt >= 0 && xAsInt <= MAX_X && isAlmostInteger(xAsInt)) {
			points.push({x: xAsInt, y:y});
		}
	}

	// const dx = p2.x - p1.x;
	// const dy = p2.y - p1.y;

	// // Use the greatest common divisor (GCD) to step along the line
	// const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
	// const step = gcd(dx, dy);

	// // Calculate step increments
	// const stepX = dx / step;
	// const stepY = dy / step;

	// // Generate points
	// for (let i = 0; i <= step; i++) {
	// 	points.push({ x: p1.x + i * stepX, y: p1.y + i * stepY });
	// }

	return points;
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

	log ( `(calc)${answers.first}, (target)${tests.first}`);
	return answers.first == tests.first;
};

const testPart2 = async (input: string): Promise<boolean> => {
	if(tests.second === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const answers = findAnswers(puzzle_input.input);
	log ( `(calc)${answers.second}, (target)${tests.second}`);

	return answers.second === tests.second;
};

const part1_correct = await testPart1(tests.input);
const checkPart1 = part1_correct ? '✅' : '❌';

const part2_correct = await testPart2(tests.input);
const checkPart2 = part2_correct ? '✅' : '❌';

const {first, second} = part1_correct ? await solveBoth() : {first: null, second: null};

log("    part 1: ", first, checkPart1);
log("    part 2: ", second, checkPart2);

