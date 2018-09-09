import * as actions from '../actions/actionTypes';
import { combineReducers } from 'redux';

const initialState = {
  tfItems: [{ name: 'Category 1', list: [] }],
  selectedTFItem: [],
  tweetListFetch: {
    status: 'NOT_LOADED',
    msg: '',
    result: []
  },
  mode: 'DEFAULT'
  // openTFCategories: [],
};

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_TF_ITEM:
//       var { categoryIndex, tfItem } = action.payload;
//       var updatedList = state.tfItems.map((category, index) => {
//         return categoryIndex === index
//           ? Object.assign({}, category, { list: [...category.list, tfItem] })
//           : category;
//       });
//       return Object.assign({}, state, { tfItems: updatedList });
//     case SELECT_TF_ITEM:
//       return Object.assign({}, state, { selectedTFItem: action.payload });
//     case DELETE_TF_ITEM:
//       var [categoryIndex, tfIndex] = action.payload;
//       var updatedList = state.tfItems.map((category, index) => {
//         return index === categoryIndex
//           ? {
//               name: category.name,
//               list: [
//                 ...category.list.slice(0, tfIndex),
//                 ...category.list.slice(tfIndex + 1)
//               ]
//             }
//           : category;
//       });
//
//       return Object.assign({}, state, { tfItems: updatedList });
//     case FETCH_TWEETS_REQUEST:
//       return Object.assign({}, state, {
//         tweetListFetchIndicator: { status: 'LOADING', msg: '' }
//       });
//     case FETCH_TWEETS_SUCCESS:
//       return Object.assign({}, state, {
//         tweetListFetchIndicator: { status: 'LOADED', msg: '' },
//         tweetList: action.payload.tweetList
//       });
//     case FETCH_TWEETS_FAILURE:
//       return Object.assign({}, state, {
//         tweetListFetchIndicator: { status: 'ERROR', msg: action.payload.msg }
//       });
//
//     default:
//       return state;
//   }
// };

function tfItems(state = initialState.tfItems, action) {
  switch (action.type) {
    case actions.ADD_TF_ITEM:
      var { categoryIndex, tfItem } = action.payload;
      var updatedList = state.map((category, index) => {
        return categoryIndex === index
          ? Object.assign({}, category, { list: [...category.list, tfItem] })
          : category;
      });
      return updatedList;
    case actions.DELETE_TF_ITEM:
      var [categoryIndex, tfIndex] = action.payload;
      var updatedList = state.map((category, index) => {
        return index === categoryIndex
          ? Object.assign({}, category, {
              list: [
                ...category.list.slice(0, tfIndex),
                ...category.list.slice(tfIndex + 1)
              ]
            })
          : category;
      });
      return updatedList;
    case actions.ADD_CATEGORY:
      return [...state, action.payload];
    case actions.DELETE_CATEGORY:
      console.log('reducer Delete category');
      var categoryIndex = action.payload;
      return state.filter((category, index) => categoryIndex !== index);
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

// {
//     name: category.name,
//     list: [
//       ...category.list.slice(0, tfIndex),
//       ...category.list.slice(tfIndex + 1)
//     ]
//   }

function selectedTFItem(state = initialState.selectedTFItem, action) {
  switch (action.type) {
    case actions.SELECT_TF_ITEM:
      return action.payload;
    default:
      return state;
  }
}

function tweetListFetch(state = initialState.tweetListFetch, action) {
  switch (action.type) {
    case actions.FETCH_TWEETS_REQUEST:
      return Object.assign({}, state, {
        status: 'LOADING',
        msg: '',
        result: []
      });
    case actions.FETCH_TWEETS_SUCCESS:
      return Object.assign({}, state, {
        status: 'LOADED',
        msg: '',
        result: action.payload.tweetList
      });
    case actions.FETCH_TWEETS_FAILURE:
      return Object.assign({}, state, {
        status: 'ERROR',
        msg: action.payload.msg,
        result: []
      });
    case actions.FETCH_TWEETS_REINIT:
      return initialState.tweetListFetch;
    default:
      return state;
  }
}

function mode(state = 'DEFAULT', action) {
  switch (action.type) {
    case actions.CHANGE_MODE:
      return action.payload;
    default:
      return state;
  }
}

// export default reducer;
export default combineReducers({
  tfItems,
  selectedTFItem,
  tweetListFetch,
  mode
});
