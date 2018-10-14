import React from "react";
import Header from "../components/Header";
import appStyles from "../styles/layout.css";
import styles from "../styles/styles.css";
import { hot } from "react-hot-loader";
import cx from "classnames";

const AboutPage: React.SFC<{}> = () => (
  <div className={appStyles["l-gridwrap2x1"]}>
    <Header layoutStyle={appStyles["l-header2x1"]} />
    <div className={cx(appStyles["l-mainPanel2x1"], styles["panelContainer"])}>
      <div
        className={cx(
          styles["subContainer"],
          styles["subContainer--large"],
          styles["subContainer--leaf"],
          styles["mt20"]
        )}
      >
        <div className={styles["headerText1"]}>About Tweetfeed</div>
        <p className={styles["para"]}>
          This is a portfolio app for working with the Twitter API,
          demonstrating use of React, Redux, Node, and general web development
          skills.
        </p>
      </div>
    </div>
  </div>
);

export default hot(module)(AboutPage);
