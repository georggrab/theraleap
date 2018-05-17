import { mount, shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import DeviceStatus from "./DeviceStatus.vue";
import Vue from "vue";

describe("DeviceStatus Vue", () => {
  it("should mount", () => {
    const wrapper = shallowMount(DeviceStatus);
  });
  it("should differ for different simu stati", () => {
    const sim = mount(DeviceStatus, {
      attachToDocument: true,
      propsData: {
        simulationRunning: true,
        connectionHealthy: false
      }
    });

    const noSim = mount(DeviceStatus, {
      attachToDocument: true,
      propsData: {
        simulationRunning: false,
        connectionHealthy: false
      }
    });
    expect(sim.text()).not.to.equal(noSim.text());
  });
  it("should differ for different conn stati", () => {
    const conn = shallowMount(DeviceStatus, {
      propsData: {
        simulationRunning: false,
        connectionHealthy: true
      }
    }).html();

    const noConn = shallowMount(DeviceStatus, {
      propsData: {
        simulationRunning: false,
        connectionHealthy: false
      }
    }).html();
    expect(conn).not.to.equal(noConn);
  });
  it("should emit stop event", () => {
    const conn = shallowMount(DeviceStatus, {
      propsData: {
        simulationRunning: true,
        connectionHealthy: true
      }
    });
    conn.find(".clickable").trigger("click");
    conn.find(".clickable").trigger("click");

    expect(conn.emitted().deactivateRecording).to.eql([[true], [true]]);
  });
});
