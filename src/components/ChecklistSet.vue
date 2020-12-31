<template>
  <div>
    <h1> {{title}} </h1>
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

</style>
