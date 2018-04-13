<template>
  <pre>{{JSON.stringify(handtrackingData.data, null, 2)}}</pre>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Observable } from "@reactivex/rxjs";

import {
  DeviceConnectionState,
  InitialDeviceState,
  GenericHandTrackingData
} from "@/devices";

@Component
export default class RawDeviceDataPlotter extends Vue {
  @Prop() public handtrackingData!: GenericHandTrackingData;
}
</script>
