<template>
  <div>
    <checklist-set
        v-for="checklistSet in checklistSets"
        v-bind:title="checklistSet.title"
        v-bind:checklists="checklistSet.checklists"
        v-bind:key="checklistSet.id"
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
