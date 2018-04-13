<template>
<router-view></router-view>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

/** DeviceRecorderRoot
 *  Functional Component representing the /recorder route.
 */
@Component({
  components: {}
})
export default class DeviceRecorderRoot extends Vue {}
</script>
