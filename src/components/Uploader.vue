<template>
  <div id="upload">
    <p><strong>Import your own checklist</strong></p>
    <div class="file_container"
         v-on:drop.prevent="importFile"
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
    importFile: function(event) {
      let csv_file = event.dataTransfer.files[0];
      var reader = new FileReader();
      reader.readAsText(csv_file, "UTF-8");
      reader.onload = readerEvent => {
        var content = readerEvent.target.result;
        this.$emit("csv_imported", content);
      }
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
