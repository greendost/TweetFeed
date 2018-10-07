import React from "react";
import styles from "../styles/styles.css";
import { connect } from "react-redux";
import { IReduxState } from "../reducers";

const TweetHeader: React.SFC<{ query: string }> = ({ query }) => (
  <h1 className={styles.headerText1}>{query}</h1>
);

const mapStateToProps = (state: IReduxState) => ({
  query: state.selectedTFItem.length
    ? state.tfItems[state.selectedTFItem[0]].list[state.selectedTFItem[1]].query
    : ""
});
export default connect(mapStateToProps)(TweetHeader);
