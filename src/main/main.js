/* eslint-disable no-restricted-globals */
import React, { Component } from "react";
import Loader from "../assets/components/loader/loader";
import Toast, { toast } from "../assets/components/toast/toast";
import { _auth } from "../config";
import MainApp from "./main-app/main-app";
import Login from "./main-auth/main-auth";
import Splash from "./main-splash/main-splash";
import "./main.css";
export default class App extends Component {
  state = {
    authenticated: false,
    loading: true,
    activeSplash: true,
    hideSplash: false,
    authBypass: false,
    toast: toast,
    dialog: {
      open: false,
      message:
        " authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false,",
      cancelFunc: undefined,
      confirmFunc: undefined,
      title: "authBypass",
    },
  };

  async componentDidMount() {
    await _auth.onAuthStateChanged(async (u) => {
      if (this.state.authBypass === false) {
        if (u) {
          this.setState({ authenticated: true });
        }
      }
      this.setState({ loading: false });
    });
  }
  showTimedToast(message) {
    const toast = {
      showToast: true,
      toastMessage: message,
      toastTimed: true,
    };
    this.setState({ toast: toast });
  }
  showUnTimedToast() {
    const toast = {
      showToast: true,
      toastTimed: false,
    };
    this.setState({ toast: toast });
  }
  closeToast() {
    const toast = {
      showToast: false,
      toastMessage: this.state.toast.toastMessage,
      toastTimed: true,
    };
    this.setState({ toast: toast });
  }
  render() {
    return (
      <>
        {this.state.activeSplash === true ? (
          ""
        ) : this.state.loading === true ? (
          <Loader />
        ) : this.state.authenticated === true ? (
          <MainApp
            init={() => {
              this.setState({ authBypass: true });
            }}
            revokeAccess={() => {
              this.setState({ authenticated: false });
            }}
            closeToast={this.closeToast.bind(this)}
            showTimedToast={this.showTimedToast.bind(this)}
            showUnTimedToast={this.showUnTimedToast.bind(this)}
            openDialog={(title, message, confirmFunc, cancelFunc) => {
              const t = {
                open: true,
                message: message,
                cancelFunc: cancelFunc,
                confirmFunc: confirmFunc,
                title: title,
              };
              this.setState({ dialog: t });
            }}
          />
        ) : (
          <Login
            init={() => {
              this.setState({ authBypass: true });
            }}
            authorizeUser={() => {
              this.setState({ authenticated: true });
            }}
            closeToast={this.closeToast.bind(this)}
            showTimedToast={this.showTimedToast.bind(this)}
            showUnTimedToast={this.showUnTimedToast.bind(this)}
          />
        )}
        {this.state.toast.showToast ? (
          <Toast
            timed={this.state.toast.toastTimed}
            message={this.state.toast.toastMessage}
            closeToast={this.closeToast.bind(this)}
          />
        ) : (
          ""
        )}
        {this.state.hideSplash === false ? (
          <Splash
            closeSplash={() => {
              this.setState({ activeSplash: false });
            }}
            hideSplash={() => {
              this.setState({ hideSplash: true });
            }}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}
