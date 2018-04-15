<template>
<section class="device-recorder">
  <div v-if="restoreInProgress">
    <span>Restoring data from persistence layer...</span>
    <md-progress-bar md-mode="indeterminate"></md-progress-bar>
  </div>
  <md-empty-state v-if="totalRecordings == 0"
      md-icon="mic"
      md-label="Create your first recording"
      md-description="Create recordings of raw hand tracking data in order to develop and test games for the therapy platform without the physical need of a hand tracking device.">
    <md-button 
      @click="createNewEmptyRecording"
      class="md-primary md-raised">Create first recording</md-button>
  </md-empty-state>
  <main v-else>
    <md-button 
      :disabled="recordInCreation" 
      @click="createNewEmptyRecording" class="md-icon-button md-primary">
      <md-icon>add</md-icon>
    </md-button>
    <md-card v-for="record of recordingsSortedDescending" :key="record.id" md-with-hover>
      <md-card-header class="header-flex-container">
        <section class="header-left">
          <div class="md-title">{{record.name}}</div>
          <div class="md-subhead">Created {{record.creationDate}}</div>
        </section>
        <section class="header-right">
          <md-switch 
            @change="toggleActivated(record.id)"
            :model="activatedId == record.id"
            :disabled="!record.created"></md-switch>
        </section>
      </md-card-header>
      <md-card-content v-if="record.created">
      </md-card-content> 
      <md-card-content v-else>
        <div class="container">
        <div class="form">
          <md-field>
            <label>Name</label>
            <md-input :value="record.name" @input="update(record.id, {name: $event})"></md-input>
          </md-field>
          <md-field>
            <label>Size</label>
            <md-input :value="record.size | formatSize" readonly></md-input>
          </md-field>
          <md-field>
            <label>Duration (milliseconds)</label>
            <md-input readonly :value="record.duration"></md-input>
          </md-field>
          <md-progress-bar md-mode="determinate" :md-value="bufferFullPercentage"></md-progress-bar>
          <md-button @click="startRecord(record.id)" 
            :disabled="!connectionHealthy || recordInProgress">Record</md-button>
          <md-button @click="stopRecord" :disabled="!recordInProgress">Stop</md-button>
        </div>
        <div class="preview">
          <graphical-hand-logger :source="deviceTrackingData" :transparent="true">
          </graphical-hand-logger>
        </div>
      </div>
      </md-card-content>
      <md-card-actions>
        <md-button 
          @click="saveRecord(record.id)" 
          :disabled="buffer.length === 0"
          v-if="!record.created"
          class="md-raised md-primary">Save</md-button>
        <md-button @click="discardRecord(record.id)" v-if="!record.created"
          class="md-accent md-raised">Discard</md-button>
        <md-button @click="downloadRecord(record.id)" v-if="record.created"
          >Download</md-button>
        <md-button @click="discardRecord(record.id)" v-if="record.created"
          class="md-accent">Delete</md-button>
      </md-card-actions>
    </md-card>
  </main>
  <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showRestore" md-persistent>
    <span>The Persistence Provider is holding {{ persistedRecordings }} recordings.</span>
    <md-button class="md-primary md-raised" @click="restoreRecordings">Restore</md-button>
    <md-button class="md-raised" @click="showRestore = false">Dismiss</md-button>
  </md-snackbar>
</section>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

//@ts-ignore
import { format, sizeof } from "sizeof";

