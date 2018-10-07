import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';
import App from './App';

ReactDOM.render(
  <Provider
    store={createStore(
      reducer,
      compose(
        applyMiddleware(thunkMiddleware),
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
          (window as any).__REDUX_DEVTOOLS_EXTENSION__()
      )
    )}
  >
    <App />
  </Provider>,
  document.getElementById('root')
);

// store={createStore(
//   reducer,
//   (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
//     (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
//   applyMiddleware(thunkMiddleware)
// )}