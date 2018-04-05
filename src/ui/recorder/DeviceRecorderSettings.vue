<template>
<section class="device-recorder-settings">
  <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">Device Recorder</div>
        </md-card-header>
        <md-card-content>
          <md-subheader>Persistence</md-subheader>
          <md-divider></md-divider>
          <div class="small-info">Persistence Provider: <span>{{ persistenceProviderName }}</span></div>
          <md-checkbox class="md-primary" 
            :disabled="persistor === undefined"
            v-model="persist">Persist Recordings</md-checkbox>
          <md-subheader>Actions</md-subheader>
          <md-divider></md-divider>
          <md-button 
            @click="deleteAllRecordings"
            class="md-raised md-accent md-dense">Delete all Recordings</md-button>
        </md-card-content>
      </md-card>
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

import * as record from '@/state/modules/record';
import * as persistor from '@/state/modules/persistor';

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
  get persistor() {
    return persistor.getPersistor(this.$store);
  }
  get persistenceProviderName() {
    return this.persistor !== undefined? this.persistor.getName() : "not available";
  }
}
</script>
<style lang="scss" scoped>
.small-info {
  font-weight: 100;
  span {
    font-weight: 300;
  }
}
</style>
