<template>
    <section class="pre-processing">
    <div class="cancelmargin">
        <transition name="slide">
            <section v-if="showIntro">
                <div class="intro">
                    <div class="header">
                        <h1><md-icon class="white-icon spin md-size-2x">memory</md-icon>Data Preprocessing Configuration</h1>
                        <span @click="showIntro = false"><md-icon class="white-icon">clear</md-icon></span>
                    </div>
                    <div class="content">
                        Toggle and configure various data preprocessing routines here. All Data Preprocessing is done right after the data is sent from the device, and immediately before the Device Data is fed into the Classification Engine. The main goal of the Preprocessing Routines is to provide the Classification Routines with less data that is not useful for their operation, and thus increase classification performance.
                    </div>
                </div>
            </section>
        </transition>
    </div>
    <md-card>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title"><md-icon>content_cut</md-icon>Naive Throttler</div>
          <div class="md-subhead">Drop every nth Frame from the Hand Tracking Device</div>
        </md-card-header-text>
          <div class="enabled">
              <md-switch v-model="preprocessors.naiveThrottler.enabled"
                class="md-accent">Enable</md-switch>
          </div>
      </md-card-header>

      <md-card-content>
          Take only every nth Frame from the Hand Tracking Device. 
          Useful for initially reducing Framerate or for deploying the software on very weak hardware. 
          Naive in the sense that it does not look at the data. 
          It will throw away potentially valuable information!
          Configure this Preprocessor with a whole Integer <span class="source">n</span> (as in,
          take every <span class="source">n</span>th frame). <br />
          Choosing criteria: <span class="source">modulus(index<sub>frame</sub>, n) = 0</span>
      </md-card-content>

      <md-card-actions md-alignment="left">
        <md-field>
          <label>n</label>
          <md-input v-model="preprocessors.naiveThrottler.n" type="number"></md-input>
          <span class="md-helper-text">Take every nth frame</span>
        </md-field>
      </md-card-actions>
      <div class="type">
          <span>GENERIC</span>
      </div>
    </md-card>
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import { DropNFramesPreProcessor } from '@/processing/generic/dropnframes'

@Component({
  components: {}
})
export default class PreProcessing extends Vue {
    public showIntro = false;
    public preprocessors = {
        naiveThrottler: {
            enabled: false,
            n: 0,
            construct: () => {
                new DropNFramesPreProcessor(this.preprocessors.naiveThrottler.n)
            }
        }
    }

    public mounted() {
        this.showIntro = true;
    }
}
</script>
<style lang="scss">
.md-card {
    max-width: 700px;
    margin-top: 20px;
}
.md-card-header-text {}
.source {
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  overflow: auto;
  width: auto;
  padding: 3px;
  margin-right: 2px;
  background-color: #eee;
  max-height: 600px;
}
.type {
    display:flex;
    flex-direction: row-reverse;
    span {
        padding: 10px;
        font-weight: 200;
        user-select: none;
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: all .75s ease-in-out;
    overflow: hidden;
}

.slide-enter-to, .slide-leave {
    max-height: 300px;
}

.slide-leave-to, .slide-enter {
    max-height: 0px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
        color:white;
    }
    50% {
        color: #00897b;
    }
    100% {
        transform: rotate(360deg);
        color:white;
    }
}

.intro {
    background-color: #212121;
    color: white;
    padding: 20px;
    .header {
        .spin {
            animation: 3s ease-in-out 0s infinite spin;
        }
        .white-icon {
            color: white;
            margin-right: 5px;
        }
        span {
            align-self: center;
        }
        display: flex;
        justify-content: space-between;
    }
    .content {
        padding-left: 20px;
        padding-right: 20px;
        max-width: 500px;
    }
}


.cancelmargin {
    margin-top: -16px;
    margin-left: -16px;
    margin-right: -16px;
}

</style>