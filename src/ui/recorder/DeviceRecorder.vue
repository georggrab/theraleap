<template>
<section class="device-recorder">
    <md-empty-state v-if="totalRecordings == 0"
      md-icon="mic"
      md-label="Create your first recording"
      md-description="Create recordings of raw hand tracking data in order to develop and test games for the therapy platform without the physical need of a hand tracking device.">
    <md-button 
      @click="createNewEmptyRecording()"
      class="md-primary md-raised">Create first recording</md-button>
  </md-empty-state>
  <main v-else>
    <md-card v-for="id in Object.keys(recordings)" :key="id">
      <md-card-header class="header-flex-container">
        <section class="header-left">
          <div class="md-title">{{recordings[id].name}}</div>
          <div class="md-subhead">Created {{recordings[id].creationDate}}</div>
        </section>
        <section class="header-right">
          <md-switch 
            @input="setActivatedId(id)"
            :value="activatedId == id"
            :disabled="!recordings[id].created"></md-switch>
        </section>
      </md-card-header>
      <md-card-content v-if="recordings[id].created">
      </md-card-content> 
      <md-card-content v-else>
        <div class="container">
        <div class="form">
          <md-field>
            <label>Name</label>
            <md-input :value="recordings[id].name" @input="update(id, {name: $event})"></md-input>
          </md-field>
          <md-field>
            <label>Size</label>
            <md-input :value="recordings[id].size" readonly></md-input>
          </md-field>
          <md-field>
            <label>Duration</label>
            <md-input readonly :value="recordings[id].duration"></md-input>
          </md-field>
          <md-button :disabled="!connectionHealthy">Record</md-button>
          <md-button :disabled="!recordInProgress">Stop</md-button>
        </div>
        <div class="preview">
          <graphical-hand-logger :transparent="true">
          </graphical-hand-logger>
        </div>
      </div>
      </md-card-content>
      <md-card-actions>
        <md-button v-if="!recordings[id].created">Save</md-button>
        <md-button v-if="!recordings[id].created">Discard</md-button>
        <md-button v-if="recordings[id].created">Delete</md-button>
      </md-card-actions>
    </md-card>
  </main>
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

//@ts-ignore
import { format } from 'sizeof';

import { getRecordings, setActivatedId, getActivatedId, getTotalRecordings, updateRecording, addRecording, HandTrackRecording } from '@/state/modules/record';
import GraphicalHandLogger from '@/ui/graphics/GraphicalHandLogger.vue';
import { getConnectionHealthy } from 'state/modules/device';

/** Device Recorder
 *  Component that makes it possible to record data sent from the device,
 *  save it locally, and play it back in an infinite loop. This is a convenience
 *  component to make it easier to develop games for the frameworks without having
 *  the leap motion device attached and running permanently.
 */
@Component({
  components: { GraphicalHandLogger }
})
export default class DeviceRecorder extends Vue {
  public formatFileSize = format;
  public recordInProgress: boolean = false;

  public createNewEmptyRecording() {
    return addRecording(this.$store, {
      name: `Recording #${this.totalRecordings + 1}`,
      id: this.totalRecordings + 1,
      data: [],
      created: false,
      creationDate: Date.now(),
      size: 0,
      duration: 0
    });
  }

  public setActivated(id: number) { setActivatedId(this.$store, id) }

  public update(id: number, update: Partial<HandTrackRecording>) {
    updateRecording(this.$store, {id, update})
  }

  get recordings() { return getRecordings(this.$store); }
  get activatedId() { return getActivatedId(this.$store); }
  get totalRecordings() { return getTotalRecordings(this.$store); }
  get connectionHealthy() { return getConnectionHealthy(this.$store); }
}
</script>
<style lang="scss" scoped>
section.logger-display {
}

.header-flex-container {
  display: flex;
  .header-left {

  }
  .header-right {

  }
}

.container {
  display: flex;
  .form{
    flex: 2;
  }
  .preview {
    flex: 3;
    height: 250px;
    width: 450px;
  }
}
</style>
