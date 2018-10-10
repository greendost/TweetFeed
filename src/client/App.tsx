import React from "react";
import Header from "./components/Header";
import UserListSidePanel from "./components/UserListSidePanel";
import UserMainPanel from "./components/UserMainPanel";
import appStyles from "./styles/App.css";
import { hot } from "react-hot-loader";

const App: React.SFC<{}> = () => (
  <div className={appStyles["l-gridwrap"]}>
    <Header layoutStyle={appStyles["l-header"]} />
    <UserListSidePanel />
    <UserMainPanel />
  </div>
);

export default hot(module)(App);
