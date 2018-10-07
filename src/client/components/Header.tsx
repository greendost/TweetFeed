import React, { Component } from "react";
import styles from "../styles/styles.css";

const Header: React.SFC<{ layoutStyle: string }> = ({ layoutStyle }) => (
  <div className={layoutStyle + " " + styles["header"]}>TweetFeed</div>
);

export default Header;
