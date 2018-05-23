<template>
    <section id="GameLoadingSpinner">
        <h1 v-if="gameName">{{ gameName }}</h1>
        <p>Now Loading, hang tight...</p>
        <md-progress-spinner class="md-accent" :md-diameter="30" md-mode="indeterminate"></md-progress-spinner>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class GameLoadingSpinner extends Vue {
  @Prop({ type: String, required: false })
  public gameName: string | undefined;
}
</script>
<style lang="scss" scoped>
section {
  margin: 50px;
  position: absolute;
  background-color: #ffffff55;
}
</style>
