import React, { Component } from "react";
import styles from "../styles/styles.css";
import { Link } from "react-router-dom";
import cx from "classnames";

const Header: React.SFC<{ layoutStyle: string }> = ({ layoutStyle }) => (
  <div className={layoutStyle + " " + styles["header"]}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        {window.location.pathname !== "/login" ? (
          <Link to="/mainapp">
            <img src="/logo32.png" />
          </Link>
        ) : (
          <img src="/logo32.png" />
        )}
      </div>
      {window.location.pathname !== "/login" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <ul className="list">
            <p
              className={cx(styles["listItem"], styles["listItem--headerLink"])}
            >
              <Link to="/mainapp/settings">Settings</Link>
            </p>
            <p
              className={cx(styles["listItem"], styles["listItem--headerLink"])}
            >
              <Link to="/mainapp/about">About</Link>
            </p>
          </ul>
        </div>
      ) : null}
    </div>
  </div>
);

export default Header;
