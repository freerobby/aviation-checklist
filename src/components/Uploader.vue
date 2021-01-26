<template>
  <div>
    <p><strong>Select CSV</strong></p>
    <button v-on:click="onSelectCSV">Select a CSV</button>
  <input
      type="file"
      style="display: none;"
      ref="fileInput"
      accept="text/csv"
      v-on:change="onCSVSelected"/>
  </div>
</template>

<script>
export default {
  name: "Uploader",
  methods: {
    onSelectCSV: function() {
      this.$refs.fileInput.click();
    },
    onCSVSelected: function(event) {
      const csv_data = event.target.files[0]
      this.$emit("csv_loaded", csv_data);
    }
  }
}
</script>

<style scoped>
@media screen {
  div {
    float: left;
    display: block;
    width: 33%;
  }
}
@media print {
  div {
    display: none;
  }
}
</style>
