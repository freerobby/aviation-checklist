<template>
  <div id="download">
    <p><strong>Download</strong></p>
    <ul>
      <li>
        <a href="#" v-on:click="$emit('download_dynon')">Dynon</a>
      </li>
      <li>Use print dialog to print or save to PDF (3 sections per page).</li>
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
  div#download {
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