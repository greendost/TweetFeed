import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import reducer from "./reducers";
import App from "./App";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

ReactDOM.render(
  <Provider
    store={createStore(
      reducer,
      composeEnhancers(applyMiddleware(thunkMiddleware))
    )}
  >
    <BrowserRouter>
      <Switch>
        <Route exact path="/mainapp" component={App} />
        <Route path="/mainapp/about" component={AboutPage} />
        <Route path="/mainapp/settings" component={SettingsPage} />
        <App />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
