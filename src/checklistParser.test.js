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
    assert.deepEqual(sets[0].annotations, [{ kind: "note", text: "Memory items in bold" }]);
    assert.deepEqual(sets[0].checklists[0].annotations, [{ kind: "note", text: "Perform from memory" }]);
    assert.deepEqual(sets[0].checklists[0].items[0].annotations, [{ kind: "note", text: "If fire persists, land immediately" }]);
    assert.equal(sets[0].checklists[0].items[1].annotations, undefined);
  });

  it("joins consecutive note lines", () => {
    const { parseMarkdown } = loadParser();
    const sets = parseMarkdown(`# Preflight

## Cockpit

* Mags: Off
> Line one
> Line two
`);
    assert.deepEqual(sets[0].checklists[0].items[0].annotations, [{ kind: "note", text: "Line one\nLine two" }]);
  });

  it("keeps warnings bold-callouts separate from notes and in source order", () => {
    const { parseMarkdown } = loadParser();
    const sets = parseMarkdown(`# Emergency
!> Footer warning

## Engine Fire
> Perform from memory
!> Land as soon as possible

* Mixture: Cutoff
> If fire persists, land immediately
!> Fuel selector off
!> Evacuate upwind
`);
    assert.deepEqual(sets[0].annotations, [{ kind: "warning", text: "Footer warning" }]);
    assert.deepEqual(sets[0].checklists[0].annotations, [
      { kind: "note", text: "Perform from memory" },
      { kind: "warning", text: "Land as soon as possible" }
    ]);
    assert.deepEqual(sets[0].checklists[0].items[0].annotations, [
      { kind: "note", text: "If fire persists, land immediately" },
      { kind: "warning", text: "Fuel selector off\nEvacuate upwind" }
    ]);
  });
});

describe("markdown round trip", () => {
  it("preserves notes and warnings through export and parse", () => {
    const { parseMarkdown, markdownFromChecklistSets } = loadParser();
    const source = `# Section
> Footer note
!> Footer warning

## Checklist
> Checklist note

* Item: Action
> Item note
!> Item warning

`;
    const once = parseMarkdown(source);
    const exported = markdownFromChecklistSets(once);
    const twice = parseMarkdown(exported);
    assert.deepEqual(twice, once);
    assert.match(exported, /!> Footer warning/);
    assert.match(exported, /!> Item warning/);
  });
});

describe("csv notes", () => {
  it("reads an optional fifth column as an item note", () => {
    const { checklistSetsFromCsvRows } = loadParser();
    const sets = checklistSetsFromCsvRows([
      ["Preflight", "Cockpit", "Mags", "Off", "Key out"]
    ]);
    assert.deepEqual(sets[0].checklists[0].items[0].annotations, [{ kind: "note", text: "Key out" }]);
  });
});
