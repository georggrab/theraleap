<template>
  <div class="transfer-rate" v-if="deviceDataTransferRate">{{ format(deviceDataTransferRate) }}/s</div>
</template>
<script lang="ts">
import Vue from "Vue";
import { Inject, Component, Prop } from "vue-property-decorator";

//@ts-ignore
import { format } from "sizeof";

@Component({
  components: {}
})
export default class DeviceTransferRate extends Vue {
  @Prop({ required: true })
  public deviceDataTransferRate!: boolean;
  public format = format;
}
</script>
<style lang="scss">
.transfer-rate {
  font-family: monospace;
}
</style>
