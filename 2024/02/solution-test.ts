import { assertEquals } from "@std/assert";
import { countSafe, isSafe} from "./solution.ts";

// Deno.test(function isSafeWithDups() {
//   assertEquals(isSafe([4,4], 0), false);
// });

// Deno.test(function isSafeWithBadMidLevel() {
//   assertEquals(isSafe([1,4,4,5], 1), true);
// });

// Deno.test(function isSafeWithBadStartLevel() {
//   assertEquals(countSafe(["1 5 6 7"], 1).count, 1);
// });

// Deno.test(function isSafeWithBadEndLevel() {
//   assertEquals(countSafe(["5 6 7 20"], 1).count, 1);
// });

// Deno.test(function isSafeWithBadEndLevel() {
//   assertEquals(countSafe(["5 6 7 19 20"], 1).count, 0);
// });


// Deno.test(function isSafeWithBadEndLevelDesc() {
//   assertEquals(countSafe(["54 51 48 45 45"], 1).count, 1);
// });

// Deno.test(function isSafeWithBadStartLevelDesc() {
//   assertEquals(countSafe(["54 54 51 48 45"], 1).count, 1);
// });

// Deno.test(function isSafeWithBadMidLevel() {
//   assertEquals(countSafe(["54 54 51 48 45"], 1).count, 1);
// });

Deno.test(function isSafeWithBadStartLevelDesc() {
  assertEquals(countSafe(["10 13 12 13 14"], 1).count, 1);
});