<template>
<section class="device-recorder-settings">
  <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">Device Recorder</div>
        </md-card-header>
        <md-card-content>
          <md-subheader>Persistence</md-subheader>
          <md-divider></md-divider>
          <md-checkbox v-model="persist">Persist Recordings</md-checkbox>
          <md-subheader>Actions</md-subheader>
          <md-divider></md-divider>
          <md-button 
            @click="deleteAllRecordings"
            class="md-raised md-accent">Delete all Recordings</md-button>
        </md-card-content>
      </md-card>
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

import * as record from '@/state/modules/record';

/** Device Recorder Settings
 *  Manages Settings (primarily on/off) for the Device Recorder.
 *  Displays debug Information, like space used / available
 */
@Component({
  components: { }
})
export default class DeviceRecorderSettings extends Vue {
  public deleteAllRecordings() {
    record.clearRecordings(this.$store);
  }
  set persist(value: boolean) {
    record.setPersist(this.$store, value);
  }
  get persist() {
    return record.getPersist(this.$store);
  }
}
</script>