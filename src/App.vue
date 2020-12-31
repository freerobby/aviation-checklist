<template>
  <div>
    <checklist-set
        v-bind:title="checklistSet.title"
        v-bind:checklists="checklistSet.checklists"
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
      checklistSet: {
        title: 'Taxi',
        checklists: [
          {
            title: 'Before Engine Start',
            items: [
              { id: 0, subject: 'Passenger Briefing', operation: 'Complete' },
              { id: 1, subject: 'Seats & Seatbelts', operation: 'Secure' },
              { id: 2, subject: 'Circuit Breakers', operation: 'Check' },
              { id: 3, subject: 'Electrical Switches', operation: 'Verify Off'},
              { id: 4, subject: 'Avionics Master', operation: 'Verify Off'},
              { id: 5, subject: 'Fuel Selector', operation: 'Verify Both'},
              { id: 6, subject: 'Flight Controls', operation: 'Check'},
              { id: 7, subject: 'Brakes', operation: 'Check Pressure'}
            ]
          },
          {
            title: 'Taxi',
            items: [
              {id: 0, subject: 'Brakes', operation: 'Check Friction'},
              {id: 1, subject: 'Flight Instruments', operation: 'Check'},
              {id: 2, subject: 'Flight Controls', operation: 'Position for Wind'}
            ]
          }
        ]
      }
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
      this.checklistSet = {'title': 'foo', 'checklists': []}
      var csv_data = results.data
      var checklist_sets = [];

      var current_checklistset = '';
      var current_checklist = '';
      for (let i = 0; i < csv_data.length; i++) {
        if (csv_data[i][0] !== current_checklistset) {
          checklist_sets.push({title: csv_data[i][0], 'checklists': []});
          current_checklistset = csv_data[i][0];
        }
        if (csv_data[i][1] !== current_checklist) {
          checklist_sets.slice(-1)[0]['checklists'].push({title: csv_data[i][1], items: []})
          current_checklist = csv_data[i][1];
        }

        checklist_sets.slice(-1)[0]['checklists'].slice(-1)[0].items.push({subject: csv_data[i][2], operation: csv_data[i][3]});
      }

      console.log(checklist_sets[0])
      this.checklistSet = checklist_sets[0];
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
