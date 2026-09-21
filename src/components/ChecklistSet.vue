<template>
  <div class="checklist-set" v-bind:class="{ 'layout-page': layout === 'page', 'crop-guides': cropGuides, overflows: overflows }">
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
        v-bind:annotations="checklist.annotations"
        v-bind:key="checklist.id"
      ></checklist>
    </div>
    <div v-if="annotations && annotations.length" class="card-annotations">
      <div
        v-for="(annotation, index) in annotations"
        v-bind:key="index"
        v-bind:class="annotation.kind === 'warning' ? 'checklist-warning' : 'checklist-note'"
      >{{ annotation.text }}</div>
    </div>
    <div v-if="generated!==''" class="generated">{{ generated }}</div>
  </div>
</template>

<script>
import Checklist from "./Checklist.vue"
export default {
  name: "ChecklistSet",
  components: {Checklist},
  props: ["title", "checklists", "generated", "annotations", "layout", "pageSize", "cropGuides"],
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
  padding: var(--card-padding, 0);
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
div.card-annotations {
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
  div.checklist-set.crop-guides {
    overflow: visible;
  }
  div.checklist-set.crop-guides::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: -3.75in;
    left: 100%;
    border-left: 1px dashed #666666;
  }
  div.checklist-set.crop-guides::after {
    content: "";
    position: absolute;
    left: 0;
    right: -4.25in;
    top: 100%;
    border-top: 1px dashed #666666;
  }
}
</style>
