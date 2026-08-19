import assert from "node:assert/strict";
import vm from "node:vm";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:8787/";
const response = await fetch(targetUrl);

assert.equal(
  response.ok,
  true,
  `Expected ${targetUrl} to return a successful response, received ${response.status}`
);

const html = await response.text();
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(
  (match) => match[1]
);
const themeScripts = inlineScripts.filter(
  (script) =>
    !script.startsWith("self.__next_f.push") &&
    script.includes("document.documentElement") &&
    script.includes("localStorage")
);

assert.equal(
  themeScripts.length,
  1,
  `Expected exactly one inline theme initializer in ${targetUrl}, found ${themeScripts.length}`
);

const themeInitializer = themeScripts[0];

assert.doesNotMatch(
  themeInitializer,
  /\b__name\s*\(/,
  "Theme initializer must not reference the bundler-generated __name helper"
);

function executeInitializer(storedTheme, prefersDark) {
  const classes = new Set();
  const attributes = new Map();
  const documentElement = {
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
    },
    setAttribute: (name, value) => attributes.set(name, value),
    style: {},
  };

  const context = {
    document: { documentElement },
    localStorage: {
      getItem: (key) => (key === "theme" ? storedTheme : null),
    },
    window: {
      matchMedia: () => ({ matches: prefersDark }),
    },
  };

  vm.runInNewContext(themeInitializer, context, {
    filename: "served-theme-initializer.js",
    timeout: 1_000,
  });

  return { attributes, classes, colorScheme: documentElement.style.colorScheme };
}

for (const scenario of [
  { storedTheme: null, prefersDark: true, expected: "light" },
  { storedTheme: "light", prefersDark: true, expected: "light" },
  { storedTheme: "dark", prefersDark: false, expected: "dark" },
  { storedTheme: "system", prefersDark: false, expected: "light" },
  { storedTheme: "system", prefersDark: true, expected: "dark" },
]) {
  const result = executeInitializer(scenario.storedTheme, scenario.prefersDark);

  assert.equal(result.classes.has(scenario.expected), true);
  assert.equal(result.colorScheme, scenario.expected);
}

console.log(`Theme initializer PASS: ${targetUrl}`);
