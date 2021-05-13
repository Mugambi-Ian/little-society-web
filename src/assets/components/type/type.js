import React from "react";
import "./type.css";

export default class TypeWritter extends React.Component {
  render() {
    return (
      <div class="typewriter">
        <div class="slide">
          <i></i>
        </div>
        <div class="paper"></div>
        <div class="keyboard"></div>
      </div>
    );
  }
}
