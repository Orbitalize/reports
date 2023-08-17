import { test, expect } from "vitest";
import { joinRoutes } from "./reportNavigation";

test("Routes are correctly joined", () => {
  expect(joinRoutes("/hello/", "/world/")).toBe("/hello/world/");
  expect(joinRoutes("hello", "world")).toBe("hello/world");
  expect(joinRoutes("", "world")).toBe("world");
  expect(joinRoutes("hello", "")).toBe("hello");
  expect(joinRoutes("/", "world")).toBe("/world");
});

test("Routes are correctly joined with numbers", () => {
  expect(joinRoutes("/", "0")).toBe("/0");
  expect(joinRoutes("/1", "0")).toBe("/1/0");
});
