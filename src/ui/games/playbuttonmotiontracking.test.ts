import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import Vuex from "vuex";
import PlayButtonMotionTracking from "./PlayButtonMotionTracking.vue";

// @ts-ignore
import sinon from "sinon";
import VueMaterial from "vue-material";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMaterial);

describe("PlayButtonMotionTracking", () => {
  it("should not be clickable without active recording and device", () => {
    const wrapper = mount(PlayButtonMotionTracking, {
      localVue,
      mocks: {
        $store: {
          getters: {
            "record/getActiveRecording": undefined,
            "classifier/getActiveClassifier": {},
            "device/isConnectionHealthy": false
          }
        }
      }
    });
    expect(wrapper.find(".md-button").attributes().disabled).to.eql("disabled");
  });
  it("should be clickable with active recording but without device", () => {
    const wrapper = mount(PlayButtonMotionTracking, {
      localVue,
      mocks: {
        $store: {
          getters: {
            "record/getActiveRecording": {},
            "classifier/getActiveClassifier": {},
            "device/isConnectionHealthy": false
          }
        }
      }
    });
    expect(wrapper.find(".md-button").attributes().disabled).to.eql(undefined);
  });
  it("should be clickable without active recording but with device", () => {
    const wrapper = mount(PlayButtonMotionTracking, {
      localVue,
      mocks: {
        $store: {
          getters: {
            "record/getActiveRecording": undefined,
            "classifier/getActiveClassifier": {},
            "device/isConnectionHealthy": true
          }
        }
      }
    });
    expect(wrapper.find(".md-button").attributes().disabled).to.eql(undefined);
  });
});
