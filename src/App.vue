<template>
  <div>
    <div id="header">
      <h1>Aviation Checklist Creator</h1>
      <div class="instructions">
        <p><strong>How It Works</strong></p>
        <ol>
          <li>Create a CSV spreadsheet with four columns.</li>
          <li>For each checklist item, add a row: <em>section</em>, <em>checklist</em>, <em>item</em>, <em>action</em>.</li>
          <li>This tool will render your checklist in several common formats.</li>
        </ol>
        <div id="demo" v-if="checklistSets.length === 0">
          <p><strong>Want a live demo?</strong> Here's my <a href="#" v-on:click="loadCSVFromWebURL('/assets/checklists/n934gr.csv')">my checklist</a>.</p>
        </div>
        <div id="download" v-if="checklistSets.length > 0">
          <p><strong>Download</strong></p>
          <ul>
            <li>
              <a href="#" v-on:click="onDownloadCSV">CSV</a>
            </li>
            <li>
              <a href="#" v-on:click="onDownloadDynon">Dynon</a>
            </li>
            <li>Use print dialog to save to PDF (3 sections per page).</li>
            <li>
              Want another format? Let me know at robby@freerobby.com.
            </li>
          </ul>
        </div>
      </div>
      <div id="upload" v-if="user_csv_data.length === 0">
        <p>
          <strong>Import your own checklist</strong>
          or
          <strong>
            <a href="#" v-on:click="loadCSVFromWebURL('/assets/checklists/template.csv')">start making one</a>.
          </strong>
        </p>
        <div class="file_container" v-on:drop.prevent="importFile" v-on:dragover.prevent>
          <p>Drag your CSV here.</p>
        </div>
      </div>
      <div id="editor" v-if="user_csv_data.length > 0">
        <textarea rows="14" cols="62" v-model="user_csv_data" style="overflow-y:scroll;">
        </textarea>
      </div>
      <div id="donate">
        <p><strong>Share Your Checklist</strong></p>
        <p>I'd love to add some starter checklists that folks can customize. If you have one you'd like to share with the community, please email it to robby@freerobby.com.</p>
        <p><strong>Donate</strong></p>
        <p>This service is free, but if you use it commercially, please consider donating.</p>
        <ul>
          <li>Bitcoin: bc1ql92yyypywyy4ajgcs2ha69yx2zyhg22ej96mx5</li>
          <li>Venmo: @freerobby</li>
          <li><a href="https://www.paypal.com/donate?hosted_button_id=TBK867SUY8FLU">Paypal</a></li>
        </ul>
      </div>
    </div>
    <checklist-set
        v-for="checklistSet in checklistSets"
        v-bind:title="checklistSet.title"
        v-bind:checklists="checklistSet.checklists"
        v-bind:key="checklistSet.id"
    ></checklist-set>
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
      user_csv_data: ''
    }
  },
  beforeMount() {
    if (localStorage.getItem("csv_data") !== null)
      this.user_csv_data = localStorage.getItem("csv_data");
  },
  methods: {
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
      this.user_csv_data = data;
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
      this.initiatePlaintextDownload("checklist.csv", this.user_csv_data);
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
    handle_update: function(results) {
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
    }
  },
  watch: {
    user_csv_data: function(newVal) {
      if (newVal !== "") {
        localStorage.setItem("csv_data", newVal);
      }
      var handle = this;
      papa.parse(newVal, {
        complete: function(results) {
          handle.handle_update(results)
        }
      });
    }
  },
}
</script>

<style>
div {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  div#donate, div .instructions, div#editor, div#upload {
    float: left;
    display: block;
    width: 33%;
  }
  div#upload .file_container {
    width: 90%;
    height: 160px;
    border: 2px dotted gray;
    text-align: center;
  }
}
@media print {
  div#header {
    display: none;
  }
  div#donate, div .instructions, div#editor, div#upload {
    display: none;
  }
}
</style>
