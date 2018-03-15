<template>
    <md-tabs class="md-primary">
        <md-tab id="tab-home" md-label="Raw Device Logger"></md-tab>
        <md-tab id="tab-pages" md-label="Hand Logger"></md-tab>
        <md-tab id="tab-posts" md-label="Status"></md-tab>
    </md-tabs>
</template>
<script lang="ts">
import Vue from 'vue'
import { Inject, Component } from 'vue-property-decorator';

@Component({
  components: { }
})
export default class LeapDebugTabs extends Vue {

}
</script>
<style lang="scss">
</style>
