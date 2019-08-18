import { test, runTests } from "https://deno.land/std/testing/mod.ts";
import { assert, assertEquals, assertThrows} from "https://deno.land/std/testing/asserts.ts"; 
import { Request, simplePathMatcher } from "./mod.ts";

test({
  name: "Testing function parse_url",
  fn(): void {
    {
      const req = new Request({
        url: "/files-tmb/1234/abc.png?key=val"
      });
      assertEquals(req.path, "/files-tmb/1234/abc.png");
      assertEquals(req.query.key, "val");
    }
  }
});

test({
  name: "Testing function simplePathMatcher",
  fn(): void {
    assert(!!simplePathMatcher("/")("/"));
    assert(!!simplePathMatcher("/foo")("/foo"));
    assert(!!simplePathMatcher("/foo/")("/foo/"));
    assert(!!simplePathMatcher("/foo/1")("/foo/1"));
    assertEquals(simplePathMatcher("/foo")("/"), null);
    assertEquals(simplePathMatcher("/foo")("/fooo"), null);
    assertEquals(simplePathMatcher("/foo")("/foo/"), null);
    assertEquals(simplePathMatcher("/{a}")("/foo").a, "foo");
    assertEquals(simplePathMatcher("/{a}/foo/{xxx}")("/34/foo/1").a, "34");
    assertEquals(simplePathMatcher("/{a}/foo/{xxx}")("/34/foo/1").xxx, "1");
    for (let v of ["//", "/{}", "/{x}/{x}"]) {
      assertThrows(() => {
        simplePathMatcher(v);
      });
    }
  }
});

runTests();