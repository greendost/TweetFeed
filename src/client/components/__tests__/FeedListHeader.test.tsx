import * as React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import FeedListHeader from "../FeedListHeader";
import { Provider } from "react-redux";

import { IProps, IState } from "../FeedListHeader";

describe("Test FeedListHeader", () => {
  it("test expand and close state", () => {
    const initialState = {
      tfItems: []
    };

    let store = configureStore()(initialState);

    const wrapper = shallow(
      <Provider store={store}>
        <FeedListHeader />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    // hit plus on / off
    expect(wrapper.find("#newCategoryInput")).toBeUndefined;
    wrapper.find(".option--bigOneOnly").simulate("click");
    expect(wrapper.find("#newCategoryInput")).toBeDefined;
    expect((wrapper.instance().state as IState).isExpanded).toBe(true);

    wrapper.find(".option--bigOneOnly").simulate("click");
    expect(wrapper.find("#newCategoryInput")).toBeUndefined;
    expect((wrapper.instance().state as IState).isExpanded).toBe(false);

    // hit plus on, then done button
    wrapper.find(".option--bigOneOnly").simulate("click");
    expect(wrapper.find("#newCategoryInput")).toBeDefined;
    expect((wrapper.instance().state as IState).isExpanded).toBe(true);

    wrapper.find("button").simulate("click");
    expect(wrapper.find("#newCategoryInput")).toBeUndefined;
    expect((wrapper.instance().state as IState).isExpanded).toBe(false);
  });

  it("test adding category that exists", () => {
    const initialState = {
      tfItems: [
        { name: "Music", list: [{ query: "shakira" }, { query: "metallica" }] }
      ]
    };

    let store = configureStore()(initialState);
    const wrapper = shallow(
      <Provider store={store}>
        <FeedListHeader />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    wrapper.find(".option--bigOneOnly").simulate("click");
    // wrapper.instance().setState({ currentCategory: "Music" }); // works too
    wrapper
      .find("#newCategoryInput")
      .simulate("change", { target: { value: "Music" } });
    wrapper.find("#newCategoryInput").simulate("keyUp", { key: "Enter" });
    expect((wrapper.instance().state as IState).errorMsg).toEqual(
      "Music already exists"
    );
    expect((wrapper.instance().state as IState).currentCategory).toEqual("");
  });

  it("test enter on empty field", () => {
    const initialState = {
      tfItems: [
        { name: "Music", list: [{ query: "shakira" }, { query: "metallica" }] }
      ]
    };

    let store = configureStore()(initialState);
    const wrapper = shallow(
      <Provider store={store}>
        <FeedListHeader />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    wrapper.find(".option--bigOneOnly").simulate("click");
    expect(wrapper.find("#newCategoryInput").text()).toEqual("");
    wrapper.find("#newCategoryInput").simulate("keyUp", { key: "Enter" });
    expect(wrapper.find("#newCategoryInput").text()).toEqual("");
  });

  it("test adding category trim", () => {
    const initialState = {
      tfItems: [
        { name: "Music", list: [{ query: "shakira" }, { query: "metallica" }] }
      ]
    };

    let store = configureStore()(initialState);
    const wrapper = shallow(
      <Provider store={store}>
        <FeedListHeader />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    wrapper.setProps({
      addCategory: jest.fn(() => {
        console.log("addCategory has been mocked");
      })
    });
    var newCategory = "  Music Tech  ";
    wrapper.find(".option--bigOneOnly").simulate("click");
    wrapper
      .find("#newCategoryInput")
      .simulate("change", { target: { value: newCategory } });
    wrapper.find("#newCategoryInput").simulate("keyUp", { key: "Enter" });
    expect((wrapper.instance().state as IState).errorMsg).toEqual("");
    expect((wrapper.instance().state as IState).currentCategory).toEqual("");
    expect(
      ((wrapper.instance().props as IProps).addCategory as jest.Mock).mock.calls
        .length
    ).toBe(1);
    expect(
      ((wrapper.instance().props as IProps).addCategory as jest.Mock).mock
        .calls[0][0]
    ).toBe(newCategory.trim());
  });
});
