<template>
  <div>
    <div id="header">
      <h1>Aviation Checklist Creator</h1>
      <div class="instructions">
        <ol>
          <li>
            Write your checklist in the following format:
            <pre>
# Name of Section

## Name of Checklist 1

* Item 1: Action to Perform
* Item 2: Action to Perform

## Name of Checklist 2

* Item 1: Action to Perform
* Item 2: Action to Perform
            </pre>
          </li>
          <li>This tool will render your checklist to CSV, Dynon, and PDF.</li>
        </ol>
      </div>
      <div id="editor">
        <div v-if="checklistSets.length === 0">
        <p>
          Want a demo? Use
          <strong><a href="#" v-on:click="loadCSVFromWebURL('/assets/checklists/n934gr.md')">my checklist</a></strong>, make changes, and watch them update.
        </p>
        </div>
        <textarea rows="16" cols="62" v-model="user_raw_data" style="overflow-y:scroll;">
        </textarea>
      </div>
      <div id="right-pane">
        <div class="file_container" v-on:drop.prevent="importFile" v-on:dragover.prevent>
          <p>Have your own file? Drag it here to import it.</p>
        </div>
        <div v-if="checklistSets.length > 0">
          <p><strong>Download</strong></p>
          <ul>
            <li>
              <a href="#" v-on:click="onDownloadMarkdown">Original</a> (for re-importing later)
            </li>
            <li>
              <a href="#" v-on:click="onDownloadCSV">CSV</a>
            </li>
            <li>
              <a href="#" v-on:click="onDownloadDynon">Dynon</a>
            </li>
            <li>
              <a href="#" v-on:click="onDownloadFlightDeckEFB">FlightDeck EFB</a>
            </li>
            <li>Use print dialog to save to PDF (3 sections per page).</li>
            <li>
              Want another format? Let me know at robby@freerobby.com.
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="threecol">
      <checklist-set
          v-for="(checklistSet, index) in checklistSets"
          v-bind:title="checklistSet.title"
          v-bind:checklists="checklistSet.checklists"
          v-bind:key="checklistSet.id"
          v-bind:generated="(index === 0)?'Printed ' + formatted_date():''"
      ></checklist-set>
    </div>
  </div>
</template>

<script>
import ChecklistSet from "@/components/ChecklistSet";

import papa from "papaparse";


