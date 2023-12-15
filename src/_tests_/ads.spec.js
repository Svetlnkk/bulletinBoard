import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import Ad from "../components/ads/Ad";
import Registration from "../components/authentification/Registration";
import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import Vuex from 'vuex';
import Vuetify from "vuetify";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Vuetify);

describe("Authentification", () => {
  let vuetify;
  const store = new Vuex.Store({
    getters: {
      "shared/loadingButtonBoolean": () => false,
    },
    actions: {
      "user/registerUser": jest.fn(),
    },
  });
  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("renders without errors", () => {
    const wrapper = mount(Registration, {
      vuetify,
      store,
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });
})

describe("Ad", () => {
  let wrapper;
  let store;
  const adMock = {
    id: "1",
    title: "Sample Ad",
    imageSrc:
      "https://img.razrisyika.ru/kart/46/181925-yabloko-kartinka-dlya-detey-37.jpg",
    description:
      "This is a sample ad.This is a sample ad.This is a sample ad.This is a sample ad.This is a sample ad.",
    price: 100,
    dateAdded: "6.12.2023 22:40",
    ownerId: "RNceUJt5nXSKWjwSv7nfeZJVxCP2",
  };
  const currentUserMock = {
    id: "RNceUJt5nXSKWjwSv7nfeZJVxCP2",
    name: "John Doe",
  };

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        ad: adMock,
        currentUser: currentUserMock,
      },
    });
    wrapper = shallowMount(Ad, {
      propsData: {
        id: "1",
      },
      computed: {
        ad: () => adMock,
        isOwner: () => true,
        currentUser: () => currentUserMock,
      },
      store,
      localVue,
    });
  });

  it("displays the ad title", () => {
    const title = wrapper.find(".ad-main__title");
    expect(title.text()).toBe(adMock.title);
  });

  it("displays the ad price", () => {
    const price = wrapper.find(".text--secondary");
    expect(price.text()).toBe(adMock.price.toString());
  });

  it("displays the ad description", () => {
    const description = wrapper.find(".ad-main__description");
    expect(description.text()).toBe(adMock.description);
  });

  it("displays the ad date added", () => {
    const dateAdded = wrapper.find(".date");
    expect(dateAdded.text()).toBe(adMock.dateAdded);
  });

});