import {
  getRecordingsSortedDescending,
  getRecordings,
  setActivatedId,
  getActivatedId,
  getTotalRecordings,
  updateRecording,
  addRecording,
  HandTrackRecording,
  deleteRecording,
  Record,
  hasRecordInCreation
} from "@/state/modules/record";
import GraphicalHandLogger from "@/ui/graphics/GraphicalHandLogger.vue";
import { getConnectionHealthy, getDeviceFacade } from "state/modules/device";
import { GenericHandTrackingData } from "devices";
import { Subscription } from "rxjs";
import { getPersistor } from "state/modules/persistor";

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
  public recordInProgress: boolean = false;
  public bufferFullPercentage: number = 0;
  public showRestore: boolean = false;
  public persistedRecordings: number = 0;
  public restoreInProgress: boolean = false;

  private buffer: Record[] = [];
  private currentBufferSize: number = 0;
  private bufferMaxSize: number = 0.2e8;

  private deviceSubscription: Subscription | undefined;

  public createNewEmptyRecording() {
    this.clearLocalState();
    return addRecording(this.$store, {
      recording: {
        name: `Recording #${this.totalRecordings + 1}`,
        id: this.totalRecordings + 1,
        recording: [],
        created: false,
        creationDate: Date.now(),
        size: 0,
        duration: 0
      },
      persistor: this.persistor
    });
  }

  public async created() {
    if (this.persistor && this.totalRecordings === 0) {
      const count = await this.persistor.count();
      if (count > 0) {
        this.persistedRecordings = count;
        this.showRestore = true;
      }
    }
  }

  public async restoreRecordings() {
    if (this.persistor) {
      this.restoreInProgress = true;
      const recordings = await this.persistor.getAll();
      recordings.forEach(recording => {
        addRecording(this.$store, { recording, persistor: undefined })
      });
      this.restoreInProgress = false;
      this.showRestore = false;
    }
  }

  /**
   * Called by the Template when the Record Button is pressed
   * @argument id the Id for which to record
   */
  public startRecord(id: number) {
    this.recordInProgress = true;
    if (this.deviceTrackingData) {
      this.deviceSubscription = this.deviceTrackingData.subscribe(frame => {
        const newBufferSize = this.updateBuffer(frame, Date.now());
        this.update(id, {
          size: newBufferSize,
          duration: this.getBufferDuration()
        });
        if (newBufferSize > this.bufferMaxSize) {
          this.stopRecord();
        }
      });
    }
  }

  public downloadRecord(id: number) {
    const obj = this.recordings[id]
    const data = new Blob([JSON.stringify(obj)], {type: 'octet/stream'});
    const url = URL.createObjectURL(data);
    const anchor = document.createElement('a');
    anchor.download = `thera-rec--${obj.name.replace(/\s/g, '-')}.json`;
    anchor.href = url;
    anchor.target = '_blank';
    anchor.setAttribute('display', 'none;');
    document.body.appendChild(anchor);
    anchor.click();
  }

  private clearLocalState() {
    this.buffer = [];
    this.currentBufferSize = 0;
    this.bufferFullPercentage = 0;
  }

  private updateBuffer(
    frame: GenericHandTrackingData,
    recordedTime: number
  ): number {
    this.currentBufferSize += sizeof(frame.data);
    this.bufferFullPercentage =
      this.currentBufferSize / this.bufferMaxSize * 100;
    this.buffer.push({ data: { data: frame.data }, time: recordedTime });
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
   */
  public stopRecord() {
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
    this.recordInProgress = false;
  }

  /**
   * Called by the Template when the Save Button is pressed
   * @argument id the Id for which to save
   */
  public saveRecord(id: number) {
    this.stopRecord();
    updateRecording(this.$store, {
      id,
      update: { created: true, recording: this.buffer },
      persistor: this.persistor
    });
    this.clearLocalState();
  }

  /**
   * Called by the Template when the Discard Button is pressed
   * @argument id the Id for which to discard
   */
  public discardRecord(id: number) {
    this.stopRecord();
    this.clearLocalState();
    deleteRecording(this.$store, { id, persistor: this.persistor });
  }

  public toggleActivated(id: number) {
    this.activatedId == id
      ? setActivatedId(this.$store, -1)
      : setActivatedId(this.$store, id);
  }

  public update(id: number, update: Partial<HandTrackRecording>) {
    updateRecording(this.$store, { id, update });
  }

  get persistor() {
    return getPersistor(this.$store);
  }
  get recordings() {
    return getRecordings(this.$store);
  }
  get recordingsSortedDescending() {
    return getRecordingsSortedDescending(this.$store);
  }
  get recordInCreation() {
    return hasRecordInCreation(this.$store);
  }
  get activatedId() {
    return getActivatedId(this.$store);
  }
  get totalRecordings() {
    return getTotalRecordings(this.$store);
  }
  get connectionHealthy() {
    return getConnectionHealthy(this.$store);
  }
  get deviceFacade() {
    return getDeviceFacade(this.$store);
  }
  get deviceTrackingData() {
    return this.deviceFacade.getDeviceTrackingData();
  }
}
</script>
<style lang="scss" scoped>
.md-card {
  margin-bottom: 20px;
  max-width: 800px;
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
  .form {
    flex: 2;
  }
  .preview {
    flex: 3;
    height: 250px;
    width: 450px;
  }
}
</style>
