<template>
    <md-tabs class="md-primary" md-sync-route>
        <md-tab id="tab-home" md-label="Raw Device Logger" to="/debug/devicelog"></md-tab>
        <md-tab id="tab-pages" md-label="Hand Logger" to="/debug/hand"></md-tab>
        <md-tab id="tab-posts" md-label="Status" to="/debug/status"></md-tab>
    </md-tabs>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component } from "vue-property-decorator";

@Component({
  components: {}
})
export default class DeviceDebugTabs extends Vue {}
</script>
<style lang="scss">
</style>
