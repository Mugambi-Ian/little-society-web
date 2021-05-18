import React from "react";
import { MAPBOX_KEY } from "../../../../../config/config";
import "./map-io.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
const mapboxgl = require("!mapbox-gl/dist/mapbox-gl.js");

mapboxgl.accessToken = MAPBOX_KEY;

export default class MapInterface extends React.Component {
  state = {};
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/nenecorp/ckos67ili0d2118l9gv3yfd14",
      latitude: 0,
      longitude: 0,
      zoom: 1.5,
    });
    this.map.once("zoomend", (e) => {
      this.props.openMap();
    });
    let e = "geolocation" in navigator;
    navigator.permissions.query({ name: "geolocation" }).then((x) => {
      if (x.state !== "granted") {
        e = false;
      }
    });

    if (e === true) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude,
          lng = position.coords.longitude;
        this.map.setCenter([lng, lat]);
        this.map.zoomTo(5);
      });
    } else {
      this.map.zoomTo(5);
    }

    this.props.setMap(this.mapl);
  }

  render() {
    return <div className="map-div" ref={(el) => (this.mapContainer = el)} />;
  }
}
