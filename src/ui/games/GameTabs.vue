<template>
    <md-tabs class="md-primary" md-sync-route>
        <md-tab md-label="Game List" to="/games/list"></md-tab>
        <md-tab md-label="Settings" to="/games/settings"></md-tab>
    </md-tabs>
</template>
<script lang="ts">
import Vue from "vue";
import { Inject, Component } from "vue-property-decorator";

@Component({
  components: {}
})
export default class GameTabs extends Vue {}
</script>
