import * as React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import TweetHeader from "../TweetHeader";
import { Provider } from "react-redux";

describe("Test TweetHeader", () => {
  // let store: any;

  // beforeEach(() => {
  //   store = configureStore()(initialState);
  // });

  it("test with selected feed", () => {
    const initialState = {
      selectedTFItem: [0, 1],
      tfItems: [{ list: [{ query: "shakira" }, { query: "metallica" }] }]
    };

    let store = configureStore()(initialState);

    const wrapper = shallow(
      <Provider store={store}>
        <TweetHeader />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    expect(wrapper.find("h1")).toHaveLength(1);
    expect(wrapper.find("h1").text()).toEqual("metallica");
  });

  it("test with selected feed", () => {
    const initialState = {
      selectedTFItem: [],
      tfItems: [{ list: [{ query: "shakira" }, { query: "metallica" }] }]
    };

    let store = configureStore()(initialState);

    const wrapper = shallow(
      <Provider store={store}>
        <TweetHeader />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    expect(wrapper.find("h1")).toHaveLength(1);
    expect(wrapper.find("h1").text()).toEqual("");
  });
});
