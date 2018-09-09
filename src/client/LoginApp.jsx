import React, { Component } from 'react';
import Header from './components/Header';
import appStyles from './styles/LoginApp.css';
import { hot } from 'react-hot-loader';
import axios from 'axios';
import cx from 'classnames';

class LoginApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.serverKey = '';
    this.loginKey = '';
    this.getLoginKey = this.getLoginKey.bind(this);
  }

  componentDidMount() {
    this.serverKey = document.getElementById('serverKey').innerHTML;
    this.getLoginKey();
  }

  getLoginKey() {
    axios
      .get('/loginkey')
      .then(res => {
        // console.log('response from loginkey=' + JSON.stringify(res));
        this.loginKey = res.data.key;
        this.setState({ isLoading: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className={appStyles['l-gridwrap']}>
        <Header layoutStyle={appStyles['l-header']} />
        <div className={appStyles['l-mainPanel']}>
          <div className={appStyles['main-container']}>
            <p className={appStyles['para']}>
              Hi, welcome to my portfolio app: TweetFeed.
            </p>
            <p className={appStyles['para']}>
              By clicking the button below, you will activate the app, where you
              will have fifteen minutes to explore, add users, make queries,
              etc. If you like it, feel free to download a copy and use your
              personal Twitter development key (all free).
            </p>
            <form method="POST" action="/mainapp" className={appStyles['form']}>
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
                className={appStyles['button']}
              >
                {this.state.isLoading ? 'Loading...' : 'Start Session'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default hot(module)(LoginApp);
