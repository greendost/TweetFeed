import * as React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import FeedList from "../FeedList";
import { Provider } from "react-redux";

import { IProps, IState } from "../FeedList";

describe("Test FeedList", () => {
  let backup_getElementById: any;

  beforeAll(() => {
    backup_getElementById = document.getElementById;
  });

  beforeEach(() => {
    document.getElementById = jest.fn(x => {
      if (x === "loginKey") {
        return {
          innerHTML: "test"
        };
      } else if (x === "updateCategoryInput") {
        return document.querySelector("#updateCategoryInput");
      } else {
        console.log("error: unexpected input to document.getElementById");
      }
    });
  });
  afterEach(() => {
    document.getElementById = backup_getElementById;
  });

  it("test category options - turn on", () => {
    const initialState = {
      tfItems: [
        { name: "Music", list: [{ query: "shakira" }, { query: "metallica" }] }
      ],
      selectedTFItem: []
    };

    let store = configureStore()(initialState);

    const wrapper = shallow(
      <Provider store={store}>
        <FeedList />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    expect((wrapper.instance().state as IState).categoryIndexBeingEdited!).toBe(
      null
    );
    expect(wrapper.find(".option[data-categoryindex=0]").length).toBe(1);
    expect(wrapper.find(".option[data-categoryindex=0]").text()).toEqual(
      "options"
    );

    wrapper
      .find(".option[data-categoryindex=0]")
      .simulate("click", { target: { dataset: { categoryindex: 0 } } });
    expect(
      (wrapper.instance().state as IState).categoryIndexBeingEdited!.index
    ).toBe(0);
  });

  it("test category options - delete", () => {
    const initialState = {
      tfItems: [
        { name: "Music", list: [{ query: "shakira" }, { query: "metallica" }] }
      ],
      selectedTFItem: []
    };

    let store = configureStore()(initialState);

    const wrapper = shallow(
      <Provider store={store}>
        <FeedList />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();

    wrapper.setProps({
      deleteCategory: jest.fn(() => {
        console.log("deleteCategory has been mocked");
      })
    });
    wrapper
      .find(".option[data-categoryindex=0]")
      .simulate("click", { target: { dataset: { categoryindex: 0 } } });
    expect(
      (wrapper.instance().state as IState).categoryIndexBeingEdited!.index
    ).toBe(0);
    expect(wrapper.find('[data-type="category-delete"]').length).toBe(1);
    wrapper.find('[data-type="category-delete"]').simulate("click");
    expect(
      ((wrapper.instance().props as IProps).deleteCategory as jest.Mock).mock
        .calls.length
    ).toBe(1);
    expect((wrapper.instance().state as IState).categoryIndexBeingEdited!).toBe(
      null
    );
    expect(
      ((wrapper.instance().props as IProps).deleteCategory as jest.Mock).mock
        .calls[0][0]
    ).toBe(0);
  });
});
