import React, { Component } from "react";
import appStyles from "../styles/layout.css";
import styles from "../styles/styles.css";
import AddFeedInput from "./AddFeedInput";
import FeedListWrap from "./FeedListWrap";
import cx from "classnames";
import SvgToggleArrow from "./SvgToggleArrow";

const UserListSidePanel: React.SFC = () => {
  let sidePanelRef = React.createRef<HTMLDivElement>();
  let sidePanelContentRef = React.createRef<HTMLDivElement>();
  let arrowRef = React.createRef<HTMLDivElement>();

  function toggleSidePanel() {
    if (
      sidePanelRef.current!.style.width === "" ||
      sidePanelRef.current!.style.width === "225px"
    ) {
      sidePanelRef.current!.style.width = "45px";
      sidePanelContentRef.current!.style.opacity = "0.2";
      sidePanelContentRef.current!.style.pointerEvents = "none";
      arrowRef.current!.classList.add(styles["arrow--reverse"]);
    } else {
      sidePanelRef.current!.style.width = "225px";
      sidePanelContentRef.current!.style.opacity = "1";
      sidePanelContentRef.current!.style.pointerEvents = "auto";
      arrowRef.current!.classList.remove(styles["arrow--reverse"]);
    }
  }

  return (
    <div
      id={styles["userListSidePanel"]}
      className={appStyles["l-sidePanel"]}
      ref={sidePanelRef}
    >
      <div
        className={cx(styles["subContainer"], styles["clear-float-container"])}
      >
        <div
          className={cx(styles["float-right"], styles["arrow"])}
          onClick={toggleSidePanel}
          ref={arrowRef}
        >
          <SvgToggleArrow />
        </div>
      </div>
      <div className={styles["subContainer--fade"]} ref={sidePanelContentRef}>
        <AddFeedInput />
        <FeedListWrap />
      </div>
    </div>
  );
};

{
  /* <button className={styles["float-right"]} onClick={toggleSidePanel}>
          <SvgToggleArrow />
        </button> */
}
export default UserListSidePanel;
