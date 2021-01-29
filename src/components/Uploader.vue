<template>
  <div id="upload">
    <p><strong>Import your own checklist</strong></p>
    <div class="file_container"
         v-on:drop.prevent="replaceFile"
         v-on:dragover.prevent
    >
      <p>Drag your CSV here.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Uploader",
  methods: {
    replaceFile: function(event) {
      let csv_file = event.dataTransfer.files[0];
      this.$emit("csv_loaded", csv_file);
    }
  }
}
</script>

<style scoped>
@media screen {
  div#upload {
    float: left;
    display: block;
    width: 33%;
  }
  div#upload .file_container {
    width: 90%;
    height: 200px;
    border: 2px dotted gray;
  }
  div#upload .file_container {
    text-align: center;
  }
}
@media print {
  div {
    display: none;
  }
}
</style>
