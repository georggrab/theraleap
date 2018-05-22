import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import { expect } from "chai";
import sinon from "sinon";
import { Subject } from "rxjs";

import ClassifyBadge from "./ClassifyBadge.vue";

import { RootState } from "@/state/store";

import { device } from "@/state/modules/device";
import { debug } from "@/state/modules/debug";
import { record } from "@/state/modules/record";
import { persist } from "@/state/modules/persistor";
import { classifier } from "@/state/modules/classifiers";
import { preprocessors } from "@/state/modules/preprocessors";
import { BehaviorSubject } from "rxjs";
import { ClassificationData } from "@/classify";
import { DeviceFacade } from "@/devices";
import { AllPurposeRecordingFacade } from "@/devices/allpurposefacade";
import { ThreadedLeap2Driver } from "@/devices/threadedleap2/threadedleap2driver";
import { LeapDriver } from "@/devices/leapmotion";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ClassifyBadge", () => {
  let mock: sinon.SinonMock;
  let subj = new Subject();

  beforeEach(() => {});

  it("should shallow mount", () => {
    sinon
      .stub(AllPurposeRecordingFacade.prototype, "getClassificationStream")
      .callsFake(() => {
        return subj;
      });
    const wrapper = mount(ClassifyBadge, {
      localVue,
      mocks: {
        $store: {
          getters: {
            "device/getDeviceFacade": new AllPurposeRecordingFacade(
              new LeapDriver({})
            )
          }
        }
      }
    });
  });
});
