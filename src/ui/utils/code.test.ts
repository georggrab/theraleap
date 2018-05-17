import { mount, shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import Code from "./Code.vue";

describe("code vue component", () => {
  it("should shallow mount", () => {
    const wrapper = shallowMount(Code);
  });

  it("should have inserted text inside DOM", () => {
    const wrapper = shallowMount(Code, {
      slots: {
        default: "Content"
      }
    });
    expect(wrapper.html()).to.contain("Content");
  });
});
