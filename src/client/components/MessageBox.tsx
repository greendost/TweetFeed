import React, { Component } from "react";
import baseStyles from "../styles/styles.css";
import cmpStyles from "./MessageBox.css";
import cx from "classnames";

const MessageBox: React.SFC<{
  msg: string;
  handleCloseClick: (ev: React.MouseEvent) => void;
}> = ({ msg, handleCloseClick }) => (
  <div className={cmpStyles["messageBox"]}>
    <div
      className={cx(
        baseStyles["float-right"],
        cmpStyles["messageBox__closeButton"]
      )}
      onClick={handleCloseClick}
    >
      &times;
    </div>
    <p className={cmpStyles["messageBox__text"]}>{msg}</p>
  </div>
);

export default MessageBox;
