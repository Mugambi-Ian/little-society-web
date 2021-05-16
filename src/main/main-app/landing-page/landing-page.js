import React from "react";
import "./landing-page.css";
export default class LandingPage extends React.Component {
  render() {
    return (
      <div className="home-body">
        <div className="nav-bar">
          <div
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
              src={require("../../../assets/drawables/ic-close.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Society</p>
          </div>
        </div>
        <div className="nav-bar">
          <div
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
              src={require("../../../assets/drawables/ic-close.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">My Feed</p>
          </div>
        </div>
        <div className="nav-bar">
          <div
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
              src={require("../../../assets/drawables/ic-close.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Conversations</p>
          </div>
        </div>
        <div className="nav-bar">
          <div
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
              src={require("../../../assets/drawables/ic-close.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">My profile</p>
          </div>
        </div>
        <div className="nav-bar">
          <div
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
              src={require("../../../assets/drawables/ic-close.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Log Out</p>
          </div>
        </div>
      </div>
    );
  }
}
