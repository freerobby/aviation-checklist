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
  background-color: var(--card-bg);
  color: var(--card-text);
  position: relative;
}
div.checklist-set{
  border: var(--card-border-width, 1px) solid var(--card-border);
  float: left;
  width: 198pt;
  height: 756pt;
}
div.checklist-set h1 {
  margin: 0;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: var(--header-bg);
  text-align: center;
  color: var(--header-text);
}
div.checklist-set h1.emergency {
  background-color: var(--emergency-header-bg);
}
div.checklist-set h1.reference {
  background-color: var(--reference-header-bg);
}
div.checklist-set .generated {
  color: var(--generated-text);
  font-size: 8pt;
  position: absolute;
  bottom: 2px;
  right: 3px;
}
</style>
