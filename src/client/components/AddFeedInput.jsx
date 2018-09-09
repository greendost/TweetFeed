import React, { Component } from 'react';
import AppRequest from '../util/AppRequest';
import MessageBox from './MessageBox';
import cx from 'classnames';
import styles from '../styles/styles.css';

// containerize
import { connect } from 'react-redux';
import { addTFItem, beginAddingFeeds, finishAddingFeeds } from '../actions';

class AddFeedInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: '',
      addUserStatus: 'NOT_LOADED'
      // isActive: false,
      // tfInput: ''
    };

    // this.hasFocus = false;
    this.handleEnter = this.handleEnter.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
  }

  handleEnter(event) {
    const userName = document.getElementById('add-new-user').value;
    const categoryIndex = document.getElementById('select-category')
      .selectedIndex;

    if (userName) {
      if (event.key === 'Enter') {
        AppRequest.post(
          '/app/adduser',
          (err, data) => {
            console.log(data);
            if (err) {
              var result = JSON.parse(data);
              this.setState({
                addUserStatus: 'ERROR',
                errorMsg: result['errorMsg']
              });
              return;
            }

            this.setState({ addUserStatus: 'LOADED' });
            var tfItem = {
              query: userName
            };
            this.props.addTFItem(categoryIndex, tfItem);
          },
          {
            postData: JSON.stringify({
              screen_name: userName
            })
          }
        );
        this.setState({ addUserStatus: 'LOADING' });
        document.getElementById('add-new-user').value = '';
      }
    }
  }

  handleDoneClick() {
    this.handleEnter({ key: 'Enter' });
    this.props.finishAddingFeeds();
  }

  render() {
    var options = this.props.feedItems.map((category, index) => (
      <option key={index}>{category.name}</option>
    ));
    return (
      <div
        className={cx(
          styles['subContainer'],
          styles['subContainer--borderBottom']
        )}
      >
        <div className={cx(styles['subContainer--leaf'], styles['mb5'])}>
          <div
            className={cx(
              styles['subContainer'],
              styles['subContainer--field']
            )}
          >
            <div className={styles['subContainer__header']}>Add Feed</div>
            <p className={styles['subContainer--field__label']}>
              Username / query
            </p>
            {this.state.errorMsg ? (
              <MessageBox
                msg={this.state.errorMsg}
                handleCloseClick={() => {
                  this.setState({ errorMsg: '' });
                }}
              />
            ) : null}

            <input
              id="add-new-user"
              className={styles['input']}
              onKeyUp={this.handleEnter}
              onFocus={() => {
                this.props.beginAddingFeeds();
              }}
              placeholder="shakira, or queries e.g. q=nba"
            />
          </div>
          {this.props.mode === 'ADD_FEEDS' ? (
            <React.Fragment>
              <div
                className={cx(
                  styles['subContainer'],
                  styles['subContainer--field']
                )}
              >
                <p className={styles['subContainer--field__label']}>Category</p>
                <select id="select-category">{options}</select>
              </div>
              <div
                className={cx(
                  styles['subContainer'],
                  styles['subContainer--field']
                )}
              >
                <button
                  className={styles['float-right']}
                  onClick={this.handleDoneClick}
                >
                  Done
                </button>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feedItems: state.tfItems,
  mode: state.mode,
  tweetListFetch: state.tweetListFetch
});

const mapDispatchToProps = dispatch => ({
  addTFItem: (categoryIndex, tfItem) =>
    dispatch(addTFItem(categoryIndex, tfItem)),
  beginAddingFeeds: () => dispatch(beginAddingFeeds()),
  finishAddingFeeds: () => dispatch(finishAddingFeeds())
});

// disabled={this.state.addUserStatus === 'LOADING'}

AddFeedInput = connect(mapStateToProps, mapDispatchToProps)(AddFeedInput);
export default AddFeedInput;
