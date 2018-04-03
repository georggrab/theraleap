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
            <md-input :value="recordings[id].size | formatSize" readonly></md-input>
          </md-field>
          <md-field>
            <label>Duration (milliseconds)</label>
            <md-input readonly :value="recordings[id].duration"></md-input>
          </md-field>
          <md-progress-bar md-mode="determinate" :md-value="bufferFullPercentage"></md-progress-bar>
          <md-button @click="startRecord(id)" 
            :disabled="!connectionHealthy || recordInProgress">Record</md-button>
          <md-button @click="stopRecord(id)" :disabled="!recordInProgress">Stop</md-button>
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
import { format, sizeof } from 'sizeof';

import { getRecordings, setActivatedId, getActivatedId, getTotalRecordings, updateRecording, addRecording, HandTrackRecording } from '@/state/modules/record';
import GraphicalHandLogger from '@/ui/graphics/GraphicalHandLogger.vue';
import { getConnectionHealthy, getDeviceFacade } from 'state/modules/device';
import { GenericHandTrackingData } from 'devices';
import { Subscription } from '@reactivex/rxjs/dist/package/Subscription';

/** Device Recorder
 *  Component that makes it possible to record data sent from the device,
 *  save it locally, and play it back in an infinite loop. This is a convenience
 *  component to make it easier to develop games for the frameworks without having
 *  the leap motion device attached and running permanently.
 */
@Component({
  components: { GraphicalHandLogger },
  filters: {
    formatSize: format
  }
})
export default class DeviceRecorder extends Vue {
  public formatFileSize = format;
  public recordInProgress: boolean = false;
  public bufferFullPercentage: number = 0;

  private buffer: {time: number, data: any}[] = [];
  private currentBufferSize: number = 0;
  private bufferMaxSize: number = 0.2e8;

  private deviceSubscription: Subscription | undefined;

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

  /**
   * Called by the Template when the Record Button is pressed
   * @argument id the Id for which to record
   */
  public startRecord(id: number) {
    this.recordInProgress = true;
    const data = this.deviceFacade.getHandTrackingData();
    if (data) {
      this.deviceSubscription = data.subscribe((frame) => {
        const newBufferSize = this.updateBuffer(frame, Date.now());
        this.update(id, { size: newBufferSize, duration: this.getBufferDuration() });
        if (newBufferSize > this.bufferMaxSize) {
          this.stopRecord(id);
        }
      });
    }
  }

  private updateBuffer(frame: GenericHandTrackingData, recordedTime: number): number {
    this.currentBufferSize += sizeof(frame.data);
    this.bufferFullPercentage = this.currentBufferSize / this.bufferMaxSize * 100;
    this.buffer.push({data: frame.data, time: recordedTime});
    return this.currentBufferSize;
  }

  private getBufferDuration(): number | undefined {
    if (this.buffer && this.buffer.length >= 2) {
      return this.buffer[this.buffer.length - 1].time - this.buffer[0].time;
    } else {
      return undefined;
    }
  }

  /**
   * Called by the Template when the Stop Button is pressed
   * @argument id the Id for which to stop recording
   */
  public stopRecord(id: number) {
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
    this.recordInProgress = false;
  }

  public setActivated(id: number) { setActivatedId(this.$store, id) }

  public update(id: number, update: Partial<HandTrackRecording>) {
    updateRecording(this.$store, {id, update})
  }

  get recordings() { return getRecordings(this.$store); }
  get activatedId() { return getActivatedId(this.$store); }
  get totalRecordings() { return getTotalRecordings(this.$store); }
  get connectionHealthy() { return getConnectionHealthy(this.$store); }
  get deviceFacade() { return getDeviceFacade(this.$store); }
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
