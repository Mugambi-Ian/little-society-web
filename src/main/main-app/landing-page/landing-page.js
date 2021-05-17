import React from "react";
import "./landing-page.css";
import { Switch, Route, Link } from "react-router-dom";
import Home from "./home/home";

export default class LandingPage extends React.Component {
  state = {
    currentScreen: "society",
  };
  componentDidMount() {
    let id = window.location.pathname;
    if (id.includes("myFeed") === true) {
      this.setState({ currentScreen: "myFeed" });
    } else if (id.includes("myConversations") === true) {
      this.setState({ currentScreen: "myConversations" });
    } else if (id.includes("myProfile") === true) {
      this.setState({ currentScreen: "myProfile" });
    } else if (id.includes("mySettings") === true) {
      this.setState({ currentScreen: "mySettings" });
    } else {
      this.setState({ currentScreen: "society" });
    }
    console.log(id);
  }
  render() {
    return (
      <div className="landing-page">
        <div className="app-content">
          <Switch>
            <Route path="/" exact>
              <Home />
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
          <Link
            to="/myFeed"
            className={
              this.state.currentScreen === "myFeed" ? "nav-item on" : "nav-item"
            }
            onClick={async () => {
              await setTimeout(() => {
                if (this.state.currentScreen !== "myFeed")
                  this.setState({ currentScreen: "myFeed" });
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-feed.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Feed</p>
            <span />
          </Link>
          <Link
            to="myConversations"
            className={
              this.state.currentScreen === "myConversations"
                ? "nav-item c on"
                : "nav-item c "
            }
            onClick={async () => {
              await setTimeout(() => {
                if (this.state.currentScreen !== "myConversations")
                  this.setState({ currentScreen: "myConversations" });
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-messages.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Conversations</p>
            <span />
          </Link>
          <Link
            to="myProfile"
            className={
              this.state.currentScreen === "myProfile"
                ? "nav-item on"
                : "nav-item"
            }
            onClick={async () => {
              await setTimeout(() => {
                if (this.state.currentScreen !== "myProfile")
                  this.setState({ currentScreen: "myProfile" });
              }, 200);
            }}
          >
            <img
              src={this.props.user.userDp}
              className="unselectable"
              alt=""
              style={{ borderRadius: "100px" }}
            />
            <p className="unselectable">{this.props.user.userName}</p>
            <span />
          </Link>
          <Link
            to="/mySettings"
            className={
              this.state.currentScreen === "mySettings"
                ? "nav-item on"
                : "nav-item"
            }
            onClick={async () => {
              await setTimeout(() => {
                if (this.state.currentScreen !== "mySettings")
                  this.setState({ currentScreen: "mySettings" });
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-settings.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Settings</p>
            <span />
          </Link>
        </div>
      </div>
    );
  }
}
