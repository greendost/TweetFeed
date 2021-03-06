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
          styles["pad5"],
          styles["mt20"]
        )}
      >
        <div className={styles["headerText1"]}>About Tweetfeed</div>
        <p className={styles["para"]}>
          This is a full stack portfolio app making use of the Twitter API,
          demonstrating use of the following technologies:
          <ul
            className={cx(
              styles["list"],
              styles["list--indent"],
              styles["mt10"]
            )}
          >
            <li>Frameworks - React, Express (Node)</li>
            <li>State management - Redux</li>
            <li>Strong typing system - Typescript</li>
            <li>Test - Jest, Enzyme</li>
            <li>General web development skills</li>
          </ul>
        </p>

        <p className={styles["para"]}>
          If you like it, feel free to&nbsp;
          <a href="https://github.com/greendost/TweetFeed" target="_blank">
            download / clone it
          </a>
          &nbsp;and use your personal Twitter development key.
        </p>
      </div>
    </div>
  </div>
);

export default hot(module)(AboutPage);
