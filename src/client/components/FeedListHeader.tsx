import React, { Component } from "react";
import styles from "../styles/styles.css";
import cx from "classnames";
import { connect } from "react-redux";
import { addCategory } from "../actions";

// types
import { ICategory } from "../actions";
import { Dispatch } from "redux";

export interface IState {
  isExpanded: boolean;
  errorMsg: string;
  currentCategory: string;
}

interface IKeyEvent {
  key: string;
}

interface IEvent {
  target: { value: string };
}

class FeedListHeader extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isExpanded: false,
      errorMsg: "",
      currentCategory: ""
    };

    this.toggleAddCategory = this.toggleAddCategory.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggleAddCategory() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  handleChange(ev: IEvent) {
    this.setState({ currentCategory: ev.target.value });
  }

  handleEnter(ev: IKeyEvent) {
    if (ev.key === "Enter") {
      var newCategoryName = this.state.currentCategory.trim();
      // var newCategoryName = (document.getElementById(
      //   "newCategoryInput"
      // )! as HTMLInputElement).value!.trim();

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
          this.setState({ errorMsg: "" });
          this.props.addCategory(newCategoryName);
        }
      }
      this.setState({ currentCategory: "" });
    }
  }
  // handleEnter(ev: IEvent) {
  //   if (ev.key === "Enter") {
  //     var newCategoryName = (document.getElementById(
  //       "newCategoryInput"
  //     )! as HTMLInputElement).value!.trim();

  //     if (newCategoryName) {
  //       // check for dups
  //       var isDup = false;
  //       for (let i = 0; i < this.props.tfItems.length; i++) {
  //         if (this.props.tfItems[i].name === newCategoryName) {
  //           isDup = true;
  //           this.setState({ errorMsg: `${newCategoryName} already exists` });
  //           break;
  //         }
  //       }
  //       if (!isDup) {
  //         this.setState({ errorMsg: "" });
  //         this.props.addCategory(newCategoryName);
  //       }
  //     }
  //     (document.getElementById("newCategoryInput")! as HTMLInputElement).value =
  //       "";
  //   }
  // }

  handleDoneClick() {
    this.handleEnter({ key: "Enter" });
    this.setState({ isExpanded: false, errorMsg: "" });
  }

  render() {
    return (
      <div
        className={
          this.state.isExpanded
            ? cx(styles["subContainer--leafVerticalStack"], styles["mb20"])
            : cx(styles["subContainer--leafVerticalStack"])
        }
      >
        <div className={styles["clear-float-container"]}>
          <div
            className={cx(styles["float-left"], styles["subContainer__header"])}
          >
            Feeds
          </div>
          <div
            className={cx(
              styles["float-right"],
              styles["option"],
              styles["option--bigOneOnly"],
              styles["option__textBig"]
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
                styles["subContainer"],
                styles["subContainer--field"]
              )}
            >
              <p className={styles["subContainer--field__label"]}>
                New Category
              </p>
              {this.state.errorMsg ? (
                <p className={styles["errorMessage"]}>{this.state.errorMsg}</p>
              ) : null}
              <input
                id="newCategoryInput"
                className={styles["input"]}
                onKeyUp={this.handleEnter}
                onChange={this.handleChange}
                value={this.state.currentCategory}
              />
            </div>
            <div
              className={cx(
                styles["subContainer"],
                styles["subContainer--field"]
              )}
            >
              <button
                onClick={this.handleDoneClick}
                className={styles["float-right"]}
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

interface IStateProps {
  tfItems: ICategory[];
}

interface IDispatchProps {
  addCategory: (categoryName: string) => void;
}

interface IOwnProps {}

export type IProps = IStateProps & IDispatchProps & IOwnProps;

const mapStateToProps = ({
  tfItems
}: {
  tfItems: ICategory[];
}): IStateProps => ({
  tfItems
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  addCategory: (categoryName: string) => dispatch(addCategory(categoryName))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedListHeader);

// export default connect<IStateProps, IDispatchProps, IOwnProps>(
//   mapStateToProps,
//   mapDispatchToProps
// )(FeedListHeader);
