import assert from "node:assert/strict";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:8787/";
const response = await fetch(targetUrl);

assert.equal(
  response.ok,
  true,
  `Expected ${targetUrl} to return a successful response, received ${response.status}`,
);

const html = await response.text();
const rootHtmlTag = html.match(/<html\b[^>]*>/i)?.[0];

assert.ok(rootHtmlTag, `Expected <html> root in served HTML from ${targetUrl}`);
assert.match(
  rootHtmlTag,
  /\bclass=(?:"[^"]*\blight\b[^"]*"|'[^']*\blight\b[^']*'|light\b)/i,
  `Expected <html> root in ${targetUrl} to include the light class`,
);
assert.doesNotMatch(html, /\b__name\s*\(/, `Served HTML from ${targetUrl} must not reference __name(...)`);

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
const activeThemeInitializers = inlineScripts.filter((script) => {
  const activeScript = !script.trimStart().startsWith("self.__next_f.push");
  const mutatesRoot = /document\.documentElement\b/.test(script);
  const readsThemePreference = /\blocalStorage\b|\bmatchMedia\b/.test(script);

  return activeScript && mutatesRoot && readsThemePreference;
});

assert.equal(
  activeThemeInitializers.length,
  0,
  `Expected zero active inline theme initializers in ${targetUrl}, found ${activeThemeInitializers.length}`,
);

console.log(`Fixed-light shell PASS: ${targetUrl}`);
