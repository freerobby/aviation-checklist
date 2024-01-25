<template>
  <div class="checklist-set">
    <h1
      v-bind:class="{emergency:(title === 'Emergency'), reference:(title === 'Reference')}"
    >
      {{title}}
    </h1>
    <checklist v-for="checklist in checklists" v-bind:title="checklist.title" v-bind:items="checklist.items" v-bind:key="checklist.id"></checklist>

    <div v-if="generated!==''" class="generated">{{ generated }}</div>
  </div>
</template>

<script>
import Checklist from "./Checklist.vue"
export default {
  name: "ChecklistSet",
  components: {Checklist},
  props: ["title", "checklists", "generated"]
}
</script>

<style scoped>
div {
  width: auto;
  overflow: hidden;
  background-color: #f5e7d3;
  position: relative;
}
div.checklist-set{
  border: 1px solid #000;
  float: left;
  #width: 198pt;
  width: 100%;
  #height: 756pt;
  #height: 50em;
  font-size: 100%;
  break-inside: avoid-column;

}
div.checklist-set h1 {
  margin: 0;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: #ecb100;
  text-align: center;
  color: #fff;
  font-size: 120%;
  text-transform: uppercase;
}
div.checklist-set h1.emergency {
  background-color: #ff371a;
}
div.checklist-set h1.reference {
  background-color: #4588ff;
}
div.checklist-set .generated {
  color: #515151;
  #font-size: 8pt;
  #position: absolute;
  text-align: right;
  bottom: 2px;
  right: 3px;
}
</style>
