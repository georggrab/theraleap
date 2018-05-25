import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import { Subject } from "rxjs";
import { BehaviorSubject } from "rxjs";
import sinon from "sinon";
import Vuex, { Store } from "vuex";

import ClassifyBadge from "./ClassifyBadge.vue";

import { RootState } from "@/state/store";

import { ClassificationData } from "@/classify";
import { DeviceFacade } from "@/devices";
import { AllPurposeRecordingFacade } from "@/devices/allpurposefacade";
import { LeapDriver } from "@/devices/leapmotion";
import { ThreadedLeap2Driver } from "@/devices/threadedleap2/threadedleap2driver";
import { classifier } from "@/state/modules/classifiers";
import { debug } from "@/state/modules/debug";
import { device } from "@/state/modules/device";
import { persist } from "@/state/modules/persistor";
import { preprocessors } from "@/state/modules/preprocessors";
import { record } from "@/state/modules/record";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ClassifyBadge", () => {
  let mock: sinon.SinonMock;
  const subj = new Subject();

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
