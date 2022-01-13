import React from "react";
import MapIo from "./map-io/map-io";
import "./home.css";
import Lottie from "react-lottie";
import emptyAnim from "../../../../assets/animations/empty.json";
import Loader from "../../../../assets/components/loader/loader";
import CreateSociety from "./create-society/create-society";
import { _database, _auth } from "../../../../config/index";

export default class Home extends React.Component {
  state = {
    currentShowing: "my",
    openMap: false,
  };
  async componentDidMount() {}
  componentWillUnmount() {
    if (this.state.map) this.state.map.remove();
  }
  sCard(data, key, admin) {
    return (
      <div className="s-card" key={key}>
        <div style={{ display: "flex" }}>
          <img
            src={data.societyDp}
            alt=""
            width="120px"
            height="120px"
            id="logo"
          />
          <div id="details">
            <h2>{data.societyName}</h2>
            <div style={{ display: "flex" }}>
              <button
                onClick={async () =>
                  await setTimeout(() => {
                    window.open(data.discord_channel, "_blank");
                  }, 300)
                }
              >
                <img
                  src={
                    require("../../../../assets/drawables/ic-discord.png")
                      .default
                  }
                  alt=""
                />
                <label>Discord</label>
              </button>
              {admin ? (
                <button
                  onClick={async () =>
                    admin
                      ? (async () => {
                          this.props.showUnTimedToast();
                          await _database
                            .ref(`society/${data.societyId}`)
                            .set(null);
                          await _database
                            .ref(
                              `users/data/${_auth.currentUser.uid}/societies/${data.societyId}`
                            )
                            .set(null);
                          this.props.closeToast();
                        })()
                      : await setTimeout(() => {}, 300)
                  }
                >
                  <img
                    src={
                      admin
                        ? require("../../../../assets/drawables/ic-delete.png")
                            .default
                        : require("../../../../assets/drawables/ic-email.png")
                            .default
                    }
                    alt=""
                  />
                  <label>{admin ? "Remove" : "Email Admin"}</label>
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { admin, recommended } = this.props.break_down;
    return (
      <div className="home-body">
        <div className={this.state.openMap === true ? "cover close" : "cover "}>
          <div style={{ width: "66vw", display: "flex", height: "100vh" }}>
            <Loader />
          </div>
        </div>
        <MapIo
          geojson={this.props.geojson}
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

          {this.state.currentShowing === "my" ? (
            admin.length !== 0 ? (
              <div className="s-list">
                {admin.map((data, i) => {
                  return this.sCard(data, i, true);
                })}
              </div>
            ) : (
              <EmptyList />
            )
          ) : recommended.length !== 0 ? (
            <div className="s-list">
              {recommended.map((data, i) => {
                return this.sCard(data, i, false);
              })}
            </div>
          ) : (
            <EmptyList />
          )}
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
