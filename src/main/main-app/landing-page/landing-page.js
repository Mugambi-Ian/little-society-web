import React from "react";
import "./landing-page.css";
import { Switch, Route, Link } from "react-router-dom";
import Home from "./home/home";
import { _auth } from "../../../config";

export default class LandingPage extends React.Component {
  state = {
    currentScreen: "society",
  };
  componentDidMount() {
    let id = window.location.pathname;
    if (id.includes("mySettings") === true) {
      this.setState({ currentScreen: "mySettings" });
    } else {
      this.setState({ currentScreen: "society" });
    }
  }
  render() {
    return (
      <div className="landing-page">
        <div className="app-content">
          <Switch>
            <Route path="/" exact>
              <Home
                geojson={this.props.geojson}
                break_down={this.props.break_down}
                closeToast={this.props.closeToast}
                showTimedToast={this.props.showTimedToast}
                showUnTimedToast={this.props.showUnTimedToast}
              />
            </Route>
          </Switch>
        </div>
        <div className="nav-bar">
          <img
            src={require("../../../assets/drawables/icon.png").default}
            className="logo unselectable"
            alt=""
          />
          <div className="search-bar"></div>

          <div id="space" />
          <div id="space" />
          <div id="space" />
          <Link
            to="/"
            className={
              this.state.currentScreen === "society"
                ? "nav-item on"
                : "nav-item"
            }
            onClick={async () => {
              await setTimeout(() => {
                if (this.state.currentScreen !== "society")
                  this.setState({ currentScreen: "society" });
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-home.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Home</p>
            <span />
          </Link>
          <a
            href="/"
            className="nav-item"
            onClick={async (e) => {
              e.preventDefault();
              await setTimeout(() => {
                this.props.editProfile();
              }, 200);
            }}
          >
            <img src={this.props.user.userDp} className="unselectable" alt="" />
            <p className="unselectable">My Profile</p>
            <span />
          </a>
          <a
            href="/"
            className={
              this.state.currentScreen === "mySettings"
                ? "nav-item on"
                : "nav-item"
            }
            onClick={async (e) => {
              e.preventDefault();
              await setTimeout(() => {
                _auth.signOut().finally(() => {
                  this.props.revokeAccess();
                });
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-logout.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Logout</p>
            <span />
          </a>
        </div>
      </div>
    );
  }
}
