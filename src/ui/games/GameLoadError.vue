<template>
    <section id="GameLoadError">
        <md-icon class="md-size-5x">error</md-icon>
        <h1>That's an Error.</h1>
        <p>{{ reason }}</p>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class GameLoadError extends Vue {
  @Prop({ type: String, required: false })
  public reason: string | undefined;
}
</script>
<style lang="scss" scoped>
#GameLoadError {
  margin: 50px;
  display: flex;
  flex-direction: column;
  h1 {
    text-align: center;
  }
  p {
    text-align: center;
  }
}
</style>
