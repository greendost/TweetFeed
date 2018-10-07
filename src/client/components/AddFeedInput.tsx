import React, { Component } from "react";
import AppRequest from "../util/AppRequest";
import MessageBox from "./MessageBox";
import cx from "classnames";
import styles from "../styles/styles.css";

// containerize
import { connect } from "react-redux";
import {
  addTFItem,
  beginAddingFeeds,
  finishAddingFeeds,
  ITFItem
} from "../actions";

// types
import { IReduxState } from "../reducers";
import { ThunkDispatch } from "redux-thunk";
import { IAction } from "../actions";

interface IState {
  errorMsg: "";
  addUserStatus: string;
}

interface IFakeEvent {
  key: string;
}

class AddFeedInput extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      errorMsg: "",
      addUserStatus: "NOT_LOADED"
    };

    this.handleEnter = this.handleEnter.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
  }

  handleEnter(event: React.KeyboardEvent<HTMLInputElement> | IFakeEvent) {
    const userName = (document.getElementById(
      "add-new-user"
    )! as HTMLInputElement).value;
    const categoryIndex = (document.getElementById(
      "select-category"
    )! as HTMLSelectElement).selectedIndex;

    if (userName) {
      if (event.key === "Enter") {
        AppRequest.post(
          "/app/adduser",
          (err, data) => {
            if (err) {
              var result = JSON.parse(data);
              this.setState({
                addUserStatus: "ERROR",
                errorMsg: result["errorMsg"]
              });
              return;
            }

            this.setState({ addUserStatus: "LOADED" });
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
        this.setState({ addUserStatus: "LOADING" });
        (document.getElementById("add-new-user")! as HTMLInputElement).value =
          "";
      }
    }
  }

  handleDoneClick() {
    this.handleEnter({ key: "Enter" });
    this.props.finishAddingFeeds();
  }

  render() {
    var options = this.props.feedItems.map((category, index) => (
      <option key={index}>{category.name}</option>
    ));
    return (
      <div
        className={cx(
          styles["subContainer"],
          styles["subContainer--borderBottom"]
        )}
      >
        <div className={cx(styles["subContainer--leaf"], styles["mb5"])}>
          <div
            className={cx(
              styles["subContainer"],
              styles["subContainer--field"]
            )}
          >
            <div className={styles["subContainer__header"]}>Add Feed</div>
            <p className={styles["subContainer--field__label"]}>
              Username / query
            </p>
            {this.state.errorMsg ? (
              <MessageBox
                msg={this.state.errorMsg}
                handleCloseClick={() => {
                  this.setState({ errorMsg: "" });
                }}
              />
            ) : null}

            <input
              id="add-new-user"
              className={styles["input"]}
              onKeyUp={this.handleEnter}
              onFocus={() => {
                this.props.beginAddingFeeds();
              }}
              placeholder="shakira, or queries e.g. q=nba"
            />
          </div>
          {this.props.mode === "ADD_FEEDS" ? (
            <React.Fragment>
              <div
                className={cx(
                  styles["subContainer"],
                  styles["subContainer--field"]
                )}
              >
                <p className={styles["subContainer--field__label"]}>Category</p>
                <select id="select-category">{options}</select>
              </div>
              <div
                className={cx(
                  styles["subContainer"],
                  styles["subContainer--field"]
                )}
              >
                <button
                  className={styles["float-right"]}
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

interface IStateProps {
  feedItems: IReduxState["tfItems"];
  mode: IReduxState["mode"];
  tweetListFetch: IReduxState["tweetListFetch"];
}

interface IDispatchProps {
  addTFItem: (categoryIndex: number, tfItem: ITFItem) => void;
  beginAddingFeeds: () => void;
  finishAddingFeeds: () => void;
}

interface IOwnProps {}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const mapStateToProps = (state: IReduxState) => ({
  feedItems: state.tfItems,
  mode: state.mode,
  tweetListFetch: state.tweetListFetch
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<IReduxState, undefined, IAction>
) => ({
  addTFItem: (categoryIndex: number, tfItem: ITFItem) =>
    dispatch(addTFItem(categoryIndex, tfItem)),
  beginAddingFeeds: () => dispatch(beginAddingFeeds()),
  finishAddingFeeds: () => dispatch(finishAddingFeeds())
});

// disabled={this.state.addUserStatus === 'LOADING'}
// AddFeedInput = connect(mapStateToProps, mapDispatchToProps)(AddFeedInput);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFeedInput);
