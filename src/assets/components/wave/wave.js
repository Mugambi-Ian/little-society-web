import React from "react";
import "./wave.css";

export default class WaveBackground extends React.Component {
  render() {
    return (
      <div class="ocean">
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
    );
  }
}
