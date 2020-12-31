<template>
  <li>
    {{ item.subject }} ... {{ item.operation }}
  </li>
</template>

<script>
export default {
  name: "ChecklistItem",
  props: ['item']
}
</script>

<style scoped>

</style>