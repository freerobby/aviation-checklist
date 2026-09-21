<template>
  <li>
    <div class="checklist-item">
      {{ item.subject }}
      <span class="dots"></span>
      {{ item.operation }}
    </div>
    <div v-if="item.note" class="checklist-note">{{ item.note }}</div>
  </li>
</template>

<script>
export default {
  name: "ChecklistItem",
  props: ['item']
}
</script>

<style scoped>
div.checklist-item {
  display: flex;
  align-items: center;
  clear: both;
}

span.dots {
  flex: 1; /* Distribute available space equally */
  text-align: center;
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflowing dots */
}

span.dots::before {
  content: "..........................................................................................................."; /* Add as many dots as needed */
  letter-spacing: 2px; /* Adjust the spacing between dots */
  color: var(--dots-color); /* Set the color to match the active theme */
}
</style>
