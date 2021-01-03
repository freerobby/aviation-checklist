<template>
  <div class="checklist-set">
    <h1
      v-bind:class="{emergency:(title === 'Emergency'), reference:(title === 'Reference')}"
      v-on:click="$emit('generate_lines')">
      {{title}}
    </h1>
    <checklist v-for="checklist in checklists" v-bind:title="checklist.title" v-bind:items="checklist.items" v-bind:key="checklist.id"></checklist>
  </div>
</template>

<script>
import Checklist from "./Checklist.vue"
export default {
  name: "ChecklistSet",
  components: {Checklist},
  props: ["title", "checklists"]
}
</script>

<style scoped>
div {
  width: auto;
  overflow: hidden;
  background-color: #f5e7d3;
}
div.checklist-set{
  border: 1px solid #000;
  float: left;
  width: 198pt;
  height: 756pt;
}
div.checklist-set h1 {
  margin: 0;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: #ecb100;
  text-align: center;
  color: #fff;
}
div.checklist-set h1.emergency {
  background-color: #ff371a;
}
div.checklist-set h1.reference {
  background-color: #4588ff;
}
</style>
