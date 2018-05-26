<template>
    <section id="ClassifyBadge">
        <transition 
            v-on:after-enter="afterTransition"
            name="disappear-immediate">
            <md-icon v-if="classificationHappened">fingerprint</md-icon>
        </transition>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";
import * as device from "@/state/modules/device";

@Component({
  components: {}
})
export default class ClassifyBadge extends Vue {
  public classificationHappened = false;

  public afterTransition() {
    this.classificationHappened = false;
  }

  public mounted() {
    const stream = device
      .getDeviceFacade(this.$store)
      .getClassificationStream();
    if (stream) {
      stream.subscribe(classification => {
        this.classificationHappened = true;
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.disappear-immediate-enter {
  opacity: 1;
}
.disappear-immediate-enter-active {
  transition: opacity 0.5s;
}
.disappear-immediate-enter-to,
.disappear-immediate-leave,
.disappear-immediate-leave-to {
  opacity: 0;
}
</style>
