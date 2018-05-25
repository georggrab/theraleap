<template>
    <md-button 
        @click="$emit('click')"
        class="md-raised md-primary"><md-icon>play_arrow</md-icon>{{ name === undefined ? 'Play' : name }}
    </md-button>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class PlayButton extends Vue {
  @Prop({ required: false, type: String })
  public name: string | undefined;
}
</script>
<style lang="scss" scoped>
.md-button {
  margin: 0 5px;
}
</style>
