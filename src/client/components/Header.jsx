import React, { Component } from 'react';
import appStyles from '../styles/App.css';
import styles from '../styles/styles.css';

class Header extends Component {
  render() {
    return (
      <div className={this.props.layoutStyle + ' ' + styles['header']}>
        TweetFeed
      </div>
    );
  }
}

export default Header;
