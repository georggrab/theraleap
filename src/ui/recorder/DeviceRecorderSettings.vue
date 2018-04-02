<template>
<section class="device-recorder-settings">
  Device Recorder Settings
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

/** Device Recorder Settings
 *  Manages Settings (primarily on/off) for the Device Recorder.
 *  Displays debug Information, like space used / available
 */
@Component({
  components: { }
})
export default class DeviceRecorderSettings extends Vue {
}
</script>