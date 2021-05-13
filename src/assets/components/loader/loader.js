import React, { Component } from "react";
import "./loader.css";
export default class Loader extends Component {
  render() {
    return (
      <div class="peeek-loading">
        <loader>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
          <loaderitem></loaderitem>
        </loader>
      </div>
    );
  }
}
