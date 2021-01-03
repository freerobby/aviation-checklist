<template>
  <div>
    <checklist-set
        v-for="checklistSet in checklistSets"
        v-bind:title="checklistSet.title"
        v-bind:checklists="checklistSet.checklists"
        v-bind:key="checklistSet.id"
        v-on:generate_lines="onGenerateLines"
    ></checklist-set>
  </div>
</template>

<script>
import ChecklistSet from './components/ChecklistSet.vue'

import papa from "papaparse";


export default {
  name: 'App',
  components: {
    ChecklistSet
  },
  data() {
    return {
      checklistSets: []
    }
  },
  created: function() {
    this.load_data();
  },
  methods: {
    onGenerateLines: function() {
      var data = this.checklistSets;
      var lines = [];
      var num_checklists = 0;
      console.log(data);
      for (var set = 0; set < data.length; set++) {
        console.log(data[set])
        for (var checklist = 0; checklist < data[set].checklists.length; checklist++) {
          console.log(data[set].checklists[checklist])
          lines.push("CHKLST" + (num_checklists).toString() + ".TITLE, " + data[set].title + ": " + data[set].checklists[checklist].title);
          for (var i = 0; i < data[set].checklists[checklist].items.length; i++) {
            lines.push("CHKLST" + (num_checklists).toString() + ".LINE" + (i+1).toString() + ", " + data[set].checklists[checklist].items[i].subject + ": " + data[set].checklists[checklist].items[i].operation);
          }

          num_checklists++;
        }
      }

      console.log(lines);
    },
    load_data: function() {
      var foo = this;
      papa.parse('http://localhost:8080/n934gr.csv', {
        download: true,
        complete: function(results) {
          foo.handle_update(results)
        }
      });
    },
    handle_update: function(results) {
      var csv_data = results.data
      var checklist_sets = [];

      var current_checklistset = '';
      var current_checklist = '';
      for (let i = 0; i < csv_data.length; i++) {
        if (csv_data[i][0] !== current_checklistset) {
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
</style>
