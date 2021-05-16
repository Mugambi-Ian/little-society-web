/* eslint-disable no-restricted-globals */
import React, { Component } from "react";
import "./main-auth.css";
import { _auth, _firebase } from "../../config/index";
import TypeWritter from "../../assets/components/type/type";
import Lottie from "react-lottie";
import loginAnim from "../../assets/animations/login.json";
import blogAnim from "../../assets/animations/blogging.json";
export default class Login extends Component {
  componentDidMount() {
    this.props.init();
  }
  signInWithFacebook() {
    var provider = new _firebase.auth.FacebookAuthProvider();
    _auth
      .signInWithPopup(provider)
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
          <div className="animation">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: loginAnim,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              height={300}
              width={400}
            />
          </div>
          <div className="animation right">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: blogAnim,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              height={300}
              width={400}
            />
          </div>

          <TypeWritter />
          <h1>Sign In To Proceed</h1>
          <h2>We made this easy for you</h2>
          <div
            className="button"
            onClick={async () => {
              await setTimeout(() => {
                this.signInWithGoogle();
              }, 250);
            }}
          >
            <img
              src={require("../../assets/drawables/ic-twitter.png").default}
              alt=" "
              className="unselectable"
            />
            <p className="unselectable">Sign In With Twitter</p>
          </div>
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
          <div
            className="button"
            onClick={async () => {
              await setTimeout(() => {
                this.signInWithFacebook();
              }, 250);
            }}
          >
            <img
              src={require("../../assets/drawables/ic-facebook.png").default}
              alt=" "
              className="unselectable"
            />
            <p className="unselectable">Sign In With Facebook</p>
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
