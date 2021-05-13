import React, { Component } from "react";
import "./main-splash.css";
export default class Splash extends Component {
  state = {
    animIn: true,
  };

  async componentDidMount() {
    await setTimeout(async () => {
      this.setState({ animIn: false });
      await setTimeout(async () => {
        this.props.closeSplash();
        await setTimeout(() => {
          this.props.hideSplash();
        }, 900);
      }, 500);
    }, 2500);
  }
  render() {
    return (
      <div
        className={
          this.state.animIn === true ? "splash-body" : "splash-body close"
        }
      >
        <img alt="" src={require("../../assets/drawables/icon.png").default} />
      </div>
    );
  }
}