export default {
  name: 'App',
  components: {
    ChecklistSet,
  },
  data() {
    return {
      checklistSets: [],
      user_raw_data: ''
    }
  },
  beforeMount() {
    if (localStorage.getItem("user_raw_data") !== null)
      this.user_raw_data = localStorage.getItem("user_raw_data");
  },
  methods: {
    formatted_date: function() {
      var d = new Date();
      return d.toDateString()
    },
    importFile: function(event) {
      let csv_file = event.dataTransfer.files[0];
      var reader = new FileReader();
      reader.readAsText(csv_file,"UTF-8");
      reader.onload = readerEvent => {
        var content = readerEvent.target.result;
        this.loadCSVFromRaw(content);
      }
    },
    loadCSVFromWebURL: function(url) {
      var handle = this;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.send(null);
      xhr.onload = function() {
        handle.loadCSVFromRaw(xhr.responseText)
      }
    },
    loadCSVFromRaw: function(data) {
      this.user_raw_data = data;
    },
    initiatePlaintextDownload: function(filename, data) {
      var link = document.createElement("a");
      link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
      link.setAttribute("download", filename)
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onDownloadCSV: function() {
      this.initiatePlaintextDownload("checklist.csv", this.user_raw_data);
    },
    onDownloadDynon: function() {
      var data = this.checklistSets;
      var lines = [];
      var num_checklists = 0;
      for (var set = 0; set < data.length; set++) {
        for (var checklist = 0; checklist < data[set].checklists.length; checklist++) {
          lines.push("CHKLST" + (num_checklists).toString() + ".TITLE, " + data[set].title + ": " + data[set].checklists[checklist].title);
          for (var i = 0; i < data[set].checklists[checklist].items.length; i++) {
            if (data[set].checklists[checklist].items[i].operation !== undefined) {
              lines.push(
                  "CHKLST" +
                  (num_checklists).toString() +
                  ".LINE" + (i+1).toString() +
                  ", " +
                  data[set].checklists[checklist].items[i].subject +
                  ": " +
                  data[set].checklists[checklist].items[i].operation
              );
            }
            else {
              lines.push(
                  "CHKLST" +
                  (num_checklists).toString() +
                  ".LINE" + (i+1).toString() +
                  ", " +
                  data[set].checklists[checklist].items[i].subject
              );
            }

          }

          num_checklists++;
        }
      }

      this.initiatePlaintextDownload("checklist.txt", lines.join("\n"));
    },
    onDownloadFlightDeckEFB: function() {
      var export_data = {};
      export_data["name"] = "Aviation Checklist Export";
      export_data["checklistSections"] = [];

      var data = this.checklistSets;
      for (var set = 0; set < data.length; set++) {
        for (var checklist = 0; checklist < data[set].checklists.length; checklist++) {
          var this_export_checklist = {};
          this_export_checklist["name"] = data[set].title + ": " + data[set].checklists[checklist].title;
          this_export_checklist["isAbnormalProcedure"] = data[set].title === "Reference";
          this_export_checklist["isEmergencyProcedure"] = data[set].title === "Emergency";

          this_export_checklist["checklistItems"] = [];
          for (var i = 0; i < data[set].checklists[checklist].items.length; i++) {
            this_export_checklist["checklistItems"].push({
              "name": data[set].checklists[checklist].items[i].subject + " - " + data[set].checklists[checklist].items[i].operation,
              "completed": false
            });
          }

          export_data["checklistSections"].push(this_export_checklist);
        }
      }

      this.initiatePlaintextDownload("checklist.fdcl", JSON.stringify(export_data));
    },
    onDownloadMarkdown: function() {
      var data = this.checklistSets;
      var lines = [];
      for (var set = 0; set < data.length; set++) {
        lines.push("# " + data[set].title);
        lines.push("");
        for (var checklist = 0; checklist < data[set].checklists.length; checklist++) {
          lines.push("## " + data[set].checklists[checklist].title);
          lines.push("");
          for (var i = 0; i < data[set].checklists[checklist].items.length; i++) {
            if (data[set].checklists[checklist].items[i].operation !== undefined) {
              lines.push("* " + data[set].checklists[checklist].items[i].subject + ": " + data[set].checklists[checklist].items[i].operation);
            }
            else {
              lines.push("* " + data[set].checklists[checklist].items[i].subject);
            }
          }
          lines.push("");
        }
      }
      
      this.initiatePlaintextDownload("checklist.md", lines.join("\n"));
    },
    handle_update_csv: function(results) {
      var csv_data = results.data
      var checklist_sets = [];

      var current_checklistset = null;
      var current_checklist = null;
      for (let i = 0; i < csv_data.length; i++) {
        if (csv_data[i].length < 2 && csv_data[i][0] === "") {
          continue; // Skip partial lines.
        }
        if (csv_data[i][0] !== current_checklistset) {
          checklist_sets.push({title: csv_data[i][0], checklists: []});
          current_checklistset = csv_data[i][0];
          current_checklist = null;
        }
        if (csv_data[i][1] !== current_checklist) {
          checklist_sets.slice(-1)[0]['checklists'].push({title: csv_data[i][1], items: []})
          current_checklist = csv_data[i][1];
        }
        checklist_sets.slice(-1)[0]['checklists'].slice(-1)[0].items.push({subject: csv_data[i][2], operation: csv_data[i][3]});
      }

      this.checklistSets = checklist_sets;
    },
    parse: function(raw) {
      if (raw.substring(0, 1) === "#")
        this.parse_md(raw);
      else
        this.parse_csv(raw);
    },
    parse_csv: function(raw) {
      var handle = this;
      papa.parse(raw, {
        complete: function(results) {
          handle.handle_update_csv(results)
        }
      });
    },
    parse_md: function(raw) {
      var md_data = raw.split("\n");
      var checklist_sets = [];

      while (md_data.length > 0) {
        var row = md_data.shift();
        if (row.substring(0,2) === "# ") {
          checklist_sets.push({title: row.substring(2), checklists: []});
        }
        else if (row.substring(0,3) === "## ") {
          checklist_sets.slice(-1)[0]['checklists'].push({title: row.substring(3), items: []})
        }
        else if (row.substring(0, 2) === "* ") {
          var index = row.indexOf(": ");
          if (index >= 0) {
            checklist_sets.slice(-1)[0]['checklists'].slice(-1)[0].items.push({
              subject: row.substring(2, index),
              operation: row.substring(index + 2)
            });
          }
          else {
            checklist_sets.slice(-1)[0]['checklists'].slice(-1)[0].items.push({
              subject: row.substring(2)
            })
          }
        }
      }

      this.checklistSets = checklist_sets;
    }
  },
  watch: {
    user_raw_data: function(newVal) {
      if (newVal !== "") {
        localStorage.setItem("user_raw_data", newVal);
      }
      this.parse(newVal);
    }
  },
}
</script>

<style>

div {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Verdana, sans-serif;
}

div.threecol {
  #font-style: italic;
  clear: both;
  column-count: 3;

  #column-gap: 0.5rem;
  #column-fill: balance;
  #column-width: 20rem;
  #width: 800px;
}

@media screen {
  div#header {
    display: block;
    clear: both;
    float: left;
    height: auto;
    width: 100%;
    margin-bottom: 8px;
  }
  div#right-pane, div .instructions, div#editor, div#upload {
    float: left;
    display: block;
    width: 33%;
  }
  div#right-pane .file_container {
    width: 90%;
    height: 50px;
    border: 2px dotted gray;
    text-align: center;
  }
  div.threecol {
    font-size: 90%;
  }
}
@media print {
  div#header {
    display: none;
  }
  div#right-pane, div .instructions, div#editor, div#upload {
    display: none;
  }
  div.threecol {
    font-size: 70%;
  }
}
</style>
