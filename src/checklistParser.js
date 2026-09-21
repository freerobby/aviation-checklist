function lastSet(sets) {
  return sets.length ? sets[sets.length - 1] : null;
}

function lastChecklist(sets) {
  var set = lastSet(sets);
  return set && set.checklists.length ? set.checklists[set.checklists.length - 1] : null;
}

function appendAnnotation(target, kind, text) {
  if (!target) {
    return;
  }
  if (!target.annotations) {
    target.annotations = [];
  }
  var last = target.annotations[target.annotations.length - 1];
  if (last && last.kind === kind) {
    last.text += "\n" + text;
  } else {
    target.annotations.push({ kind: kind, text: text });
  }
}

function writeAnnotations(lines, annotations) {
  (annotations || []).forEach(function(annotation) {
    var marker = annotation.kind === "warning" ? "!>" : ">";
    String(annotation.text || "").split("\n").forEach(function(line) {
      lines.push(marker + " " + line);
    });
  });
}

function parseMarkdown(raw) {
  var md_data = String(raw || "").split("\n");
  var checklist_sets = [];
  var lastTarget = null;

  while (md_data.length > 0) {
    var row = md_data.shift();
    var trimmed = row.replace(/^\s+/, "");

    if (trimmed.substring(0, 2) === "# ") {
      var set = { title: trimmed.substring(2), checklists: [] };
      checklist_sets.push(set);
      lastTarget = set;
    } else if (trimmed.substring(0, 3) === "## ") {
      var checklist = { title: trimmed.substring(3), items: [] };
      lastSet(checklist_sets).checklists.push(checklist);
      lastTarget = checklist;
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
    } else if (trimmed.substring(0, 2) === "!>") {
      appendAnnotation(lastTarget, "warning", trimmed.substring(2).replace(/^\s+/, ""));
    } else if (trimmed.charAt(0) === ">") {
      appendAnnotation(lastTarget, "note", trimmed.substring(1).replace(/^\s+/, ""));
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
      appendAnnotation(item, "note", csv_data[i][4]);
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
    if (data[set].annotations && data[set].annotations.length) {
      writeAnnotations(lines, data[set].annotations);
      lines.push("");
    }
    for (var checklist = 0; checklist < data[set].checklists.length; checklist++) {
      lines.push("## " + data[set].checklists[checklist].title);
      lines.push("");
      if (data[set].checklists[checklist].annotations && data[set].checklists[checklist].annotations.length) {
        writeAnnotations(lines, data[set].checklists[checklist].annotations);
        lines.push("");
      }
      for (var i = 0; i < data[set].checklists[checklist].items.length; i++) {
        var item = data[set].checklists[checklist].items[i];
        if (item.operation !== undefined) {
          lines.push("* " + item.subject + ": " + item.operation);
        } else {
          lines.push("* " + item.subject);
        }
        writeAnnotations(lines, item.annotations);
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
