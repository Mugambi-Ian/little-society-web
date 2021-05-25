import React from "react";
import Loader from "../../assets/components/loader/loader";
import { _auth, _database } from "../../config";
import LandingPage from "./landing-page/landing-page";
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
      } else if (this.state.loading === true) {
        this.setState({ newUser: true, editProfile: true });
      }
      this.setState({ loading: false });
    });
  }
  render() {
    return (
      <>
        {this.state.loading === true ? (
          <Loader />
        ) : this.state.editProfile ? (
          <UserProfile
            newUser={this.state.newUser}
            user={this.state.user}
            closeToast={this.props.scloseToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            closeEditing={() => {
              this.setState({ editProfile: undefined });
            }}
            revokeAccess={this.props.revokeAccess}
          />
        ) : (
          <LandingPage
            user={this.state.user}
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            revokeAccess={this.props.revokeAccess}
          />
        )}
      </>
    );
  }
}
