import React from "react";
import Header from "./components/Header";
import UserListSidePanel from "./components/UserListSidePanel";
import UserMainPanel from "./components/UserMainPanel";
// import appStyles from "./styles/App.css";
import appStyles from "./styles/layout.css";
import { hot } from "react-hot-loader";

const App: React.SFC<{}> = () => (
  <div className={appStyles["l-gridwrap2x2"]}>
    <Header layoutStyle={appStyles["l-header2x2"]} />
    <UserListSidePanel />
    <UserMainPanel />
  </div>
);

export default hot(module)(App);
