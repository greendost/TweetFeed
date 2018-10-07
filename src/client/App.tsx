import React from "react";
import Header from "./components/Header";
import UserListSidePanel from "./components/UserListSidePanel";
import UserMainPanel from "./components/UserMainPanel";
import appStyles from "./styles/App.css";
import { hot } from "react-hot-loader";

const App: React.SFC<{}> = () => (
  <div className={appStyles["l-gridwrap"]}>
    <Header layoutStyle={appStyles["l-header"]} />
    <UserListSidePanel />
    <UserMainPanel />
  </div>
);

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { currentUser: '' };

//     // this.updateMainList.bind(this);

//     // this.callbacks = { updateMainList: this.updateMainList.bind(this) };
//   }

//   // updateMainList(screen_name) {
//   //   this.setState({ currentUser: screen_name });
//   // }

//   render() {
//     return (
//       <div className={appStyles['l-gridwrap']}>
//         <Header layoutStyle={appStyles['l-header']} />
//         <UserListSidePanel />
//         <UserMainPanel />
//       </div>
//     );
//   }
// }

// <UserListSidePanel callbacks={this.callbacks} />
// <UserMainPanel userName={this.state.currentUser} />
export default hot(module)(App);
