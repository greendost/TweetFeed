import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import styles from '../styles/styles.css';

const TweetList = ({ tweetList, fetchStatus, fetchErrorMsg }) => {
  var tweetList = tweetList.map((tweet, i) => {
    var urlList = tweet.entities.urls.map((url, j) => (
      <li key={j} className={styles['ellipsis-for-long-text']}>
        <a
          className={styles['link']}
          href={url['expanded_url']}
          target="_blank"
        >
          {url['expanded_url']}
        </a>
      </li>
    ));

    // construct and return url list for the tweet
    return (
      <li
        key={i}
        className={cx(styles['listItem'], styles['listItem--bordered'])}
      >
        <div className={styles['listItem__textGroup']}>
          <div>{tweet.text}</div>
          <div className={styles['footNote']}>{tweet.created_at}</div>
        </div>
        <div>
          <ul className={cx(styles['list'], styles['list--small'])}>
            {urlList}
          </ul>
        </div>
      </li>
    );
  });

  // finally, return list of tweets
  return (
    <React.Fragment>
      {fetchStatus === 'ERROR' ? (
        <p>{fetchErrorMsg}</p>
      ) : (
        <ul className={styles['list']}>{tweetList}</ul>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ tweetListFetch }) => ({
  tweetList: tweetListFetch.result,
  fetchStatus: tweetListFetch.status,
  fetchErrorMsg: tweetListFetch.msg
});

// {fetchIndicator.status === 'ERROR' ? (
//   <p>{fetchIndicator.msg}</p>
// ) : (
//   <ul className={styles.list}>{tweetList}</ul>
// )}

export default connect(mapStateToProps)(TweetList);
