<template>
    <md-tabs class="md-primary" md-sync-route>
        <md-tab id="tab-home" md-label="Recorder" to="/recorder/main"></md-tab>
        <md-tab id="tab-pages" md-label="Settings" to="/recorder/settings"></md-tab>
    </md-tabs>
</template>
<script lang="ts">
import Vue from 'vue'
import { Inject, Component } from 'vue-property-decorator';

@Component({
  components: { }
})
export default class DeviceRecorderTabs extends Vue {

}
</script>
<style lang="scss">
</style>
