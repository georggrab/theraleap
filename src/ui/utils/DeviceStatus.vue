<template>
  <section id="deviceStatus">
    <div v-if="simulationRunning" class="simulated">
      <span>SIMULATED</span>
      <span @click="$emit('deactivateRecording', true)" class="md-accent clickable">(STOP)</span>
    </div>
    <div v-if="simulationRunning">
      <md-icon>mic
        <md-tooltip md-direction="top">Data is coming from a simulation.</md-tooltip>
      </md-icon>
    </div>
    <div v-else-if="connectionHealthy" class="device-status device-status--good">
      <md-icon>settings_remote
        <md-tooltip md-direction="top">Connected to Hardware Device.</md-tooltip>
      </md-icon>
    </div>
    <div v-else class="device-status device-status--bad">
      <md-icon>settings_remote
        <md-tooltip md-direction="top">No connection to Hardware Device. Check Status Tab.</md-tooltip>
      </md-icon>
      <md-progress-spinner class="md-accent" :md-stroke="2" :md-diameter="30" md-mode="indeterminate"></md-progress-spinner>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class DeviceStatus extends Vue {
  @Prop() public simulationRunning!: boolean;
  @Prop() public connectionHealthy!: boolean;
}
</script>
<style lang="scss">
.device-status {
  position: relative;
  margin-left: 20px;
}

.device-status--good {
  .md-progress-spinner {
    display: none;
  }
  .md-icon {
    padding-left: 4px;
  }
}

.device-status--bad {
  .md-progress-spinner {
    float: left;
  }
  .md-icon {
    left: 2px;
    top: 3px;
    position: absolute;
  }
}

.simulated {
  display: flex;
  align-items: baseline;
  font-family: monospace;
  margin-left: 10px;
  .clickable {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
