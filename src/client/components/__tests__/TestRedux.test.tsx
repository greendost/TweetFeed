import { initialState } from "../../reducers";
import reducer from "../../reducers";
import * as actions from "../../actions/actionTypes";
import {
  addTFItem,
  deleteTFItem,
  addCategory,
  deleteCategory,
  updateCategory,
  selectTFItem
} from "../../actions";
import configureStore from "redux-mock-store";
import thunkMiddleware, { ThunkDispatch } from "redux-thunk";
// import thunk from "redux-thunk";

import { createStore, applyMiddleware, compose } from "redux";
import { IAction } from "../../actions";
import { IReduxState } from "../../reducers";

// type applyMiddleware = function<Ext1, S>(middleware1: Middleware<Ext1, S, any>): StoreEnhancer<{dispatch: Ext1}>;

describe("test redux reducers ", () => {
  let backup_XMLHttpRequest: any;
  let backup_getElementById: any;

  beforeAll(() => {
    console.log("beforeAll");
    backup_XMLHttpRequest = (window as any).XMLHttpRequest;
    backup_getElementById = document.getElementById;
  });

  afterEach(() => {
    (window as any).XMLHttpRequest = backup_XMLHttpRequest;
    document.getElementById = backup_getElementById;
  });

  let setupMock = (responseText: any) => {
    const mockXHR: any = {
      open: jest.fn(),
      send: jest.fn(() => mockXHR.onreadystatechange()),
      setRequestHeader: jest.fn(),
      readyState: 4,
      status: 200
    };
    mockXHR.responseText = JSON.stringify(responseText);
    (window as any).XMLHttpRequest = jest.fn(() => mockXHR);
    // mock login key function that I use
    document.getElementById = jest.fn(() => {
      return {
        innerHTML: "test"
      };
    });
  };

  // begin tests
  it("test add tf item reducer", () => {
    var updatedState = reducer(initialState, {
      type: actions.VALIDATE_QUERY_SUCCESS,
      payload: { result: { categoryIndex: 0, tfItem: { query: "shakira" } } }
    });
    expect(updatedState.tfItems[0].list.length).toEqual(1);
  });

  it("integration test - add and delete item to default category", () => {
    // setup store for real
    let store = createStore(
      reducer,
      applyMiddleware<ThunkDispatch<IReduxState, any, IAction>>(thunkMiddleware)
    );

    // data for action and response
    var categoryIndex = 0;
    var query = "shakira";
    var responseText = { error: "" };

    setupMock(responseText);

    // fire action
    store.dispatch(addTFItem(categoryIndex, { query }));

    // verify state
    var updatedState = store.getState();
    expect(updatedState.tfItems[0].list.length).toEqual(1);

    // now verify delete
    store.dispatch(deleteTFItem(0, 0));

    updatedState = store.getState();
    expect(updatedState.tfItems[0].list.length).toEqual(0);
  });

  it("integration test - add, rename, and delete category", () => {
    // setup store for real
    let store = createStore(
      reducer,
      applyMiddleware<ThunkDispatch<IReduxState, any, IAction>>(thunkMiddleware)
    );

    // data for action and response
    var category = "Tech";
    // var query = "shakira";
    var responseText = { error: "" };

    setupMock(responseText);

    // fire action - add category - and verify state
    store.dispatch(addCategory(category));
    var updatedState = store.getState();
    expect(updatedState.tfItems.length).toEqual(2);
    expect(updatedState.tfItems[1].name).toEqual(category);
    expect(updatedState.tfItems[1].list.length).toEqual(0);

    // fire action - rename (update) category - and verify
    var newCategory = "React";
    store.dispatch(updateCategory(1, newCategory));
    var updatedState = store.getState();
    expect(updatedState.tfItems.length).toEqual(2);
    expect(updatedState.tfItems[1].name).toEqual(newCategory);
    expect(updatedState.tfItems[1].list.length).toEqual(0);

    // now verify delete
    store.dispatch(deleteCategory(1));
    updatedState = store.getState();
    expect(updatedState.tfItems.length).toEqual(1);
  });

  it("integration test - select item", () => {
    // setup store for real
    let store = createStore(
      reducer,
      applyMiddleware<ThunkDispatch<IReduxState, any, IAction>>(thunkMiddleware)
    );

    // data for action and response
    var categoryIndex = 0;
    var query = "shakira";
    var responseText: any = { error: "" };

    setupMock(responseText);

    // add item and verify
    store.dispatch(addTFItem(categoryIndex, { query }));
    var updatedState = store.getState();
    expect(updatedState.tfItems[0].list.length).toEqual(1);

    // now verify select
    responseText = {
      error: "",
      data: [
        {
          text: "tweet 1",
          created_at: "1",
          entities: { urls: [] },
          id_str: "1"
        },
        {
          text: "tweet 2",
          created_at: "2",
          entities: { urls: [] },
          id_str: "2"
        }
      ]
    };
    setupMock(responseText);

    store.dispatch(selectTFItem(0, 0));
    updatedState = store.getState();
    expect(updatedState.tweetListFetch.result.length).toEqual(2);
  });
});
