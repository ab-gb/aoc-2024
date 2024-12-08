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
292: 11 6 16 20`
,
	first: 3749,
	second: 11387
};

import { log, perf } from "../../tools.ts";
import { puzzle } from "../../puzzle.ts";

let termsOperatorMap = new Map<number, string[]>();

const findAnswers = (input: string, operatorConfig: string[]) => {
	const rows = input.trim().split('\n');

	termsOperatorMap = new Map<number, string[]>();

	// first remove as many rows as we cal
	const equations: Equation[] = rows.map(row => {
		const [answer, terms] = row.split(': ');
		return { answer: parseInt(answer), terms: terms.split(' ').map(n => parseInt(n)) };
	});

	let sum = 0;

	equations.forEach(eq => {
		const operators = getOperatorCombinations(operatorConfig, eq.terms.length-1);
		if ( applyOperators(eq, operators)) {
			sum += eq.answer;
		}
	});

	const answers = { first: sum, second: sum };
	return answers;
};

export const getOperatorCombinations = (operators: string[], termCount: number): string[] => {
	if ( termsOperatorMap.has(termCount) && termsOperatorMap.get(termCount) != null) {
		const cached = termsOperatorMap.get(termCount);
		return cached!;
	 }

	let operatorCombinations = operators;
	for (let i = 1; i < termCount; i++) {
		const newOperatorCombinations = new Array<string>();
		for (let j = 0; j < operators.length; j++) {
			const operator = operators[j];
			for (let k = 0; k < operatorCombinations.length; k++) {
				const newOperator = operatorCombinations[k];
				newOperatorCombinations.push(newOperator + operator);
			}
		}
		operatorCombinations = newOperatorCombinations;
	}

	termsOperatorMap.set(termCount, operatorCombinations);
	return operatorCombinations;
}

const applyOperators = (eq: Equation, operatorSequences: string[]): boolean => {

	for (let i = 0; i < operatorSequences.length; i++) {
		const operators = operatorSequences[i].split('');

		let result = eq.terms[0];
		for (let j = 1; j < eq.terms.length; j++) {
			const term = eq.terms[j];
			const op = operators[j-1];
			// log ( `(result)${result} ${op}= (term)${term}`);
			if (op === '+') {
				result += term;
			} else if (op === '*') {
				result *= term;
			} else if (op === '|') {
				result = parseInt(result.toString() + term.toString());
			}
		}
		if (eq.answer === result) {
			return true;
		}
	}
	return false;
}


const solvePart1 = async (): Promise<{first:number, second:number}> => {
	if(tests.first === 0){ return {first: 0, second: 0 }};
	const puzzle_input = await puzzle.parseInput();
	const answers = perf(() => findAnswers(puzzle_input.input, [ "*", "+" ]));
	return answers;
};

const solvePart2 = async (): Promise<{first:number, second:number}> => {
	if(tests.first === 0){ return {first: 0, second: 0 }};
	const puzzle_input = await puzzle.parseInput();
	const answers = perf(() => findAnswers(puzzle_input.input, [ "*", "+", '|']));
	return answers;
};

const testPart1 = async (input: string): Promise<boolean> => {
	if(tests.first === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const answers = findAnswers(puzzle_input.input, [ "*", "+" ]);
	return answers.first == tests.first;
};

const testPart2 = async (input: string): Promise<boolean> => {
	if(tests.second === 0){ return false; }
	const puzzle_input = await puzzle.parseInput(input);
	const answers = findAnswers(puzzle_input.input, [ "*", "+", '|']);
	return answers.second === tests.second;
};

const part1_correct = await testPart1(tests.input);
const checkPart1 = part1_correct ? '✅' : '❌';

const part2_correct = await testPart2(tests.input);
const checkPart2 = part2_correct ? '✅' : '❌';

const {first} = part1_correct ? await solvePart1() : {first: null};

const {second} = part2_correct ? await solvePart2() : {second: null};

log("    part 1: ", first, checkPart1);
log("    part 2: ", second, checkPart2);








//////////////////////////////////////////////////////////////
// Recursion Attempt
//////////////////////////////////////////////////////////////

interface Equation {
	answer: number;
	terms: number[];
}

interface Node {
	acculumator: number;
	remainingTerms: number[];
}

const getCombinations = (eq: Equation, stack?: Node[], accumulator?: number ): Node[] => {
	if (stack == null ) {
		stack =  new Array<Node>();
	}

	const term = eq.terms.shift();

	const sum = (accumulator ?? 0 )+ (term ?? 0);
	const product = (accumulator ?? 1) * (term ?? 1);

	log ( "accumulator:" + accumulator );
	log ( "term:" + term );
	log ( "sum:" + sum );
	log ( "product:" + product );
	if ( eq.terms.length > 0 ) {
		log ("next term " + eq.terms[0]);
		log ("sum will be: " + (sum + eq.terms[0]));
		log ("sum will be: " + (product + eq.terms[0]));
		log ("product will be: " + (sum * eq.terms[0]));
		log ("product will be: " + (product * eq.terms[0]));
	}

	stack?.push({ acculumator: sum, remainingTerms: eq.terms });
	stack?.push({ acculumator: product, remainingTerms: eq.terms });

	if ( eq.terms.length === 0 ) {
		return stack;
	}

	log ("first sum");
	const sumStack = getCombinations(eq, stack, sum);

	log ("...now product");
	const productStack = getCombinations(eq, stack, product);

	return [ ...stack, ...sumStack, ...productStack];
}

const getCombinationEquations = (eq: Equation, stack?: Node[], accumulator?: number ): Node[] => {
	if (stack == null ) {
		stack =  new Array<Node>();
	}

	if ( eq.terms.length === 0 ) {
		return stack;
	}

	const term = eq.terms.shift();

	const sum = (accumulator ?? 0 ) + (term ?? 0);
	const product = (accumulator ?? 1) * (term ?? 1);

	log ( "term:" + term );
	log ( "accumulator:" + accumulator );
	log ( "sum:" + sum );
	log ( "product:" + product );

	// stack?.push({ acculumator: sum, remainingTerms: eq.terms });
	// stack?.push({ acculumator: product, remainingTerms: eq.terms });

	return [ ...stack, ...getCombinations(eq, stack, sum), ...getCombinations(eq, stack, product)];
}