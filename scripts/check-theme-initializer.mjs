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
const rootClassAttribute = rootHtmlTag.match(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
const rootClassValue = rootClassAttribute?.slice(1).find((value) => value !== undefined) ?? "";
const rootClassTokens = new Set(rootClassValue.split(/\s+/).filter(Boolean));

assert.ok(
  rootClassTokens.has("light"),
  `Expected <html> root in ${targetUrl} to include the light class`,
);
assert.equal(
  rootClassTokens.has("dark"),
  false,
  `Expected <html> root in ${targetUrl} to not include the dark class`,
);
assert.doesNotMatch(html, /\b__name\s*\(/, `Served HTML from ${targetUrl} must not reference __name(...)`);

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const executableJavaScript = (source) => {
  const executable = source.split("").map((character) => (character === "\n" || character === "\r" ? character : " "));

  function skipQuotedLiteral(start, quote) {
    let index = start + 1;

    while (index < source.length) {
      if (source[index] === "\\") {
        index += 2;
      } else if (source[index] === quote) {
        return index + 1;
      } else {
        index += 1;
      }
    }

    return index;
  }

  function scanTemplateLiteral(start) {
    let index = start + 1;

    while (index < source.length) {
      if (source[index] === "\\") {
        index += 2;
      } else if (source[index] === "`") {
        return index + 1;
      } else if (source[index] === "$" && source[index + 1] === "{") {
        index = scanCode(index + 2, true);
      } else {
        index += 1;
      }
    }

    return index;
  }

  function scanCode(start, insideTemplateExpression = false) {
    let index = start;
    let braceDepth = insideTemplateExpression ? 1 : 0;

    while (index < source.length) {
      const character = source[index];
      const nextCharacter = source[index + 1];

      if (character === "'" || character === '"') {
        index = skipQuotedLiteral(index, character);
      } else if (character === "`") {
        index = scanTemplateLiteral(index);
      } else if (character === "/" && nextCharacter === "/") {
        index += 2;
        while (index < source.length && source[index] !== "\n" && source[index] !== "\r") index += 1;
      } else if (character === "/" && nextCharacter === "*") {
        index += 2;
        while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) index += 1;
        index = Math.min(index + 2, source.length);
      } else if (insideTemplateExpression && character === "{") {
        braceDepth += 1;
        executable[index] = character;
        index += 1;
      } else if (insideTemplateExpression && character === "}") {
        braceDepth -= 1;
        if (braceDepth === 0) return index + 1;
        executable[index] = character;
        index += 1;
      } else {
        executable[index] = character;
        index += 1;
      }
    }

    return index;
  }

  scanCode(0);
  return executable.join("");
};
const isPureFlightPayloadScript = (script) => {
  let index = 0;
  let foundFlightPush = false;

  while (index < script.length) {
    while (index < script.length && /[\s;]/.test(script[index])) index += 1;
    if (index === script.length) return foundFlightPush;

    const flightPush = /^self\s*\.\s*__next_f\s*\.\s*push\s*\(/.exec(script.slice(index));
    if (!flightPush) return false;

    foundFlightPush = true;
    index += flightPush[0].length;
    let parenthesisDepth = 1;

    while (index < script.length && parenthesisDepth > 0) {
      if (script[index] === "(") parenthesisDepth += 1;
      if (script[index] === ")") parenthesisDepth -= 1;
      index += 1;
    }

    if (parenthesisDepth !== 0) return false;
  }

  return foundFlightPush;
};
const hasRootMutation = (script) => {
  const rootAliases = [
    ...script.matchAll(
      /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*document\s*\.\s*documentElement\b/g,
    ),
  ].map((match) => match[1]);
  const directRootTarget = "(?<![\\w$])document\\s*\\.\\s*documentElement(?![\\w$])";
  const aliasTargets = rootAliases.map(
    (alias) => `(?<![\\w$.])${escapeRegExp(alias)}(?![\\w$])`,
  );
  const rootTarget = [directRootTarget, ...aliasTargets].join("|");
  const mutation = new RegExp(
    `(?:${rootTarget})\\s*(?:\\.\\s*classList\\s*\\.\\s*(?:add|remove|toggle|replace)\\s*\\(|\\.\\s*className\\s*=(?!=)|\\.\\s*setAttribute\\s*\\(|\\.\\s*style(?:\\s*\\.\\s*[A-Za-z_$][\\w$]*)?\\s*=(?!=)|\\.\\s*style\\s*\\.\\s*setProperty\\s*\\()`,
  );

  return mutation.test(script);
};
const activeThemeInitializers = inlineScripts.filter((script) => {
  const executableScript = executableJavaScript(script);
  const activeScript = !isPureFlightPayloadScript(executableScript);
  const mutatesRoot = hasRootMutation(executableScript);
  const readsThemePreference = /\b(?:localStorage|matchMedia)\b/.test(executableScript);

  return activeScript && mutatesRoot && readsThemePreference;
});

assert.equal(
  activeThemeInitializers.length,
  0,
  `Expected zero active inline theme initializers in ${targetUrl}, found ${activeThemeInitializers.length}`,
);

console.log(`Fixed-light shell PASS: ${targetUrl}`);
