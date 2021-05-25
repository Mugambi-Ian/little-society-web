/* eslint-disable import/no-webpack-loader-syntax */
import React from "react";
import Lottie from "react-lottie";
import { MAPBOX_KEY } from "../../../../../config/config";
import "./map-io.css";
import checkAnim from "../../../../../assets/animations/check.json";
import closeAnim from "../../../../../assets/animations/close.json";
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

export class SelectLocation extends React.Component {
  state = {};
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/nenecorp/ckos67ili0d2118l9gv3yfd14",
      latitude: 0,
      longitude: 0,
      zoom: 1,
    });
    let e = "geolocation" in navigator;
    navigator.permissions.query({ name: "geolocation" }).then((x) => {
      if (x.state !== "granted") {
        e = false;
      }
    });

    this.map.on("click", (e) => {
      if (this.circleMarker !== undefined) {
        this.circleMarker.remove();
      }
      this.props.pushLocation(e.lngLat);
      this.circleMarker = new mapboxgl.Marker({
        color: "#FFFFFF",
        draggable: true,
      })
        .setLngLat(e.lngLat)
        .addTo(this.map);
    });
    if (e === true) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude,
          lng = position.coords.longitude;
        this.map.setCenter([lng, lat]);
        this.map.zoomTo(5);
      });
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const { closeListener } = this.props;
    const { close } = this.state;
    return (
      <div
        className={closeListener || close ? "select-map close" : "select-map"}
      >
        <div
          className="select-map-div"
          ref={(el) => (this.mapContainer = el)}
        />
        <div
          className="button right"
          onClick={async () => {
            await setTimeout(async () => {
              this.setState({ close: true });
              await setTimeout(() => {
                this.props.close();
              }, 500);
            }, 200);
          }}
        >
          <div className="lottie">
            <Lottie
              options={{
                loop: 2,
                autoplay: true,
                animationData: checkAnim,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </div>
        </div>
        <div
          className="button left"
          onClick={async () => {
            await setTimeout(async () => {
              this.setState({ close: true });
              this.props.pushLocation(null);
              await setTimeout(() => {
                this.props.close();
              }, 500);
            }, 200);
          }}
        >
          <div className="lottie">
            <Lottie
              options={{
                loop: 2,
                autoplay: true,
                animationData: closeAnim,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
