const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

function loadParser() {
  return require("./checklistParser.js");
}

describe("parseMarkdown notes", () => {
  it("attaches footer, checklist, and item notes", () => {
    const { parseMarkdown } = loadParser();
    const sets = parseMarkdown(`# Emergency
> Memory items in bold

## Engine Fire
> Perform from memory

* Mixture: Cutoff
> If fire persists, land immediately
* Fuel Selector: Off
`);
    assert.equal(sets[0].footerNote, "Memory items in bold");
    assert.equal(sets[0].checklists[0].note, "Perform from memory");
    assert.equal(sets[0].checklists[0].items[0].note, "If fire persists, land immediately");
    assert.equal(sets[0].checklists[0].items[1].note, undefined);
  });

  it("joins consecutive note lines", () => {
    const { parseMarkdown } = loadParser();
    const sets = parseMarkdown(`# Preflight

## Cockpit

* Mags: Off
> Line one
> Line two
`);
    assert.equal(sets[0].checklists[0].items[0].note, "Line one\nLine two");
  });
});

describe("markdown round trip", () => {
  it("preserves notes through export and parse", () => {
    const { parseMarkdown, markdownFromChecklistSets } = loadParser();
    const source = `# Section
> Footer note

## Checklist
> Checklist note

* Item: Action
> Item note

`;
    const once = parseMarkdown(source);
    const exported = markdownFromChecklistSets(once);
    const twice = parseMarkdown(exported);
    assert.deepEqual(twice, once);
  });
});

describe("csv notes", () => {
  it("reads an optional fifth column as an item note", () => {
    const { checklistSetsFromCsvRows } = loadParser();
    const sets = checklistSetsFromCsvRows([
      ["Preflight", "Cockpit", "Mags", "Off", "Key out"]
    ]);
    assert.equal(sets[0].checklists[0].items[0].note, "Key out");
  });
});
