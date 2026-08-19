import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const checkerPath = new URL("./check-theme-initializer.mjs", import.meta.url).pathname;
const fixtureUrl = (html) => `data:text/html,${encodeURIComponent(html)}`;
const initializerAssertion = /Expected zero active inline theme initializers/;
const missingLightAssertion = /include the light class/;
const forbiddenDarkAssertion = /dark class/;

const fixtures = [
  {
    name: "exact light root token is accepted",
    html: '<html class="light"><body></body></html>',
    shouldPass: true,
  },
  {
    name: "light root token among unrelated tokens is accepted",
    html: '<html class="portfolio light hydrated"><body></body></html>',
    shouldPass: true,
  },
  {
    name: "light substring in a different root token is rejected",
    html: '<html class="not-light"><body></body></html>',
    shouldPass: false,
    expectedError: missingLightAssertion,
  },
  {
    name: "data-class does not satisfy the root class contract",
    html: '<html data-class="light"><body></body></html>',
    shouldPass: false,
    expectedError: missingLightAssertion,
  },
  {
    name: "dark root token is rejected even when light is present",
    html: '<html class="light dark"><body></body></html>',
    shouldPass: false,
    expectedError: forbiddenDarkAssertion,
  },
  {
    name: "read-only root alias is accepted",
    html: '<html class="light"><body><script>const root=document.documentElement; localStorage.getItem("theme")</script></body></html>',
    shouldPass: true,
  },
  {
    name: "pure Flight payload script is ignored",
    html: '<html class="light"><body><script>self.__next_f.push([1,"document.documentElement.classList.add(localStorage.getItem(\\"theme\\"))"]);</script></body></html>',
    shouldPass: true,
  },
  {
    name: "root mutation with localStorage only in a comment is accepted",
    html: '<html class="light"><body><script>// localStorage.getItem("theme")\ndocument.documentElement.classList.add("portfolio-shell")</script></body></html>',
    shouldPass: true,
  },
  {
    name: "root mutation with localStorage only in a string is accepted",
    html: '<html class="light"><body><script>const note="localStorage.getItem(\\"theme\\")"; document.documentElement.classList.add("portfolio-shell")</script></body></html>',
    shouldPass: true,
  },
  {
    name: "root mutation text in a comment is ignored",
    html: '<html class="light"><body><script>localStorage.getItem("theme"); // document.documentElement.classList.add("dark")</script></body></html>',
    shouldPass: true,
  },
  {
    name: "root mutation text in a string is ignored",
    html: '<html class="light"><body><script>localStorage.getItem("theme"); const example="document.documentElement.classList.add(\\"dark\\")"</script></body></html>',
    shouldPass: true,
  },
  {
    name: "classList.add on a const root alias is rejected",
    html: '<html class="light"><body><script>const root=document.documentElement; const theme=localStorage.getItem("theme"); root.classList.add(theme||"light")</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "classList.remove on the direct root is rejected",
    html: '<html class="light"><body><script>const theme=localStorage.getItem("theme"); document.documentElement.classList.remove(theme)</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "classList.toggle on a let root alias is rejected",
    html: '<html class="light"><body><script>let root=document.documentElement; const theme=localStorage.getItem("theme"); root.classList.toggle(theme)</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "classList.replace on the direct root is rejected",
    html: '<html class="light"><body><script>const theme=localStorage.getItem("theme"); document.documentElement.classList.replace("light",theme)</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "className assignment on a var root alias is rejected",
    html: '<html class="light"><body><script>var root=document.documentElement; const theme=localStorage.getItem("theme"); root.className=theme</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "setAttribute on the direct root is rejected",
    html: '<html class="light"><body><script>const theme=localStorage.getItem("theme"); document.documentElement.setAttribute("class",theme)</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "style property assignment on a root alias is rejected",
    html: '<html class="light"><body><script>const root=document.documentElement; const theme=localStorage.getItem("theme"); root.style.colorScheme=theme</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "style assignment on the direct root is rejected",
    html: '<html class="light"><body><script>const theme=localStorage.getItem("theme"); document.documentElement.style=theme</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "style.setProperty on a root alias is rejected",
    html: '<html class="light"><body><script>const root=document.documentElement; const theme=localStorage.getItem("theme"); root.style.setProperty("color-scheme",theme)</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "initializer after a Flight push in the same script is rejected",
    html: '<html class="light"><body><script>self.__next_f.push([1,"payload"]); const theme=localStorage.getItem("theme"); document.documentElement.classList.add(theme)</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
  {
    name: "initializer executed inside a Flight push argument is rejected",
    html: '<html class="light"><body><script>self.__next_f.push([document.documentElement.classList.replace("light",localStorage.getItem("theme"))])</script></body></html>',
    shouldPass: false,
    expectedError: initializerAssertion,
  },
];

const failures = [];

for (const fixture of fixtures) {
  const result = spawnSync(process.execPath, [checkerPath, fixtureUrl(fixture.html)], { encoding: "utf8" });
  const passed = result.status === 0;

  try {
    assert.equal(
      passed,
      fixture.shouldPass,
      `${fixture.name}: expected checker to ${fixture.shouldPass ? "pass" : "fail"}, received exit ${result.status}\n${result.stderr}`,
    );

    if (fixture.expectedError) {
      assert.match(result.stderr, fixture.expectedError, `${fixture.name}: checker failed on the wrong assertion`);
    }

    console.log(`Fixture PASS: ${fixture.name}`);
  } catch (error) {
    failures.push(error.message);
  }
}

assert.deepEqual(failures, [], `Fixture failures:\n- ${failures.join("\n- ")}`);
console.log(`Fixture suite PASS: ${fixtures.length} fixed-light checker scenarios`);
