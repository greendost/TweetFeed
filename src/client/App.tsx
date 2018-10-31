import React from "react";
import Header from "./components/Header";
import UserListSidePanel from "./components/UserListSidePanel";
import UserMainPanel from "./components/UserMainPanel";
// import appStyles from "./styles/App.css";
import appStyles from "./styles/layout.css";
import styles from "./styles/styles.css";
import { hot } from "react-hot-loader";
import { storageAvailable } from "./util/util";
import cx from "classnames";

import { setConfig } from "react-hot-loader";
setConfig({ logLevel: "debug" });

class App extends React.Component<{}, {}> {
  componentDidMount() {
    var loginKey: string;
    if (storageAvailable("sessionStorage")) {
      if (
        !(loginKey = (document.getElementById("loginKey") as HTMLInputElement)!
          .innerHTML)
      ) {
        (document.getElementById("loginKey") as HTMLInputElement).innerHTML =
          sessionStorage.getItem("loginKey") || "";
      } else {
        sessionStorage.setItem("loginKey", loginKey);
      }
    }
  }

  render() {
    return (
      <div className={appStyles["l-gridwrap2x1"]}>
        <Header layoutStyle={appStyles["l-header2x1"]} />
        <div
          className={cx(appStyles["l-mainPanel2x1"], styles["flexContainer"])}
        >
          <UserListSidePanel />
          <UserMainPanel />
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
