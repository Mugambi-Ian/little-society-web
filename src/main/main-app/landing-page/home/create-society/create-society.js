import React from "react";
import "./create-society.css";
import Lottie from "react-lottie";
import closeAnim from "../../../../../assets/animations/close.json";
import peopleAnim from "../../../../../assets/animations/people.json";
import pinAnim from "../../../../../assets/animations/location.json";
import encryptAnim from "../../../../../assets/animations/encrypt.json";
import secureAnim from "../../../../../assets/animations/secure.json";
import StepProgressBar from "react-step-progress";
import "react-step-progress/dist/index.css";
import { SelectLocation } from "../map-io/map-io";
import { ImageUploader, Input } from "../../../user-profile/user-profile";
import { _database, _storage, _auth } from "../../../../../config";

export default class CreateSociety extends React.Component {
  state = {
    currentStep: 1,
    society: {
      categoryName: "",
      societyName: "",
      societyDp: undefined,
    },
  };

  async close() {
    await setTimeout(async () => {
      this.setState({ hide: true });
      await setTimeout(() => {
        this.props.closeProcess();
      }, 500);
    }, 200);
  }
  async componentDidMount() {
    await setTimeout(() => {
      this.setState({ content: true });
    }, 1150);
  }

  step1 = (<Step1 />);
  step2 = (
    <Step2
      showTimedToast={this.props.showTimedToast}
      society={this.state.society}
      setSociety={(x) => {
        this.setState({ society: x });
      }}
      pushLocation={(e) => {
        if (e !== null) {
          const { society } = this.state;
          society.categoryName = "Location";
          society.categoryLocation = e.lat + "a#o" + e.lng;
          this.setState({ society });
        } else {
          const { society } = this.state;
          society.categoryName = "";
          society.categoryLocation = null;
          this.setState({ society });
        }
      }}
    />
  );
  step3 = (
    <Step3
      society={this.state.society}
      setSociety={(x) => {
        this.setState({ society: x });
      }}
      uploadPic={() => {
        this.setState({ uploadPic: true });
      }}
    />
  );

