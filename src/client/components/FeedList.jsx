import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  selectTFItem,
  deleteTFItem,
  updateCategory,
  deleteCategory
} from '../actions';
import styles from '../styles/styles.css';
import cx from 'classnames';

class FeedList extends Component {
  constructor(props) {
    super(props);

    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleGetTweets = this.handleGetTweets.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.toggleCategoryOptions = this.toggleCategoryOptions.bind(this);
    this.toggleRenameOption = this.toggleRenameOption.bind(this);
    this.constructCategories = this.constructCategories.bind(this);

    this.loginKey = document.getElementById('loginKey').innerHTML;

    this.state = {
      categoryIndexBeingEdited: null,
      categoryIndexBeingRenamed: null,
      errorMsg: ''
    };
  }

  handleGetTweets(event) {
    var li = event.target.parentNode;
    this.props.selectTFItem(+li.dataset.categoryindex, +li.dataset.index);
  }

  handleCategoryClick(event) {
    console.log('handleCategoryClick');
    // TODO toggle open/close category
  }

  handleDeleteCategory(event) {
    this.setState({
      categoryIndexBeingEdited: null
    });
    this.props.deleteCategory(this.state.categoryIndexBeingEdited.index);
  }

  handleDeleteUser(event) {
    var li = event.target.parentNode;
    const userName = li.childNodes[0].innerHTML;

    this.props.deleteTFItem(+li.dataset.categoryindex, +li.dataset.index);
  }

  toggleCategoryOptions(event) {
    this.setState({
      categoryIndexBeingEdited: this.state.categoryIndexBeingEdited
        ? null
        : { index: +event.target.dataset.categoryindex }
    });
  }
  toggleRenameOption(event) {
    this.setState({
      categoryIndexBeingRenamed: this.state.categoryIndexBeingRenamed
        ? null
        : { index: this.state.categoryIndexBeingEdited.index }
    });
  }

  componentDidUpdate() {
    var input = document.getElementById('updateCategoryInput');
    if (input) {
      input.focus();
    }
  }

  handleEnter(ev) {
    if (ev.key === 'Enter') {
      var input = document.getElementById('updateCategoryInput');
      var newCategoryName = input.value.trim();
      var newCategoryIndex = this.state.categoryIndexBeingEdited.index;

      if (
        newCategoryName &&
        newCategoryName !== this.props.tfItems[newCategoryIndex].name
      ) {
        // check for dups
        var isDup = false;
        for (let i = 0; i < this.props.tfItems.length; i++) {
          if (this.props.tfItems[i].name === newCategoryName) {
            isDup = true;
            this.setState({ errorMsg: `${newCategoryName} already exists` });
            return;
          }
        }
        if (!isDup) {
          this.props.updateCategory(newCategoryIndex, newCategoryName);
          this.setState({
            errorMsg: '',
            categoryIndexBeingRenamed: null,
            categoryIndexBeingEdited: null
          });
        }
      } else {
        this.setState({
          errorMsg: '',
          categoryIndexBeingRenamed: null,
          categoryIndexBeingEdited: null
        });
      }
    }
  }

  constructCategories() {
    return this.props.tfItems.map((category, i) => {
      const users = category.list.map((user, j) => (
        <li
          key={'user' + j}
          data-categoryindex={i}
          data-index={j}
          className={styles['listItem']}
        >
          <div
            className={
              this.props.selectedTFItem.length &&
              this.props.selectedTFItem[0] === i &&
              this.props.selectedTFItem[1] === j
                ? cx(styles['float-left'], styles['listItem--selectedText'])
                : styles['float-left']
            }
            onClick={this.handleGetTweets}
          >
            {user['query']}
          </div>
          <div
            className={cx(styles['float-right'], styles['option'])}
            onClick={this.handleDeleteUser}
          >
            delete
          </div>
        </li>
      ));
      return (
        <li
          key={'category' + i}
          data-index={i}
          className={cx(styles['listItem'], styles['listItem--outerItem'])}
        >
          <div className={styles['clear-float-container']}>
            <div
              onClick={this.handleCategoryClick}
              className={cx(styles['listItem__header'], styles['float-left'])}
            >
              {this.state.categoryIndexBeingRenamed &&
              this.state.categoryIndexBeingRenamed.index === i ? (
                <React.Fragment>
                  {this.state.errorMsg ? (
                    <p className={styles['errorMessage']}>
                      {this.state.errorMsg}
                    </p>
                  ) : null}
                  <div
                    className={cx(
                      styles['subContainer'],
                      styles['subContainer--oneFieldOnly']
                    )}
                  >
                    <input
                      id="updateCategoryInput"
                      defaultValue={category['name']}
                      onKeyUp={this.handleEnter}
                    />
                  </div>
                </React.Fragment>
              ) : (
                category['name']
              )}
            </div>
            <div
              data-categoryindex={i}
              className={cx(
                styles['float-right'],
                styles['option'],
                styles['option__textSmall']
              )}
              onClick={this.toggleCategoryOptions}
            >
              options
            </div>
          </div>
          {this.state.categoryIndexBeingEdited &&
          this.state.categoryIndexBeingEdited.index === i ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
              className={styles['mb20']}
            >
              <div
                onClick={this.toggleRenameOption}
                className={cx(
                  styles['option'],
                  styles['option--big'],
                  styles['option__textRegular']
                )}
              >
                Rename
              </div>
              <div
                onClick={this.handleDeleteCategory}
                className={cx(
                  styles['option'],
                  styles['option--big'],
                  styles['option__textRegular']
                )}
              >
                Delete
              </div>
            </div>
          ) : null}
          <ul className={styles['list']}>{users}</ul>
        </li>
      );
    });
  }

  render() {
    return (
      <div className={styles['subContainer--leafVerticalStack']}>
        <ul className={styles['list']}>{this.constructCategories()}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tfItems: state.tfItems,
  selectedTFItem: state.selectedTFItem
});

const mapDispatchToProps = dispatch => ({
  deleteTFItem: (categoryIndex, tfIndex) => {
    dispatch(deleteTFItem(categoryIndex, tfIndex));
  },
  selectTFItem: (categoryIndex, tfIndex) => {
    dispatch(selectTFItem(categoryIndex, tfIndex));
  },
  updateCategory: (categoryIndex, categoryName) => {
    dispatch(updateCategory(categoryIndex, categoryName));
  },
  deleteCategory: categoryIndex => {
    dispatch(deleteCategory(categoryIndex));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);
