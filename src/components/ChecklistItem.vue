
<template>
  <li>
    <div class="checklist-item">
      {{ item.subject }}
      <span class="dots"></span>
      <span class="operation">{{ item.operation }}</span>
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
div.checklist-item {
  display: flex;
  align-items: center;
  clear: both;
  #line-height: 0.7em;
}

span.operation {
  text-transform: uppercase;
  padding-right: 1rem;
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
  color: #000; /* Set the color to match your design */
}
</style>

