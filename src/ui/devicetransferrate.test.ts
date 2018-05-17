import { mount, shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import DeviceTransferRate from "./DeviceTransferRate.vue";

describe("DeviceTransferRate", () => {
  it("should shallow mount", () => {
    const wrapper = shallowMount(DeviceTransferRate);
  });
  it("should display format transfer rate", () => {
    const wrapper = shallowMount(DeviceTransferRate, {
      propsData: {
        deviceDataTransferRate: 4096
      }
    });
    expect(wrapper.text()).to.contain("4.000K/s");
  });
});
