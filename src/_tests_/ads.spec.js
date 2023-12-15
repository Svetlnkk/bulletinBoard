import { describe, expect, it } from "@jest/globals";
import HelloWorld from "../components/ads/HelloWorld"
import { shallowMount } from "@vue/test-utils";


describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "Hello, world!";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});