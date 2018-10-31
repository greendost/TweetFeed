import React, { Component } from "react";
import Header from "./components/Header";
import axios from "axios";
import { hot } from "react-hot-loader";
import cx from "classnames";
import appStyles from "./styles/layout.css";
import styles from "./styles/styles.css";

interface IState {
  isLoading: boolean;
}

interface ILoginKeyResponse {
  data: { key: string };
}

class LoginApp extends Component<{}, IState> {
  serverKey: string;
  loginKey: string;

  constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.serverKey = "";
    this.loginKey = "";
    this.getLoginKey = this.getLoginKey.bind(this);
  }

  componentDidMount() {
    this.serverKey = document.getElementById("serverKey")!.innerHTML;
    this.getLoginKey();
  }

  getLoginKey() {
    axios
      .get("/loginkey")
      .then((res: ILoginKeyResponse) => {
        // console.log('response from loginkey=' + JSON.stringify(res));
        this.loginKey = res.data.key;
        this.setState({ isLoading: false });
      })
      .catch((err: string) => {
        // console.log(err);
      });
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
              styles["subContainer--leaf"],
              styles["mt20"]
            )}
          >
            <p className={styles["para"]}>
              Hi, welcome to my portfolio app: TweetFeed.
            </p>
            <p className={styles["para"]}>
              Since this app uses my Twitter key, I have put in a session limit
              of 15 minutes. Feel free to explore, organizing Twitter screen
              names and queries within lists. If you like it, feel free to
              download a copy (coming soon) and use your personal Twitter
              development key.
            </p>
            <form
              method="POST"
              action="/mainapp"
              className={cx(styles["form"], styles["mb10"])}
            >
              <input
                type="hidden"
                name="serverKey"
                value={this.serverKey}
                onChange={() => {}}
              />
              <input
                type="hidden"
                name="loginKey"
                value={this.loginKey}
                onChange={() => {}}
              />
              <button
                disabled={this.state.isLoading}
                type="submit"
                className={styles["form__button"]}
              >
                {this.state.isLoading ? "Loading..." : "Start Session - 15 min"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default hot(module)(LoginApp);
