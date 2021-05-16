import React, { Component } from "react";
import "./main-splash.css";
export default class Splash extends Component {
  state = {
    animIn: true,
  };

  async componentDidMount() {
    await setTimeout(async () => {
      this.setState({ animIn: false });
      this.props.closeSplash();
      await setTimeout(async () => {
        this.props.hideSplash();
      }, 1400);
    }, 2500);
  }
  render() {
    return (
      <div
        className={
          this.state.animIn === true ? "splash-body" : "splash-body close"
        }
      >
        <img alt="" src={require("../../assets/drawables/logo.png").default} />
      </div>
    );
  }
}
