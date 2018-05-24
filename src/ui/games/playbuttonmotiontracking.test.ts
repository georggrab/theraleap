import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import { expect } from "chai";
import PlayButtonMotionTracking from "./PlayButtonMotionTracking.vue";
import Vuex from "vuex";

// @ts-ignore
import VueMaterial from "vue-material";
import sinon from "sinon";

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
