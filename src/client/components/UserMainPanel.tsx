import React, { Component } from "react";
import appStyles from "../styles/layout.css";
import styles from "../styles/styles.css";
import TweetHeader from "./TweetHeader";
import TweetList from "./TweetList";
import cx from "classnames";

const UserMainPanel: React.SFC = () => (
  <div className={cx(appStyles["l-mainPanel"], styles["panelContainer"])}>
    <TweetHeader />
    <div
      className={cx(
        styles["subContainer"],
        styles["subContainer--large"],
        styles["mb20"]
      )}
    >
      <TweetList />
    </div>
  </div>
);

export default UserMainPanel;
