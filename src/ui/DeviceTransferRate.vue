<template>
  <div class="transfer-rate" v-if="transferRate">{{ format(transferRate) }}/s</div>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

//@ts-ignore
import { format } from "sizeof";

@Component({
  components: {}
})
export default class DeviceTransferRate extends Vue {
  @Prop({ required: false, type: Number })
  public transferRate: number | undefined = undefined;

  public format = format;
}
</script>
<style lang="scss" scoped>
.transfer-rate {
  font-family: monospace;
}
</style>
