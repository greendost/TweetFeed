import React, { Component } from 'react';
import styles from '../styles/styles.css';
import cx from 'classnames';
import { connect } from 'react-redux';
import { addCategory } from '../actions';

class FeedListHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
      errorMsg: ''
    };

    this.toggleAddCategory = this.toggleAddCategory.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  toggleAddCategory() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  handleEnter(ev) {
    if (ev.key === 'Enter') {
      var newCategoryName = document
        .getElementById('newCategoryInput')
        .value.trim();

      if (newCategoryName) {
        // check for dups
        var isDup = false;
        for (let i = 0; i < this.props.tfItems.length; i++) {
          if (this.props.tfItems[i].name === newCategoryName) {
            isDup = true;
            this.setState({ errorMsg: `${newCategoryName} already exists` });
            break;
          }
        }
        if (!isDup) {
          this.setState({ errorMsg: '' });
          this.props.addCategory(newCategoryName);
        }
      }
      document.getElementById('newCategoryInput').value = '';
    }
  }

  handleDoneClick() {
    this.handleEnter({ key: 'Enter' });
    this.setState({ isExpanded: false, errorMsg: '' });
  }

  render() {
    return (
      <div
        className={
          this.state.isExpanded
            ? cx(styles['subContainer--leafVerticalStack'], styles['mb20'])
            : cx(styles['subContainer--leafVerticalStack'])
        }
      >
        <div className={styles['clear-float-container']}>
          <div
            className={cx(styles['float-left'], styles['subContainer__header'])}
          >
            Feeds
          </div>
          <div
            className={cx(
              styles['float-right'],
              styles['option'],
              styles['option--bigOneOnly'],
              styles['option__textBig']
            )}
            onClick={this.toggleAddCategory}
          >
            +
          </div>
        </div>
        {this.state.isExpanded ? (
          <React.Fragment>
            <div
              className={cx(
                styles['subContainer'],
                styles['subContainer--field']
              )}
            >
              <p className={styles['subContainer--field__label']}>
                New Category
              </p>
              {this.state.errorMsg ? (
                <p className={styles['errorMessage']}>{this.state.errorMsg}</p>
              ) : null}
              <input
                id="newCategoryInput"
                className={styles['input']}
                onKeyUp={this.handleEnter}
              />
            </div>
            <div
              className={cx(
                styles['subContainer'],
                styles['subContainer--field']
              )}
            >
              <button
                onClick={this.handleDoneClick}
                className={styles['float-right']}
              >
                Done
              </button>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ tfItems }) => ({
  tfItems
});

const mapDispatchToProps = dispatch => ({
  addCategory: categoryName => dispatch(addCategory(categoryName))
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedListHeader);
