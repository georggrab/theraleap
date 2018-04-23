<template>
    <md-tabs class="md-primary" md-sync-route>
        <md-tab id="tab-home" md-label="Visual Measurement" to="/measurement/display"></md-tab>
    </md-tabs>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  components: {}
})
export default class HandMeasurementTabs extends Vue {}
</script>
<style lang="scss">
</style>

