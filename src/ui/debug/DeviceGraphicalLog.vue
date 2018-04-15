<template>
<section class="leap-graphical-log">
    <div id="bad-connection-warning" v-show="!hasSalvagableStream">No connection to the Device. Check the Status Tab!</div>
    <graphical-hand-logger :source="trackingData" :transparent="true"></graphical-hand-logger>
</section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component } from "vue-property-decorator";

import GraphicalHandLogger from "@/ui/graphics/GraphicalHandLogger.vue";
import * as device from "@/state/modules/device";
import { hasSalvagableStream } from "@/state/utils";

/**
 * Displays a full screen Graphical Hand Logger, for debugging and
 * testing purposes.
 */
@Component({
  components: { GraphicalHandLogger }
})
export default class DeviceGraphicalLog extends Vue {
  private trackingData = device
    .getDeviceFacade(this.$store)
    .getHandTrackingData(this.$store);

  get hasSalvagableStream(): boolean | undefined {
    return hasSalvagableStream(this.$store);
  }

}
</script>
<style lang="scss" scoped>
section {
  // The available total height, sans header, sans 20px worth of margins.
  height: calc(100vh - 150px);
}

#bad-connection-warning {
  position: absolute;
  margin: 20px;
  font-family: monospace;
  color: white;
  background-color: black;
}

</style>
