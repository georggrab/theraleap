<template>
    <md-tabs class="md-primary" md-sync-route>
        <md-tab md-label="Pre-processing" to="/data-processing/preprocessing"></md-tab>
    </md-tabs>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  components: {}
})
export default class ProcessingTabs extends Vue {}
</script>