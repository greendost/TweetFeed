import AppRequest from "../util/AppRequest";
import * as actions from "../actions/actionTypes";

// types
// thunkAction type: R return value, S Redux state, E extra param, A action
import { ThunkAction } from "redux-thunk";
import { IReduxState } from "../reducers";
import { IErrorCodeOrNull } from "../util/xhrutil";

export interface IAction {
  type: string;
  payload: any;
}

export interface ICategory {
  name: string;
  list: ITFItem[];
}

export interface ITFItem {
  query: string;
}

// action creators
export function addTFItem(
  categoryIndex: number,
  tfItem: ITFItem
): ThunkAction<void, IReduxState, undefined, IAction> {
  return (dispatch, getState) => {
    // var tfItems = getState().tfItems;
    var query = tfItem.query;

    // update selected item
    // provide immediate feedback - e.g. validating disabled placeholder
    dispatch({
      type: actions.VALIDATE_QUERY_REQUEST,
      payload: ""
    });

    // and do network fetch
    AppRequest.post(
      "/app/adduser",
      (err: IErrorCodeOrNull, data: any) => {
        var result = JSON.parse(data);
        if (!err) {
          dispatch({
            type: actions.VALIDATE_QUERY_SUCCESS,
            payload: {
              msg: "Success",
              result: { categoryIndex, tfItem },
              msgTs: 0
            }
          });
        } else {
          // error
          dispatch({
            type: actions.VALIDATE_QUERY_FAILURE,
            payload: {
              msg: result.error
                ? result.error.errorMsg
                : "Unable to validate query",
              msgTs: Date.now()
            }
          });
          return;
        }
      },
      {
        postData: JSON.stringify({
          screen_name: query
        })
      }
    );
  };
}

// ----

export function importTFItems(tfItems: IReduxState["tfItems"]) {
  return {
    type: actions.IMPORT_TF_ITEMS,
    payload: tfItems
  };
}

// function requestTweets(url) {
//   return {
//     type: actions.FETCH_TWEETS_REQUEST,
//     payload: {
//       query
//     }
//   };
// }

function unselectTFItem(): ThunkAction<void, IReduxState, undefined, IAction> {
  return (dispatch, getState) => {
    dispatch({
      type: actions.FETCH_TWEETS_REINIT,
      payload: ""
    });

    // unselect, making use of payload
    dispatch({
      type: actions.SELECT_TF_ITEM,
      payload: []
    });
  };
}

export function selectTFItem(
  categoryIndex: number,
  tfIndex: number
): ThunkAction<void, IReduxState, undefined, IAction> {
  return (dispatch, getState) => {
    var tfItems = getState().tfItems;

    // update selected item
    dispatch({
      type: actions.SELECT_TF_ITEM,
      payload: [categoryIndex, tfIndex]
    });

    // and do network fetch
    AppRequest.get(
      "tweet/get/tweetlist",
      (err: IErrorCodeOrNull, data: any) => {
        var result = JSON.parse(data);
        if (!err) {
          dispatch({
            type: actions.FETCH_TWEETS_SUCCESS,
            payload: {
              msg: "Success",
              tweetList: result.data
            }
          });
        } else {
          dispatch({
            type: actions.FETCH_TWEETS_FAILURE,
            payload: {
              msg: result.error
                ? result.error.errorMsg
                : "Unable to fetch tweets"
            }
          });
        }
      },
      {
        params: {
          screenname: tfItems[categoryIndex].list[tfIndex].query,
          tweet_mode: "extended"
        }
      }
    );
  };
}

export function deleteTFItem(categoryIndex: number, tfIndex: number) {
  return {
    type: actions.DELETE_TF_ITEM,
    payload: [categoryIndex, tfIndex]
  };
}

export function beginAddingFeeds() {
  return {
    type: actions.CHANGE_MODE,
    payload: "ADD_FEEDS"
  };
}

export function finishAddingFeeds() {
  return {
    type: actions.CHANGE_MODE,
    payload: "DEFAULT"
  };
}

export function addCategory(categoryName: string) {
  return {
    type: actions.ADD_CATEGORY,
    payload: { name: categoryName, list: [] }
  };
}

export function deleteCategory(categoryIndex: number) {
  return {
    type: actions.DELETE_CATEGORY,
    payload: categoryIndex
  };
}

export function updateCategory(categoryIndex: number, categoryName: string) {
  return {
    type: actions.UPDATE_CATEGORY,
    payload: { categoryIndex, categoryName }
  };
}
