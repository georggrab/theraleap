<template>
    <section v-show="OfflineOnly" id="OfflineIndicator">
        Offline Mode
    </section>
</template>
<script lang="ts">
import Vue from "Vue";
import { Inject, Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class OfflineIndicator extends Vue {}
</script>
