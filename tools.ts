import { format } from "https://deno.land/std@0.117.0/datetime/mod.ts";
const meta = {
	timestamp: ''
};


// create a method that receives a function that will execute the function and log start and end time.
// deno-lint-ignore ban-types
export const perf = (func: Function) => {
	const start = performance.now();
	const result = func();
	const end = performance.now();
	
	// if greater than 1000ms, log in second with 3 decimal places
	if (end-start > 1000) {
		log ("time:" + ((end-start)/1000).toFixed(3) + "s");
	} else {
		log ("time:" + ((end-start).toFixed(5)) + "ms");
	}
	return result;
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

export const transposeArray= <T>(matrix: T[][]): T[][] => {
	const numRows = matrix.length;
	const numCols = matrix[0].length;

	const result: T[][] = [];

	for (let col = 0; col < numCols; col++) {
	  const newRow: T[] = [];
	  for (let row = 0; row < numRows; row++) {
		newRow.push(matrix[row][col]);
	  }
	  result.push(newRow);
	}

	return result;

}

export const transposeLines = (lines: string[]): string[] => {
	if (lines.length === 0) {
		return [];
	}

	// Find the maximum line length
	const maxLength = Math.max(...lines.map(line => line.length));

	// Create a new array for the transposed lines
	const transposedLines: string[] = [];
	// Iterate over each column index
	for (let i = 0; i < maxLength; i++) {
		let newLine = "";
		// Iterate over each line
		for (const line of lines) {
		// Add the character at the current column index if it exists
		newLine += line[i] || " ";
		}
		transposedLines.push(newLine);
	}
	return transposedLines;
}

export const log = (...anything: any): string => {
	if(meta.timestamp === ''){
		meta.timestamp = format(new Date(), "HH:mm:ss");
		console.log(meta.timestamp, '====================================');
	}
	if (anything.length > 2) {
		console.log(anything[0], anything[1], anything[2]);
	} else if (anything.length > 1) {
		console.log(anything[0], anything[1]);
	}else if(typeof anything[0] === "object" && anything[0].length > 100){
		console.log(anything[0].slice(0, 10));
	} else {
		console.log(anything[0]);
	}
	return meta.timestamp;
};
export const logList = (list: any[]): string => {
	const timestamp = format(new Date(), "HH:mm:ss");
	console.log(timestamp);
	list.forEach((item, index) => console.log(`[${index}]`, item));
	return timestamp;
};

export async function getPuzzleInput(): Promise<string | boolean> {
	const input_filepath = "./input.txt";
	try {
		const saved_text = await Deno.readTextFile(input_filepath);
		return saved_text;
	} catch (error) {
		console.log(error);
		return false;
	}
}
export function getEntriesFromInput(input: string): string[] {
	return input.split("\n");
}

export const transpose = (matrix: string[][] | string[][][]): string[][] => {
	const cols: string[][] = [[], []];

	matrix.flat().forEach((row, index) => {
		cols[0][index] = row[0];
		cols[1][index] = row[1];
	});

	log (matrix);
	log (cols);

	return cols;
}