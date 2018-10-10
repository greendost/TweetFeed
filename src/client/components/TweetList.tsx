import React, { Component } from "react";
import { connect } from "react-redux";
import cx from "classnames";
import styles from "../styles/styles.css";

import { IReduxState } from "../reducers";

interface IUrl {
  expanded_url: string;
}

interface ITweet {
  text: string;
  entities: {
    urls: IUrl[];
  };
  created_at: string;
}

const TweetList: React.SFC<{
  tweetList: ITweet[];
  fetchStatus: string;
  fetchErrorMsg: string;
}> = ({ tweetList, fetchStatus, fetchErrorMsg }) => {
  var tweetListFmt = tweetList.map((tweet, i) => {
    var urlListFmt = tweet.entities.urls.map((url, j) => (
      <li key={j} className={styles["ellipsis-for-long-text"]}>
        <a
          className={styles["link"]}
          href={url["expanded_url"]}
          target="_blank"
        >
          {url["expanded_url"]}
        </a>
      </li>
    ));

    // construct and return url list for the tweet
    return (
      <li
        key={i}
        className={cx(styles["listItem"], styles["listItem--bordered"])}
      >
        <div className={cx(styles["listItem__textGroup"], styles["wrap-text"])}>
          <div>{tweet.text}</div>
          <div className={styles["footNote"]}>{tweet.created_at}</div>
        </div>
        <div>
          <ul className={cx(styles["list"], styles["list--small"])}>
            {urlListFmt}
          </ul>
        </div>
      </li>
    );
  });

  // finally, return list of tweets
  return (
    <React.Fragment>
      {fetchStatus === "ERROR" ? (
        <p>{fetchErrorMsg}</p>
      ) : (
        <ul className={styles["list"]}>{tweetListFmt}</ul>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ tweetListFetch }: IReduxState) => ({
  tweetList: tweetListFetch.result,
  fetchStatus: tweetListFetch.status,
  fetchErrorMsg: tweetListFetch.msg
});

export default connect(mapStateToProps)(TweetList);
