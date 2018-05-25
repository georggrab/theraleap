import { mount, shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import Vue from "vue";
import DeviceStatus from "./DeviceStatus.vue";

describe("DeviceStatus Vue", () => {
  it("should mount", () => {
    const wrapper = shallowMount(DeviceStatus);
  });
  it("should differ for different simu stati", () => {
    const sim = mount(DeviceStatus, {
      attachToDocument: true,
      propsData: {
        connectionHealthy: false,
        simulationRunning: true
      }
    });

    const noSim = mount(DeviceStatus, {
      attachToDocument: true,
      propsData: {
        connectionHealthy: false,
        simulationRunning: false
      }
    });
    expect(sim.text()).not.to.equal(noSim.text());
  });
  it("should differ for different conn stati", () => {
    const conn = shallowMount(DeviceStatus, {
      propsData: {
        connectionHealthy: true,
        simulationRunning: false
      }
    }).html();

    const noConn = shallowMount(DeviceStatus, {
      propsData: {
        connectionHealthy: false,
        simulationRunning: false
      }
    }).html();
    expect(conn).not.to.equal(noConn);
  });
  it("should emit stop event", () => {
    const conn = shallowMount(DeviceStatus, {
      propsData: {
        connectionHealthy: true,
        simulationRunning: true
      }
    });
    conn.find(".clickable").trigger("click");
    conn.find(".clickable").trigger("click");

    expect(conn.emitted().deactivateRecording).to.eql([[true], [true]]);
  });
});
