import React from "react";
import Header from "../components/Header";
import appStyles from "../styles/layout.css";
import styles from "../styles/styles.css";
import { hot } from "react-hot-loader";
import cx from "classnames";

const SettingsPage: React.SFC<{}> = () => (
  <div className={appStyles["l-gridwrap2x1"]}>
    <Header layoutStyle={appStyles["l-header2x1"]} />
    <div className={cx(appStyles["l-mainPanel2x1"], styles["panelContainer"])}>
      <div
        style={{ paddingTop: "5px" }}
        className={cx(
          styles["subContainer"],
          styles["subContainer--large"],
          styles["mt20"]
        )}
      >
        <div className={styles["headerText1"]}>Settings</div>
        <div
          className={cx(styles["subContainer"], styles["subContainer--leaf"])}
        >
          <p>Export Feeds (JSON file) -- coming soon!</p>
          <p>Import Feeds (JSON file) -- coming soon!</p>
        </div>
      </div>
    </div>
  </div>
);

export default hot(module)(SettingsPage);
