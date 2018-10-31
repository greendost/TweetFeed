import * as React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import AddFeedInput from "../AddFeedInput";
import { Provider } from "react-redux";

describe("Test AddFeedInput", () => {
  // let store: any;

  // beforeEach(() => {
  //   store = configureStore()(initialState);
  // });

  it("test with no categories", () => {
    const initialState = {
      tfItems: [],
      mode: "DEFAULT",
      validateQueryFetch: { status: "NOT_LOADED" }
    };

    let store = configureStore()(initialState);

    const wrapper = shallow(
      <Provider store={store}>
        <AddFeedInput />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    expect(wrapper.find("#add-new-user").props().disabled).toBe(true);
    expect(wrapper.find("#add-new-user").props().placeholder).toEqual(
      "Please add a category"
    );
    expect(wrapper.find("button")).toBeUndefined;
  });

  it("test with one category", () => {
    const initialState = {
      tfItems: [
        { name: "Music", list: [{ query: "shakira" }, { query: "metallica" }] }
      ],
      mode: "ADD_FEEDS",
      validateQueryFetch: { status: "LOADED" }
    };

    let store = configureStore()(initialState);

    const wrapper = shallow(
      <Provider store={store}>
        <AddFeedInput />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    expect(wrapper.find("button").text()).toEqual("Done");
    expect(wrapper.find("select").children).toHaveLength(1);
    expect(
      wrapper
        .find("select")
        .childAt(0)
        .text()
    ).toEqual("Music");
    expect(wrapper.find("#add-new-user").props().disabled).toBeUndefined;
  });
});
