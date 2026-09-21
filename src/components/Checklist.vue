<template>
  <div class="checklist">
    <h2> {{ title }}</h2>
    <div
      v-for="(annotation, index) in annotations"
      v-bind:key="index"
      v-bind:class="annotation.kind === 'warning' ? 'checklist-warning' : 'checklist-note'"
    >{{ annotation.text }}</div>
    <ul>
      <checklist-item v-for="item in items" v-bind:item="item" v-bind:key="item.id"></checklist-item>
    </ul>
  </div>
</template>

<script>
import ChecklistItem from "./ChecklistItem.vue";

export default {
  name: "Checklist",
  components: {ChecklistItem},
  props: ["title", "items", "annotations"]
}
</script>

<style scoped>
div.checklist {
  overflow: hidden;
  margin-bottom: 12px;
  padding-left: 4px;
  padding-right: 4px;
}
div h2 {
  float: left;
  display: block;
  width: 100%;
  margin: 0;
  text-align: left;
}
ul {
  margin: 0;
  padding-left: 0;
  width: 100%;
}
ul li {
  list-style-type:none;
  width: 100%;
}
</style>
