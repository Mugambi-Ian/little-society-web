/* eslint-disable no-restricted-globals */
import React, { Component } from "react";
import "./main-auth.css";
import { _auth, _firebase } from "../../config/index";
import TypeWritter from "../../assets/components/type/type";

export default class Login extends Component {
  componentDidMount() {
    this.props.init();
  }
  signInWithGoogle = () => {
    const googleProvider = new _firebase.auth.GoogleAuthProvider();
    _auth
      .signInWithPopup(googleProvider)
      .then((res) => {
        console.log(res);
        if (res) {
          this.props.showTimedToast("Sign In Successfull");
          this.props.authorizeUser();
        }
      })
      .catch((error) => {
        this.props.showTimedToast("Sign In Failed");
        console.log(error);
      });
  };

  render() {
    return (
      <>
        <div className="login-body">
          <TypeWritter />
          <h1>Sign In To Proceed</h1>
          <h2>We make this easy for you</h2>
          <div
            className="button"
            onClick={async () => {
              await setTimeout(() => {
                this.signInWithGoogle();
              }, 250);
            }}
          >
            <img
              src={require("../../assets/drawables/ic-google.png").default}
              alt=" "
              className="unselectable"
            />
            <p className="unselectable">Sign In With Google</p>
          </div>
          <img
            src={require("../../assets/drawables/logo.png").default}
            alt=""
            className="logo unselectable"
          />
        </div>
      </>
    );
  }
}
