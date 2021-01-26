<template>
  <div>
    <div id="header">
      <h1>Aviation Checklist Creator</h1>
      <uploader
          v-on:csv_loaded="onCSVLoaded">
      </uploader>
      <downloader
          v-on:download_dynon="onDownloadDynon">
      </downloader>
      <div id="donate">
        <p><strong>Donate</strong></p>
        <p>This service is entirely free! If you find it useful, please donate.</p>
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
import Downloader from "@/components/Downloader";
import Uploader from "@/components/Uploader";

import papa from "papaparse";


export default {
  name: 'App',
  components: {
    ChecklistSet,
    Downloader,
    Uploader
  },
  data() {
    return {
      checklistSets: []
    }
  },
  methods: {
    onCSVLoaded: function(data) {
      var handle = this;
      papa.parse(data, {
        download: true,
        complete: function(results) {
          handle.handle_update(results)
        }
      });
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

      var link = document.createElement("a");
      link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(lines.join("\n")));
      link.setAttribute("download", "checklist.txt")
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handle_update: function(results) {
      var csv_data = results.data
      var checklist_sets = [];

      var current_checklistset = '';
      var current_checklist = '';
      for (let i = 0; i < csv_data.length; i++) {
        if (csv_data[i][0] !== current_checklistset && csv_data[i][0] !== "") {
          checklist_sets.push({title: csv_data[i][0], checklists: []});
          current_checklistset = csv_data[i][0];
        }
        if (csv_data[i][1] !== current_checklist) {
          checklist_sets.slice(-1)[0]['checklists'].push({title: csv_data[i][1], items: []})
          current_checklist = csv_data[i][1];
        }

        checklist_sets.slice(-1)[0]['checklists'].slice(-1)[0].items.push({subject: csv_data[i][2], operation: csv_data[i][3]});
      }

      this.checklistSets = checklist_sets;
    }
  }
}
</script>

<style>
div {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media screen {
  div#donate {
    float: left;
    display: block;
    width: 33%;
  }
}
@media print {
  div#header {
    display: none;
  }
  div#donate {
    display: none;
  }
}
</style>
