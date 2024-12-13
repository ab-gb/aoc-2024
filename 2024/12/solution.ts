const tests = {
	input: 
`
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
	first: 1930,
	second: 1206
};

import { Coordinate, findContiguousRegions, Region } from "../../depth-first-grid.ts";
import { getGrid, log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";

const findAnswers = (input: string) => {

	const grid = getGrid(input.trim());

	let part1 = 0;
	let part2 = 0;
	const contiguousRegions = findContiguousRegions(grid);
	contiguousRegions.forEach(region => {
		// log(`Next Region ${region.name}: `);
		const area = getArea(region);
		const perimeter = getPerimeter(region, grid);
		const sides = getSides (region, grid);
		// log (`${region.name} => Area: ${area}, Perimeter: ${perimeter}`);
		part1 += area*perimeter;
		part2 += area*sides;
	});

	// part1 1421958
	// part2 885394

	const answers = { first: part1, second: part2 };
	return answers;
};


const getArea = (region: Region ): number => {
	return region.coordinates.length;
}

const getPerimeter = (region: Region, grid: string [][]): number => {
	const edgeSet = new Set<Coordinate>();

	let borderCount = 0;

	region.coordinates.forEach( (xy: Coordinate) => {
		const [r, c] = xy;
		const value = grid[r][c];
		const neighboringCells = getNeighboringCells(r, c, grid);
		borderCount += 4-neighboringCells.length;
		neighboringCells.forEach( (nc: Coordinate) => {
			const [r2, c2] = nc;
			if (grid[r2][c2] !== value) {
				edgeSet.add(nc);
			}
		});
	});

	return edgeSet.size + borderCount;
}

const getSides = (region: Region, grid: string [][]): number => {
	let sides = 0;

	region.coordinates.forEach( (xy: Coordinate) => {
		const corners = getCornerCount(xy[0], xy[1], grid);
		sides += corners;
	});

	return sides;
}

const getCornerCount = (r: number, c: number, grid: string [][]): number => {

	let corners = 0;

	// If the cell to the left and above is NOT the same value, we have a corner
	// If the cell to the left is bottom is NOT the same value, we have a corner
	// If the cell to the right and above is NOT the same value, we have a corner
	// If the cell to the right and bottom is NOT the same value, we have a corner

	const cellValue = grid[r][c];

	const top 		= getCell(r-1,c, grid);
	const bottom 	= getCell(r+1,c, grid);
	const left 		= getCell(r,c-1, grid);
	const right 	= getCell(r,c+1, grid);

	///////////////////////////////////////////////
	// Outer Corners
	///////////////////////////////////////////////

	// Outer Top Left Corner
	if (cellValue !== top && cellValue !== left) {
		corners++;
	}

	// Outer Top Right Corner
	if (cellValue !== top && cellValue !== right) {
		corners++;
	}

	// Outer Bottom Left Corner
	if (cellValue !== bottom && cellValue !== left) {
		corners++;
	}

	// Outer Bottom Right Corner
	if (cellValue !== bottom && cellValue !== right) {
		corners++;
	}

	// if the cell to the right is NOT the same, but the cell above and diagnally above to the right ARE the same, we have a corner
	// if the cell to the right is NOT the same, but the cell below and diagnally below to the right ARE the same, we have a corner
	// if the cell to the left is NOT the same, but the cell above and diagnally above to the left ARE the same, we have a corner
	// if the cell to the left is NOT the same, but the cell below and diagnally below to the left ARE the same, we have a corner
	const diagnalTopRight 		= getCell(r-1,c+1, grid);
	const diagnalTopLeft 		= getCell(r-1,c-1, grid);
	const diagnalBottomRight 	= getCell(r+1,c+1, grid);
	const diagnalBottomLeft 	= getCell(r+1,c-1, grid);
	
	///////////////////////////////////////////////
	// Inner Corners
	///////////////////////////////////////////////
	// Inner Top Right Corner
	if (cellValue !== right && cellValue === top && cellValue === diagnalTopRight) {
		corners++;
	}

	// Inner Bottom Right Corner
	if (cellValue !== right && cellValue === bottom && cellValue === diagnalBottomRight) {
		corners++;
	}

	// Inner Top Left Corner
	if (cellValue !== left && cellValue === top && cellValue === diagnalTopLeft) {
		corners++;
	}

	// Inner Bottom Left Corner
	if (cellValue !== left && cellValue === bottom && cellValue === diagnalBottomLeft) {
		corners++;
	}

	return corners;
}

const getCell = (r: number, c: number, grid: string [][]): string | null => {
	try {
		return grid[r][c];
	} catch (e) {	
		return null;
	}
}

const getNeighboringCells = (r: number, c: number, grid: string [][]): Coordinate[] => {

	const neighboringCells : Coordinate[] = [];

	// get all thd adjacent cell values
	// top
	if (r > 0) {
		neighboringCells.push([r-1,c]);
	}
	// bottom
	if (r < grid.length - 1) {
		neighboringCells.push([r+1,c]);
	}
	// left
	if (c > 0) {
		neighboringCells.push([r,c-1]);
	}
	// right
	if (c < grid[0].length - 1) {
		neighboringCells.push([r,c+1]);
	}

	return neighboringCells;
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
	const answers = perf(() => findAnswers(puzzle_input.input));
	return answers;
};

const testPart1 = async (input: string): Promise<boolean> => {
	if(tests.first === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const answers = findAnswers(puzzle_input.input);

	// log ( answers.first, tests.first);
	return answers.first == tests.first;
};

const testPart2 = async (input: string): Promise<boolean> => {
	if(tests.second === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const answers = findAnswers(puzzle_input.input);
	// log ( answers.second, tests.second);

	return answers.second === tests.second;
};

const part1_correct = await testPart1(tests.input);
const checkPart1 = part1_correct ? '✅' : '❌';

const part2_correct = await testPart2(tests.input);
const checkPart2 = part2_correct ? '✅' : '❌';

const {first, second} = part1_correct ? await solveBoth() : {first: null, second: null};

log("    part 1: ", first, checkPart1);
log("    part 2: ", second, checkPart2);

// perf ( () => solveBoth() );
