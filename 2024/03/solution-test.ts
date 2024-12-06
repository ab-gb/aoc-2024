import { assertEquals } from "@std/assert";
import { removeDontParts} from "./solution.ts";

Deno.test(function numbersTest() {
  assertEquals(removeDontParts("do()adon't()bbbbdobbdo()z"), ["a","z"]);
});

Deno.test(function keepFirstPartWhenInputDoesNotStartWithDo() {
  assertEquals(removeDontParts("adon't()bbbbdobbdo()z"), ["a","z"]);
});