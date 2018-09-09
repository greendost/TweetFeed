import AppRequest from '../util/AppRequest';
import * as actions from '../actions/actionTypes';

// action creators
export function addTFItem(categoryIndex, tfItem) {
  return {
    type: actions.ADD_TF_ITEM,
    payload: {
      categoryIndex,
      tfItem
    }
  };
}

function requestTweets(url) {
  return {
    type: actions.FETCH_TWEETS_REQUEST,
    payload: {
      query
    }
  };
}

function unselectTFItem() {
  return (dispatch, getState) => {
    dispatch({
      type: actions.FETCH_TWEETS_REINIT,
      payload: ''
    });

    dispatch({
      type: actions.SELECT_TF_ITEM,
      payload: []
    });
  };
}

export function selectTFItem(categoryIndex, tfIndex) {
  return (dispatch, getState) => {
    var tfItems = getState().tfItems;
    var selectedTFItem = getState().selectedTFItem;
    var query = tfItems[categoryIndex].list[tfIndex].query;

    // update selected item
    dispatch({
      type: actions.SELECT_TF_ITEM,
      payload: [categoryIndex, tfIndex]
    });

    // and do network fetch
    AppRequest.get(
      'tweet/get/tweetlist',
      (err, data) => {
        var result = JSON.parse(data);
        if (!err) {
          dispatch({
            type: actions.FETCH_TWEETS_SUCCESS,
            payload: {
              msg: 'Success',
              tweetList: result.data
            }
          });
        } else {
          dispatch({
            type: actions.FETCH_TWEETS_FAILURE,
            payload: {
              msg: result.error
                ? result.error.errorMsg
                : 'Unable to fetch tweets'
            }
          });
        }
      },
      {
        params: {
          screenname: tfItems[categoryIndex].list[tfIndex].query
        }
      }
    );
  };
}

export function deleteTFItem(categoryIndex, tfIndex) {
  return (dispatch, getState) => {
    const state = getState();
    if (
      state.selectedTFItem[0] === categoryIndex &&
      state.selectedTFItem[1] === tfIndex
    ) {
      dispatch(unselectTFItem());
    }

    dispatch({
      type: actions.DELETE_TF_ITEM,
      payload: [categoryIndex, tfIndex]
    });
  };
}

export function beginAddingFeeds() {
  return {
    type: actions.CHANGE_MODE,
    payload: 'ADD_FEEDS'
  };
}

export function finishAddingFeeds() {
  return {
    type: actions.CHANGE_MODE,
    payload: 'DEFAULT'
  };
}

export function addCategory(categoryName) {
  return {
    type: actions.ADD_CATEGORY,
    payload: { name: categoryName, list: [] }
  };
}

export function deleteCategory(categoryIndex) {
  console.log(`action creator: deleteCategory categoryIndex=${categoryIndex}`);
  return {
    type: actions.DELETE_CATEGORY,
    payload: categoryIndex
  };
}

export function updateCategory(categoryIndex, categoryName) {
  return {
    type: actions.UPDATE_CATEGORY,
    payload: { categoryIndex, categoryName }
  };
}
