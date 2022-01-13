import React, { Component } from "react";
import Lottie from "react-lottie";
import "./toast.css";
export default class Toast extends Component {
  constructor() {
    super();
    this.state = {
      toastLive: true,
    };
  }
  componentDidMount() {
    if (this.props.timed === true) {
      setTimeout(() => {
        this.setState({
          toastLive: false,
        });
      }, 2500);
    }
  }
  closeToast = () => {
    setTimeout(() => {
      this.props.closeToast();
    }, 450);
  };

  render() {
    if (this.state.toastLive === true) {
      return this.props.timed === true ? (
        <div className="toast">
          <div className="body">
            <div className="toast-body slide-up">
              <h4>{this.props.message}</h4>
            </div>
          </div>
          <div className="space" />
        </div>
      ) : (
        <div className="loader-toast">
          <div className="loader-toast-body">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: require("../../../assets/animations/loader.json"),
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </div>
        </div>
      );
    } else if (this.state.toastLive === false) {
      return this.props.timed === true ? (
        <div className="toast">
          <div className="body">
            <div className="toast-body slide-out">
              <h4>{this.props.message}</h4>
            </div>
          </div>
          <div className="space" />
          {this.closeToast()}
        </div>
      ) : (
        <div className="loader-toast">
          <div className="loader-toast-body">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: require("../../../assets/animations/loader.json"),
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </div>
        </div>
      );
    }
  }
}
export const toast = {
  showToast: false,
  toastMessage: "",
  toastTimed: false,
};
