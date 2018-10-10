import * as actions from "../actions/actionTypes";
import { combineReducers, Reducer } from "redux";
import { IAction, ICategory } from "../actions";
import { DELETE_TF_ITEM } from "../actions/actionTypes";

export interface IReduxState {
  tfItems: ICategory[];
  selectedTFItem: [] | [number, number];
  tweetListFetch: {
    status: string; // TODO: make enum
    msg: string;
    result: any[];
  };
  mode: string;
}

const initialState: IReduxState = {
  tfItems: [{ name: "Category 1", list: [] }],
  selectedTFItem: [],
  tweetListFetch: {
    status: "NOT_LOADED",
    msg: "",
    result: []
  },
  mode: "DEFAULT"
  // openTFCategories: [],
};

function tfItems(state = initialState.tfItems, action: IAction) {
  switch (action.type) {
    case actions.ADD_TF_ITEM:
      var { categoryIndex, tfItem } = action.payload;
      var updatedList = state.map((category, index) => {
        return categoryIndex === index
          ? Object.assign({}, category, { list: [...category.list, tfItem] })
          : category;
      });
      return updatedList;
    case actions.ADD_CATEGORY:
      return [...state, action.payload];
    case actions.UPDATE_CATEGORY:
      var categoryIndex = action.payload.categoryIndex;
      var categoryName = action.payload.categoryName;

      return state.map(
        (category, index) =>
          categoryIndex === index
            ? Object.assign({}, category, { name: categoryName })
            : category
      );
    default:
      return state;
  }
}

function selectedTFItem(state = initialState.selectedTFItem, action: IAction) {
  switch (action.type) {
    case actions.SELECT_TF_ITEM:
      return action.payload;
    default:
      return state;
  }
}

function tweetListFetch(state = initialState.tweetListFetch, action: IAction) {
  switch (action.type) {
    case actions.FETCH_TWEETS_REQUEST:
      return Object.assign({}, state, {
        status: "LOADING",
        msg: "",
        result: []
      });
    case actions.FETCH_TWEETS_SUCCESS:
      return Object.assign({}, state, {
        status: "LOADED",
        msg: "",
        result: action.payload.tweetList
      });
    case actions.FETCH_TWEETS_FAILURE:
      return Object.assign({}, state, {
        status: "ERROR",
        msg: action.payload.msg,
        result: []
      });
    case actions.FETCH_TWEETS_REINIT:
      return initialState.tweetListFetch;
    default:
      return state;
  }
}

function mode(state = "DEFAULT", action: IAction) {
  switch (action.type) {
    case actions.CHANGE_MODE:
      return action.payload;
    default:
      return state;
  }
}

// full state
function deleteCategoryReducer(state = initialState, action: IAction) {
  var categoryIndex = action.payload;
  var newSelectedTFItem = state.selectedTFItem;
  var newTFItems = state.tfItems;
  var newTweetListFetch = state.tweetListFetch;

  newTFItems = state.tfItems.filter(
    (category, index) => categoryIndex !== index
  );

  // if anything selected, take care of possibly updating selected item
  if (state.selectedTFItem.length) {
    if (categoryIndex < state.selectedTFItem[0]) {
      newSelectedTFItem = [
        state.selectedTFItem[0] - 1,
        state.selectedTFItem[1]
      ];
    } else if (categoryIndex == state.selectedTFItem[0]) {
      newSelectedTFItem = initialState.selectedTFItem;
      newTweetListFetch = initialState.tweetListFetch;
    }
  }

  return Object.assign({}, state, {
    tfItems: newTFItems,
    selectedTFItem: newSelectedTFItem,
    tweetListFetch: newTweetListFetch
  });
}

function deleteTFItemReducer(state = initialState, action: IAction) {
  var [categoryIndex, tfIndex] = action.payload;
  var newSelectedTFItem = state.selectedTFItem;
  var newTweetListFetch = state.tweetListFetch;

  var newTFItems = state.tfItems.map((category, index) => {
    return index === categoryIndex
      ? Object.assign({}, category, {
          list: [
            ...category.list.slice(0, tfIndex),
            ...category.list.slice(tfIndex + 1)
          ]
        })
      : category;
  });

  // if anything selected, take care of possibly updating selected item
  if (state.selectedTFItem.length) {
    if (categoryIndex === state.selectedTFItem[0]) {
      if (tfIndex < state.selectedTFItem[1]) {
        newSelectedTFItem = [
          state.selectedTFItem[0],
          state.selectedTFItem[1] - 1
        ];
      } else if (tfIndex === state.selectedTFItem[1]) {
        newSelectedTFItem = initialState.selectedTFItem;
        newTweetListFetch = initialState.tweetListFetch;
      }
    }
  }

  return Object.assign({}, state, {
    tfItems: newTFItems,
    selectedTFItem: newSelectedTFItem,
    tweetListFetch: newTweetListFetch
  });
}

// reducers with access to full state
var flexList = {
  DELETE_CATEGORY: deleteCategoryReducer,
  DELETE_TF_ITEM: deleteTFItemReducer
};

export default (function flexCombineReducers(flexList: any, cr: any): Reducer {
  return function rootReducer(state, action) {
    if (flexList[action.type]) {
      return flexList[action.type](state, action);
    } else {
      return cr(state, action);
    }
  };
})(
  flexList,
  combineReducers({
    tfItems,
    selectedTFItem,
    tweetListFetch,
    mode
  })
);

// export default combineReducers({
//   tfItems,
//   selectedTFItem,
//   tweetListFetch,
//   mode
// });
