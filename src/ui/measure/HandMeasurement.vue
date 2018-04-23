<template>
   <section class="hand-measurement">
       <graphical-hand-logger class="logger" :source="trackingData" :handConfig="measureHandConfig" />
       <section class="measurements">
       </section>
   </section> 
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import * as device from "@/state/modules/device";
import GraphicalHandLogger from '@/ui/graphics/GraphicalHandLogger.vue';
import { HandConfig } from '@/ui/graphics/types';

@Component({
  components: {
      GraphicalHandLogger
  }
})
export default class HandMeasurement extends Vue {
  public measureHandConfig: Partial<HandConfig> = {
      mainColor: 0xff0000,
      drawWireFrame: false,
  }  

  private trackingData = device
    .getDeviceFacade(this.$store)
    .getHandTrackingData(this.$store);
}
</script>

<style lang="scss">
.hand-measurement {
    display: flex;
    height: calc(100vh - 150px);
    .logger {
        flex: 1;
    }
    .measurements {
        flex: 1;
    }
}
</style>
