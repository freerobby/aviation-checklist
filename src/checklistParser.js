function lastSet(sets) {
  return sets.length ? sets[sets.length - 1] : null;
}

function lastChecklist(sets) {
  var set = lastSet(sets);
  return set && set.checklists.length ? set.checklists[set.checklists.length - 1] : null;
}

function appendNote(target, field, text) {
  if (!target) {
    return;
  }
  if (target[field]) {
    target[field] += "\n" + text;
  } else {
    target[field] = text;
  }
}

function noteLines(note) {
  return String(note || "").split("\n");
}

function parseMarkdown(raw) {
  var md_data = String(raw || "").split("\n");
  var checklist_sets = [];
  var lastTarget = null;
  var lastField = "note";

  while (md_data.length > 0) {
    var row = md_data.shift();
    var trimmed = row.replace(/^\s+/, "");

    if (trimmed.substring(0, 2) === "# ") {
      var set = { title: trimmed.substring(2), checklists: [] };
      checklist_sets.push(set);
      lastTarget = set;
      lastField = "footerNote";
    } else if (trimmed.substring(0, 3) === "## ") {
      var checklist = { title: trimmed.substring(3), items: [] };
      lastSet(checklist_sets).checklists.push(checklist);
      lastTarget = checklist;
      lastField = "note";
    } else if (trimmed.substring(0, 2) === "* ") {
      var item;
      var index = trimmed.indexOf(": ");
      if (index >= 0) {
        item = {
          subject: trimmed.substring(2, index),
          operation: trimmed.substring(index + 2)
        };
      } else {
        item = { subject: trimmed.substring(2) };
      }
      lastChecklist(checklist_sets).items.push(item);
      lastTarget = item;
      lastField = "note";
    } else if (trimmed.charAt(0) === ">") {
      var noteText = trimmed.substring(1).replace(/^\s+/, "");
      appendNote(lastTarget, lastField, noteText);
    }
  }

  return checklist_sets;
}

function checklistSetsFromCsvRows(csv_data) {
  var checklist_sets = [];
  var current_checklistset = null;
  var current_checklist = null;

  for (var i = 0; i < csv_data.length; i++) {
    if (csv_data[i].length < 2 && csv_data[i][0] === "") {
      continue;
    }
    if (csv_data[i][0] !== current_checklistset) {
      checklist_sets.push({ title: csv_data[i][0], checklists: [] });
      current_checklistset = csv_data[i][0];
      current_checklist = null;
    }
    if (csv_data[i][1] !== current_checklist) {
      lastSet(checklist_sets).checklists.push({ title: csv_data[i][1], items: [] });
      current_checklist = csv_data[i][1];
    }
    var item = { subject: csv_data[i][2], operation: csv_data[i][3] };
    if (csv_data[i][4]) {
      item.note = csv_data[i][4];
    }
    lastChecklist(checklist_sets).items.push(item);
  }

  return checklist_sets;
}

function markdownFromChecklistSets(data) {
  var lines = [];
  for (var set = 0; set < data.length; set++) {
    lines.push("# " + data[set].title);
    lines.push("");
    if (data[set].footerNote) {
      noteLines(data[set].footerNote).forEach(function(line) {
        lines.push("> " + line);
      });
      lines.push("");
    }
    for (var checklist = 0; checklist < data[set].checklists.length; checklist++) {
      lines.push("## " + data[set].checklists[checklist].title);
      lines.push("");
      if (data[set].checklists[checklist].note) {
        noteLines(data[set].checklists[checklist].note).forEach(function(line) {
          lines.push("> " + line);
        });
        lines.push("");
      }
      for (var i = 0; i < data[set].checklists[checklist].items.length; i++) {
        var item = data[set].checklists[checklist].items[i];
        if (item.operation !== undefined) {
          lines.push("* " + item.subject + ": " + item.operation);
        } else {
          lines.push("* " + item.subject);
        }
        if (item.note) {
          noteLines(item.note).forEach(function(line) {
            lines.push("> " + line);
          });
        }
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}

module.exports = {
  parseMarkdown: parseMarkdown,
  checklistSetsFromCsvRows: checklistSetsFromCsvRows,
  markdownFromChecklistSets: markdownFromChecklistSets
};
