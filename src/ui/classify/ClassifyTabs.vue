<template>
    <md-tabs class="md-primary" md-sync-route>
        <md-tab md-label="Available Classifiers" to="/classify/classifiers"></md-tab>
        <md-tab md-label="Settings" to="/classify/settings"></md-tab>
    </md-tabs>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component } from "vue-property-decorator";

@Component({
  components: {}
})
export default class ClassifyTabs extends Vue {}
</script>
<style lang="scss">
</style>
