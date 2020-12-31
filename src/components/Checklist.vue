<template>
  <div>
    <h2> {{ title }}</h2>
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
  props: ["title", "items"]
}
</script>

<style scoped>

</style>