  isValidUSerName() {
    var regex = /^[0-9A-Za-z_-]+[0-9A-Za-z_-]*$/g;
    return regex.test(this.state.society.societyId);
  }
  render() {
    return (
      <div
        className={
          this.state.hide ? "new-society-body hide" : "new-society-body"
        }
      >
        <div className="button left" onClick={this.close.bind(this)}>
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
        {this.state.content ? (
          <div className="content">
            <StepProgressBar
              wrapperClass={"progress-bar-wrapper"}
              progressClass={"step-progress-bar"}
              stepClass={"progress-step"}
              startingStep={0}
              onSubmit={async () => {
                const { society } = this.state;
                if (!society.discord_channel) {
                  this.props.showTimedToast("Channel Link Required");
                  return false;
                } else if (!society.societyName) {
                  this.props.showTimedToast("Display Name");
                  return false;
                } else {
                  this.props.showUnTimedToast();
                  await _database.ref("society").once("value", async (e) => {
                    society.societyId = (await e.ref.push()).key;
                    if (this.state.uploadPic) {
                      await this.uploadLogo();
                    } else await this.send2Db();
                  });
                }
              }}
              steps={[
                {
                  label: "Welcome",
                  name: "step 1",
                  content: this.step1,
                },
                {
                  label: "Type",
                  name: "step 2",
                  content: this.step2,
                  validator: () => {
                    if (this.state.society.categoryName === "") {
                      this.props.showTimedToast("Select Category");
                      return false;
                    } else {
                      return true;
                    }
                  },
                },
                {
                  label: "Society Info",
                  name: "step 2",
                  content: this.step3,
                },
              ]}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
  async uploadLogo() {
    const { society } = this.state;
    const id = this.state.society.societyId + new Date().getTime();
    const uploadTask = _storage
      .ref("logos/")
      .child(id + ".jpeg")
      .put(this.state.society.societyDp);
    await uploadTask
      .on(
        "state_changed",
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(
              async function (downloadURL) {
                await setTimeout(async () => {
                  var url = "" + downloadURL;
                  society.societyDp = url;
                  this.setState({ society, uploadPic: undefined });
                  await this.send2Db();
                }, 1000);
              }.bind(this)
            )
            .catch(async (e) => {
              console.log(e);
            });
        }.bind(this)
      )
      .bind(this);
  }

  async send2Db() {
    const { society } = this.state;
    society.admin_id = _auth.currentUser.uid;
    await _database
      .ref("society")
      .child(society.societyId)
      .set({
        ...society,
      });
    await _database
      .ref(`users/data/${_auth.currentUser.uid}/societies/${society.societyId}`)
      .set(society.societyId);
    this.props.closeToast();
    await setTimeout(async () => {
      this.props.showTimedToast("Society Mapped");
      await this.close();
    }, 500);
  }
}

class Step1 extends React.Component {
  render() {
    return (
      <div className="step1">
        <h1 className="unselectable">Create Your Own Society</h1>
        <div style={{ alignSelf: "center", height: "275px", width: "550px" }}>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: peopleAnim,
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
class Step2 extends React.Component {
  state = {
    addLocation: false,
    society: this.props.society,
  };
  shouldComponentUpdate(p, u) {
    p.setSociety(u.society);
    return true;
  }
  update(x) {
    const { society } = this.props;
    society.categoryName = x;
    this.setState({ society });
  }
  c() {
    return this.state.society.categoryName;
  }
  render() {
    return (
      <>
        <div className="step2">
          <h1 className="unselectable">Select one that suits your needs</h1>
          <div
            style={{
              display: "flex",
              marginTop: "-10px",
              marginBottom: "-10px",
            }}
          >
            <div
              className={this.c() === "Location" ? "step-bt on" : "step-bt"}
              onClick={async () => {
                await setTimeout(() => {
                  if (this.c() === "Location") {
                    this.update("");
                  } else {
                    this.setState({
                      addLocation: true,
                    });
                  }
                }, 200);
              }}
            >
              <div className="lottie pin">
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: pinAnim,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
              </div>
              <h4 className="unselectable">Location Based</h4>
              <p className="unselectable">
                Avaialble from the map based on your user requirements
              </p>
            </div>
            <div
              className={this.c() === "Annonymous" ? "step-bt on" : "step-bt"}
              onClick={async () => {
                await setTimeout(() => {
                  this.props.showTimedToast("Coming Soon");
                }, 200);
              }}
            >
              <div className="lottie secure">
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: secureAnim,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
              </div>
              <h4 className="unselectable">Annonymous</h4>
              <p className="unselectable">
                All data shared will be encrypted while users identity remain
                annoymous.
              </p>
            </div>
            <div
              className={this.c() === "Private" ? "step-bt on" : "step-bt"}
              onClick={async () => {
                await setTimeout(() => {
                  this.props.showTimedToast("Coming Soon");
                }, 200);
              }}
            >
              <div className="lottie lock">
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: encryptAnim,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
              </div>
              <h4 className="unselectable">Private</h4>
              <p className="unselectable">
                Share your society's link and approve join requests.
              </p>
            </div>
          </div>
        </div>
        {this.state.addLocation === true ? (
          <SelectLocation
            close={async () => {
              this.setState({
                addLocation: undefined,
              });
            }}
            pushLocation={this.props.pushLocation}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}
class Step3 extends React.Component {
  state = {
    society: this.props.society,
  };
  shouldComponentUpdate(p, u) {
    p.setSociety(u.society);
    if (u.uploadPic === true) {
      p.uploadPic();
    }
    return true;
  }
  render() {
    return (
      <div className="step3">
        <h1 className="unselectable">Add Your Public Info</h1>
        <div className="info-div">
          <div className="pic">
            <ImageUploader
              src={() => {
                return this.state.society.dp
                  ? this.state.society.dp
                  : undefined;
              }}
              hideField={() => {
                this.setState({ hideField: true });
              }}
              showField={() => {
                this.setState({ hideField: undefined });
              }}
              updateValue={(x) => {
                const { society } = this.state;
                society.dp = x;
                fetch(x)
                  .then((res) => res.blob())
                  .then((blob) => {
                    society.societyDp = blob;
                    this.setState({ society, uploadPic: true });
                  });
              }}
            />
          </div>
          <div className="details">
            <Input
              value={this.state.society.societyName}
              onChange={(e) => {
                const { society } = this.state;
                society.societyName = e.target.value;
                this.setState({ society });
              }}
              placeholder="*Display Name"
            />
            <Input
              value={this.state.society.discord_channel}
              onChange={(e) => {
                const { society } = this.state;
                society.discord_channel = e.target.value;
                this.setState({ society });
              }}
              placeholder="*Discord Channel"
            />
          </div>
        </div>
      </div>
    );
  }
}
