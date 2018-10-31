import React, { Component } from "react";
import baseStyles from "../styles/styles.css";
import cmpStyles from "./MessageBox.css";
import cx from "classnames";

const MessageBox: React.SFC<{
  msg: string;
  handleCloseClick: (ev: React.MouseEvent) => void;
  inline?: boolean;
  styleMode?: string;
}> = ({ msg, handleCloseClick, inline, styleMode }) => (
  <div
    className={
      styleMode === "normal"
        ? cmpStyles["messageBox--normal"]
        : cmpStyles["messageBox"]
    }
    style={inline ? { display: "inline-block" } : { display: "block" }}
  >
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
