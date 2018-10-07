import React, { Component } from "react";
import appStyles from "../styles/App.css";
import TweetHeader from "./TweetHeader";
import TweetList from "./TweetList";

const UserMainPanel: React.SFC = () => (
  <div className={appStyles["l-mainPanel"]}>
    <TweetHeader />
    <TweetList />
  </div>
);

export default UserMainPanel;
