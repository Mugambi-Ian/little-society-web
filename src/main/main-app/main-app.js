import React from "react";
import Loader from "../../assets/components/loader/loader";
import { _auth, _database } from "../../config";
import "./main-app.css";
import UserProfile from "./user-profile/user-profile";

export default class MainApp extends React.Component {
  state = {
    loading: true,
  };
  async componentDidMount() {
    this.props.init();
    const uid = _auth.currentUser.uid;
    await _database.ref("users/data/" + uid).on("value", (x) => {
      if (x.hasChild("userId") === true) {
        this.setState({ user: x.val() });
      } else {
        this.setState({ createUser: true });
      }
      this.setState({ loading: false });
    });
  }
  render() {
    return (
      <>
        {this.state.loading === true ? (
          <Loader />
        ) : this.state.createUser ? (
          <UserProfile newUser={true} />
        ) : (
          ""
        )}
      </>
    );
  }
}
