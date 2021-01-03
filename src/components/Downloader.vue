<template>
  <div>
    <p>Download for:</p>
    <ul>
      <li v-on:click="$emit('download_dynon')">
        <button>Dynon</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Downloader"
}
</script>

<style scoped>
@media screen {
  div {
    float: left;
    display: block;
  }
}
@media print {
  div {
    display: none;
  }
}
</style>