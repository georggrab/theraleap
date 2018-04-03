<template>
<section class="leap-graphical-log">
    <graphical-hand-logger :transparent="true"></graphical-hand-logger>
</section>
</template>
<script lang="ts">
import Vue from 'vue'
import { Inject, Component } from 'vue-property-decorator';

import GraphicalHandLogger from '@/ui/graphics/GraphicalHandLogger.vue';

/**
 * Displays a full screen Graphical Hand Logger, for debugging and
 * testing purposes.
 */
@Component({
  components: { GraphicalHandLogger }
})
export default class DeviceGraphicalLog extends Vue {
}
</script>
<style lang="scss" scoped>
section {
    // The available total height, sans header, sans 20px worth of margins.
    height: calc(100vh - 150px);
}
</style>
