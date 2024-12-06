import { assertEquals } from "@std/assert";
import { getThreeByThreeGrids, countXedMas, solutionPart2, isXedMas, countXmas, getDiagnals, solutionPart1} from "./solution.ts";

Deno.test(function numbersTest() {
  assertEquals(getDiagnals([
    ["1", "2"],
    ["3", "4",]
  ]), ["1", "23", "4", "3", "41", "2"]);
});

Deno.test(function overlapping() {
  assertEquals(countXmas(["XMASAMX"]), 2);
});

Deno.test(function overlapping() {
  assertEquals(countXmas(["XMASAMX"]), 2);
});

Deno.test(function findXmas() {
  assertEquals(countXmas(["XMASXMASXMAS"]), 3);
});

Deno.test(function findSAMX() {
  assertEquals(countXmas(["SAMXSAMX"]), 2);
});

Deno.test(function downRightXmas() {
  assertEquals(solutionPart1(
`X...
.M..
..A.
...S`), 1);
  });

Deno.test(function leftToRight() {
  assertEquals(solutionPart1(`XMASAMX`), 2);});

Deno.test(function upRightXmas() {
  assertEquals(solutionPart1(
`
...S
..A.
.M.
X...`), 1);});

Deno.test(function upLeftXmas() {
  assertEquals(solutionPart1(
`
S...
.A..
..M.
...X`), 1);});

Deno.test(function downLeftXmas() {
  assertEquals(solutionPart1(
`
...X
..M.
.A..
S...`), 1);});


Deno.test(function downRightXmas() {
  assertEquals(solutionPart1(
`
X...
.M..
..A
...S`), 1);});

Deno.test(function downRightSamx() {
  assertEquals(solutionPart1(
`
S...
.A..
..M
...X`), 1);});


Deno.test(function downXmas() {
  assertEquals(solutionPart1(
`
.X..
.M..
.A..
.S..`), 1);});

Deno.test(function downSamx() {
  assertEquals(solutionPart1(
`
.S..
.A..
.M..
.X..`), 1);});

Deno.test(function XedMas() {
  assertEquals(isXedMas(
    [
      ["M", ".", "S"],
      [".", "A", "."],
      ["M", ".", "S"],
    ]
  ), true);
});

Deno.test(function countXedMases() {
  assertEquals(countXedMas(
    [
      [".", "M", ".", "S"],
      [".", ".", "A", "."],
      [".", "M", ".", "S"],
      [".", "M", ".", "S"],
    ]
  ), 1);
});


Deno.test(function subGridCount() {
  assertEquals(getThreeByThreeGrids(
    [
      [".", "M", ".", "S"],
      [".", ".", "A", "."],
      [".", "M", ".", "S"],
      [".", "M", ".", "S"],
    ]
  ).length, 4);
});



