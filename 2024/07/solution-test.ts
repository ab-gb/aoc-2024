import { assertEquals } from "@std/assert";
import { getOperatorCombinations} from "./solution.ts";

Deno.test(function singleCombo() {
  assertEquals(getOperatorCombinations(['*,', '+'], 1), ["*", "+"]);
});

Deno.test(function twoCombo() {
  assertEquals(getOperatorCombinations(['*,', '+'], 2), ["**", "+*", "*+", "++"]);
});