<template>
    <md-card>
    <md-card-header>
        <div class="md-title">In-Game Controls</div>
        <div class="md-subhead">These Controls work for every game.</div>
    </md-card-header>
    <md-card-content>
        <ul class="controls-list">
        <li>
            <span class="function">
                <md-icon>pause</md-icon>Pause:
            </span>
            <span class="divider">
            </span>
            <span class="key">Space</span></li>
        <li>
            <span class="function"><md-icon>exit_to_app</md-icon>Quit:</span>
            <span class="divider"></span>
            <span class="key">Esc</span>
        </li>
        </ul>
    </md-card-content>
    </md-card>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class InGameControls extends Vue {}
</script>
<style lang="scss">
.controls-list {
  width: 220px;
  li {
    display: flex;
    .divider {
      flex: 1;
    }
    .key {
      font-weight: bold;
      width: 100px;
    }
  }
  list-style-type: none;
}
</style>
