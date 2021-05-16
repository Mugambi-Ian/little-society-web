import React, { Component } from "react";
import "./loader.css";
import Lottie from "react-lottie";
import loadingAnim from "../../../assets/animations/loader.json";
export default class Loader extends Component {
  render() {
    return (
      <div class="peeek-loading">
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: loadingAnim,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
        />
      </div>
    );
  }
}
