import { assertEquals } from "@std/assert";
import { numbersFromString} from "./solution.ts";

Deno.test(function numbersTest() {
  assertEquals(numbersFromString("a1b2c3"), "123");
});