<template>
<section class="device-recorder">
    <md-empty-state
      md-icon="mic"
      md-label="Create your first recording"
      md-description="Create recordings of raw hand tracking data in order to develop and test games for the therapy platform without the physical need of a hand tracking device.">
    <md-button class="md-primary md-raised">Create first recording</md-button>
  </md-empty-state>
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

/** Device Recorder
 *  Component that makes it possible to record data sent from the device,
 *  save it locally, and play it back in an infinite loop. This is a convenience
 *  component to make it easier to develop games for the frameworks without having
 *  the leap motion device attached and running permanently.
 */
@Component({
  components: { }
})
export default class DeviceRecorder extends Vue {
}
</script>