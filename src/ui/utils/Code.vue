<template>
  <span class="source">
      <slot>Code</slot>
  </span>
</template>
<script lang="ts">
import Vue from "Vue";
import { Inject, Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Code extends Vue {}
</script>
<style lang="scss">
/* Stolen from how Stackoverflow formats Code Blocks */
.source {
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  overflow: auto;
  width: auto;
  padding: 3px;
  margin-right: 2px;
  background-color: #eee;
  max-height: 600px;
}
</style>
