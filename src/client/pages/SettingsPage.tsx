import React, { Component } from "react";
import Header from "../components/Header";
import appStyles from "../styles/layout.css";
import styles from "../styles/styles.css";
import { hot } from "react-hot-loader";
import cx from "classnames";
import { connect } from "react-redux";
import MessageBox from "../components/MessageBox";
// types
import { IReduxState } from "../reducers";
import { IAction, importTFItems } from "../actions";
import { ThunkDispatch } from "redux-thunk";

interface HTMLAnchorWithDownloadElement extends HTMLAnchorElement {
  download: string;
}

interface IState {
  errorMsg: string;
  fileLoaded: string;
}

// const SettingsPage: React.SFC<IProps> = ({ tfItems, importTFItems }) => {
class SettingsPage extends Component<IProps, IState> {
  exportFilename: React.RefObject<HTMLInputElement>;
  downloadLink: React.RefObject<HTMLAnchorWithDownloadElement>;
  importFilename: React.RefObject<HTMLInputElement>;

  constructor(props: IProps) {
    super(props);

    this.state = { errorMsg: "", fileLoaded: "" };

    this.exportFilename = React.createRef<HTMLInputElement>();
    this.downloadLink = React.createRef<HTMLAnchorWithDownloadElement>();
    this.importFilename = React.createRef<HTMLInputElement>();

    this.handleExportFeeds = this.handleExportFeeds.bind(this);
    this.handleImportFeeds = this.handleImportFeeds.bind(this);
  }

  handleExportFeeds(ev: React.MouseEvent<HTMLAnchorElement>): void {
    var filename;
    if ((filename = this.exportFilename.current!.value)) {
      if ((filename = filename.split(".")[0]))
        this.downloadLink.current!.download = filename + ".json";
    }
    // var data = JSON.stringify(tfItems);
    var version = 0.1,
      app = "TweetFeed",
      type = "FeedList";
    var data = { meta: { version, app, type }, data: this.props.tfItems };
    (ev.target as HTMLAnchorElement).href =
      "data:" + "," + encodeURIComponent(JSON.stringify(data));
  }

  handleImportFeeds(ev: React.ChangeEvent<HTMLInputElement>): void {
    var input = ev.target;
    if (input.files && input.files.length) {
      var fr = new FileReader();
      var SettingsPageThat = this;
      fr.onload = function(ev: any) {
        var data = (ev.target as FileReader).result as string;
        try {
          var parsedJsonData = JSON.parse(data as string);
          // verify file
          if (!parsedJsonData["meta"])
            throw new Error("Looks like the file is invalid");
          if (
            !parsedJsonData["meta"]["app"] ||
            typeof parsedJsonData["meta"]["app"] !== "string"
          )
            throw new Error("Is this a TweetFeed file?");
          if (parsedJsonData["meta"]["app"] !== "TweetFeed")
            throw new Error(
              "Looks like this file is for " +
                parsedJsonData["meta"]["app"].substr(0, 20)
            );
          if (!parsedJsonData["data"])
            throw new Error("Is there any data in this file?");
          var jsonData = parsedJsonData["data"];
          SettingsPageThat.props.importTFItems(jsonData);
          SettingsPageThat.setState({ fileLoaded: input.files![0].name });
        } catch (e) {
          SettingsPageThat.setState({ errorMsg: e.toString() });
        }
      };
      fr.readAsText(input.files[0]);
    } else {
      console.log("no files");
    }
  }

  render() {
    return (
      <div className={appStyles["l-gridwrap2x1"]}>
        <Header layoutStyle={appStyles["l-header2x1"]} />
        <div
          className={cx(appStyles["l-mainPanel2x1"], styles["panelContainer"])}
        >
          <div
            className={cx(
              styles["subContainer"],
              styles["subContainer--large"],
              styles["mt20"],
              styles["pad5"]
            )}
          >
            <div className={cx(styles["headerText1"])}>Settings</div>
            <div className={cx(styles["subContainer"], styles["pad5"])}>
              <div className={styles["subContainer--leaf"]}>
                <p>Export Feeds (JSON file)</p>
                <input
                  type="text"
                  ref={this.exportFilename}
                  className={cx(styles["mr10"], styles["input--min150pxWide"])}
                  disabled={this.props.tfItems.length === 0}
                  placeholder={
                    this.props.tfItems.length === 0
                      ? "Your have no feeds to save"
                      : "exportFeeds.json (default)"
                  }
                />
                {this.props.tfItems.length ? (
                  <a
                    href="#"
                    download="exportFeeds.json"
                    onClick={this.handleExportFeeds}
                    className={styles["button-link"]}
                    ref={this.downloadLink}
                  >
                    Export
                  </a>
                ) : (
                  <p className={styles["button-link-disabled"]}>Export</p>
                )}
              </div>
              <div className={styles["subContainer--leaf"]}>
                <p>Import Feeds (JSON file)</p>
                {this.state.errorMsg ? (
                  <MessageBox
                    msg={this.state.errorMsg}
                    handleCloseClick={() => {
                      this.setState({ errorMsg: "" });
                    }}
                  />
                ) : null}
                <button
                  onClick={() => {
                    this.importFilename.current!.click();
                  }}
                >
                  Import
                </button>
                <input
                  type="file"
                  onChange={this.handleImportFeeds}
                  accept=".json"
                  style={{ display: "none" }}
                  ref={this.importFilename}
                />
                {this.state.fileLoaded ? (
                  <MessageBox
                    msg={this.state.fileLoaded + " successfully loaded!"}
                    handleCloseClick={() => {
                      this.setState({ fileLoaded: "" });
                    }}
                    styleMode={"normal"}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

type IStateProps = {
  tfItems: IReduxState["tfItems"];
};
type IDispatchProps = {
  importTFItems: (newTFItems: IReduxState["tfItems"]) => void;
};
type IOwnProps = {};
type IProps = IStateProps & IDispatchProps & IOwnProps;

const mapStateToProps = ({ tfItems }: { tfItems: IReduxState["tfItems"] }) => ({
  tfItems
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<IReduxState, undefined, IAction>
) => ({
  importTFItems: (newTFItems: IReduxState["tfItems"]) => {
    dispatch(importTFItems(newTFItems));
  }
});

// export default connect(
//   mapStateToProps,
//   null
// )(SettingsPage);

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsPage)
);
