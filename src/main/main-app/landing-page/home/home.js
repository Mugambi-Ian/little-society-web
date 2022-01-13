import React from "react";
import MapIo from "./map-io/map-io";
import "./home.css";
import Lottie from "react-lottie";
import emptyAnim from "../../../../assets/animations/empty.json";
import Loader from "../../../../assets/components/loader/loader";
import CreateSociety from "./create-society/create-society";

export default class Home extends React.Component {
  state = {
    currentShowing: "my",
    openMap: false,
  };
  componentWillUnmount() {
    if (this.state.map) this.state.map.remove();
  }

  render() {
    return (
      <div className="home-body">
        <div className={this.state.openMap === true ? "cover close" : "cover "}>
          <div style={{ width: "66vw", display: "flex", height: "100vh" }}>
            <Loader />
          </div>
        </div>
        <MapIo
          openMap={async () => {
            await setTimeout(() => {
              this.setState({ openMap: true });
            }, 3000);
          }}
          setMap={(x) => {
            this.setState({ map: x });
          }}
        />
        <div className="society-box">
          <div className="switch-bar">
            <div
              onClick={async () => {
                await setTimeout(() => {
                  if (this.state.currentShowing !== "my")
                    this.setState({ currentShowing: "my" });
                }, 200);
              }}
              className={
                this.state.currentShowing === "my"
                  ? "switch-button on"
                  : "switch-button"
              }
            >
              <img
                src={
                  require("../../../../assets/drawables/ic-icon.png").default
                }
                alt=""
                className="unselectable"
              />
              <p className="unselectable">Societies</p>
            </div>
            <div
              onClick={async () => {
                await setTimeout(() => {
                  if (this.state.currentShowing !== "recommended")
                    this.setState({ currentShowing: "recommended" });
                }, 200);
              }}
              className={
                this.state.currentShowing === "recommended"
                  ? "switch-button on"
                  : "switch-button"
              }
            >
              <img
                src={
                  require("../../../../assets/drawables/ic-recommended.png")
                    .default
                }
                alt=""
                className="unselectable"
              />
              <p className="unselectable">Recomended</p>
            </div>
          </div>
          <EmptyList />
          <div
            className="button bt"
            onClick={async () => {
              await setTimeout(() => {
                this.setState({ createSociety: true });
              }, 200);
            }}
          >
            <img
              src={
                require("../../../../assets/drawables/ic-create.png").default
              }
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Create Society</p>
          </div>
        </div>
        {this.state.createSociety ? (
          <CreateSociety
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            closeProcess={() => {
              this.setState({ createSociety: undefined });
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
export function EmptyList() {
  return (
    <div className="empty-div">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: emptyAnim,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
      />
      <p className="unselectable">Nothing Here Yet</p>
    </div>
  );
}
