<template>
  <pre>{{JSON.stringify(currentFrame, null, 2)}}</pre>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator';
import { Observable } from '@reactivex/rxjs';

import { DeviceConnectionState, InitialDeviceState, HandTrackingData } from '@/devices';

@Component
export default class RawDeviceDataPlotter extends Vue {
    @Prop()
    public handtrackingData: Observable<HandTrackingData> | undefined;
    private currentFrame: HandTrackingData = {};

    public created() {
      if (this.handtrackingData) {
        this.handtrackingData.subscribe((data: any) => {
          this.currentFrame = data.data
          });
      }
    }
}
</script>