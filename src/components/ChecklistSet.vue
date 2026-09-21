<template>
  <div class="checklist-set" v-bind:class="{ 'layout-page': layout === 'page', overflows: overflows }">
    <h1
      v-bind:class="{emergency:(title === 'Emergency'), reference:(title === 'Reference')}"
    >
      {{title}}
    </h1>
    <div v-if="overflows" class="overflow-warning">Section does not fit — split it into two sections</div>
    <div class="checklist-body" ref="body">
      <checklist
        v-for="checklist in checklists"
        v-bind:title="checklist.title"
        v-bind:items="checklist.items"
        v-bind:note="checklist.note"
        v-bind:key="checklist.id"
      ></checklist>
    </div>
    <div v-if="footerNote" class="checklist-note footer-note">{{ footerNote }}</div>
    <div v-if="generated!==''" class="generated">{{ generated }}</div>
  </div>
</template>

<script>
import Checklist from "./Checklist.vue"
export default {
  name: "ChecklistSet",
  components: {Checklist},
  props: ["title", "checklists", "generated", "footerNote", "layout", "pageSize"],
  data: function() {
    return { overflows: false };
  },
  watch: {
    pageSize: function() {
      this.checkOverflow();
    }
  },
  mounted: function() {
    this.checkOverflow();
  },
  updated: function() {
    this.checkOverflow();
  },
  methods: {
    checkOverflow: function() {
      var handle = this;
      this.$nextTick(function() {
        var body = handle.$refs.body;
        if (!body) {
          handle.overflows = false;
          return;
        }
        handle.overflows = body.scrollHeight > body.clientHeight + 1;
      });
    }
  }
}
</script>

<style scoped>
div {
  width: auto;
  overflow: hidden;
  background-color: var(--card-bg);
  color: var(--card-text);
  position: relative;
}
div.checklist-set{
  border: var(--card-border-width, 1px) solid var(--card-border);
  float: left;
  width: var(--card-width, 198pt);
  height: var(--card-height, 756pt);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
div.checklist-set.layout-page {
  float: none;
  margin-bottom: 16px;
}
div.checklist-set.overflows {
  outline: 2px dashed #c62828;
  outline-offset: -2px;
}
div.checklist-set h1 {
  margin: 0;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: var(--header-bg);
  text-align: center;
  color: var(--header-text);
  flex: 0 0 auto;
}
div.checklist-set h1.emergency {
  background-color: var(--emergency-header-bg);
}
div.checklist-set h1.reference {
  background-color: var(--reference-header-bg);
}
div.checklist-body {
  flex: 1 1 auto;
  overflow: hidden;
  min-height: 0;
}
div.footer-note {
  flex: 0 0 auto;
  padding-bottom: 14px;
}
div.overflow-warning {
  position: absolute;
  top: 22px;
  left: 0;
  right: 0;
  background-color: #c62828;
  color: #ffffff;
  font-size: 9pt;
  text-align: center;
  padding: 2px 4px;
  z-index: 2;
}
div.checklist-set .generated {
  color: var(--generated-text);
  font-size: 8pt;
  position: absolute;
  bottom: 2px;
  right: 3px;
}
@media print {
  div.overflow-warning {
    display: none;
  }
  div.checklist-set.overflows {
    outline: none;
  }
  div.checklist-set.layout-page {
    float: none;
    margin-bottom: 0;
    page-break-after: always;
    break-after: page;
    break-inside: avoid;
  }
}
</style>
