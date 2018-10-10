import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import reducer from "./reducers";
import App from "./App";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

ReactDOM.render(
  <Provider
    store={createStore(
      reducer,
      composeEnhancers(applyMiddleware(thunkMiddleware))
    )}
  >
    <App />
  </Provider>,
  document.getElementById("root")
);
