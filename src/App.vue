<template>
  <div id="app-7">
    <checklist
        v-bind:title="beforeEngineStartChecklist.title"
        v-bind:items="beforeEngineStartChecklist.items"
    ></checklist>
  </div>
</template>

<script>
import Checklist from './components/Checklist.vue'

export default {
  name: 'App',
  components: {
    Checklist
  },
  data: function() {
    return {
      beforeEngineStartChecklist: {
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
      }
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
