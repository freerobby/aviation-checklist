<template>
  <li>
    <div class="subject">
      {{ item.subject }}
    </div>
    <div class="operation">
      {{ item.operation}}
    </div>
  </li>
</template>

<script>
export default {
  name: "ChecklistItem",
  props: ['item']
}
</script>

<style scoped>
div.subject {
  float: left;
  height: auto;
  display: block;
  clear: both;
}
div.operation {
  float: right;
}
</style>