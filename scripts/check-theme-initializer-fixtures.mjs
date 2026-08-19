import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const checkerPath = new URL("./check-theme-initializer.mjs", import.meta.url).pathname;
const fixtureUrl = (html) => `data:text/html,${encodeURIComponent(html)}`;
const readOnlyRootFixture = fixtureUrl(
  '<html class="light"><body><script>const root=document.documentElement; localStorage.getItem("theme")</script></body></html>',
);
const dynamicInitializerFixture = fixtureUrl(
  '<html class="light"><body><script>const root=document.documentElement; const theme=localStorage.getItem("theme"); root.classList.add(theme||"light"); root.style.colorScheme=theme||"light"</script></body></html>',
);
const runChecker = (url) => spawnSync(process.execPath, [checkerPath, url], { encoding: "utf8" });

const readOnlyResult = runChecker(readOnlyRootFixture);
assert.equal(
  readOnlyResult.status,
  0,
  `Read-only root fixture must pass: ${readOnlyRootFixture}\n${readOnlyResult.stderr}`,
);

const dynamicInitializerResult = runChecker(dynamicInitializerFixture);
assert.notEqual(
  dynamicInitializerResult.status,
  0,
  `Dynamic initializer fixture must fail: ${dynamicInitializerFixture}`,
);
assert.match(
  dynamicInitializerResult.stderr,
  /Expected zero active inline theme initializers/,
  `Dynamic initializer fixture must fail on the initializer assertion: ${dynamicInitializerFixture}`,
);

console.log(`Fixture PASS: read-only root reference accepted: ${readOnlyRootFixture}`);
console.log(`Fixture PASS: dynamic initializer rejected: ${dynamicInitializerFixture}`);
