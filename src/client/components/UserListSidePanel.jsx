import React, { Component } from 'react';
import appStyles from '../styles/App.css';
import styles from '../styles/styles.css';
import AddFeedInput from './AddFeedInput';
import FeedListWrap from './FeedListWrap';

const UserListSidePanel = props => (
  <div id={styles['userListSidePanel']} className={appStyles['l-sidePanel']}>
    <AddFeedInput />
    <FeedListWrap />
  </div>
);

export default UserListSidePanel;
