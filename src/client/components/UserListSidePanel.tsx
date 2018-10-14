import React, { Component } from "react";
import appStyles from "../styles/layout.css";
import styles from "../styles/styles.css";
import AddFeedInput from "./AddFeedInput";
import FeedListWrap from "./FeedListWrap";
import cx from "classnames";

const UserListSidePanel: React.SFC = () => {
  return (
    <div
      id={styles["userListSidePanel"]}
      className={appStyles["l-sidePanel2x2"]}
    >
      <div
        className={cx(styles["subContainer"], styles["clear-float-container"])}
      >
        <button className={styles["float-right"]}>&lt;</button>
      </div>
      <AddFeedInput />
      <FeedListWrap />
    </div>
  );
};

export default UserListSidePanel;
