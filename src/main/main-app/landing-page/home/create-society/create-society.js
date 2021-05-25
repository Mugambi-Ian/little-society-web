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
import { idDate, _database } from "../../../../../config";

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
              onSubmit={(x) => {
                console.log(x);
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
                  label: "Display Info",
                  name: "step 2",
                  content: this.step3,
                  validator: () => {
                    const { society } = this.state;
                    if (this.isValidUSerName() === false) {
                      this.props.showTimedToast(
                        "Id can only contain alphanumeric characters!"
                      );
                      return false;
                    } else {
                      _database
                        .ref("society/data/")
                        .once("value", async (e) => {
                          if (e.hasChild(society.societyId)) {
                            society.societyId = idDate("demo");
                            this.setState({ society });
                            this.props.showTimedToast("Id Unavailable!");
                            return false;
                          }
                        });
                      if (this.state.society.societyName === "") {
                        this.props.showTimedToast("Name Required!");
                        return false;
                      } else {
                        return true;
                      }
                    }
                  },
                },
                {
                  label: "User Interaction",
                  name: "step 2",
                },
                {
                  label: "Finish",
                  name: "step 2",
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
}

class Step1 extends React.Component {
  render() {
    return (
      <div className="step1">
        <h1 className="unselectable">Create Your Own Society</h1>
        <div style={{ height: "50vh", alignSelf: "center" }}>
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
          <div style={{ display: "flex" }}>
            <div
              className={this.c() === "Location" ? "button on" : "button"}
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
                <h4 className="unselectable">Location Based</h4>
                <p className="unselectable">
                  Avaialble from the map based on your user requirements
                </p>
              </div>
            </div>
            <div
              className={this.c() === "Annonymous" ? "button on" : "button"}
              onClick={async () => {
                await setTimeout(() => {
                  if (this.c() === "Annonymous") {
                    this.update("");
                  } else {
                    this.update("Annonymous");
                    this.setState({
                      addLocation: undefined,
                    });
                  }
                }, 200);
              }}
            >
              <div className="lottie lock">
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
                <h4 className="unselectable">Annonymous</h4>
                <p className="unselectable">
                  All data shared will be encrypted while users identity remain
                  annoymous.
                </p>
              </div>
            </div>
            <div
              className={this.c() === "Private" ? "button on" : "button"}
              onClick={async () => {
                await setTimeout(() => {
                  if (this.c() === "Private") {
                    this.update("");
                  } else {
                    this.update("Private");
                    this.setState({
                      addLocation: undefined,
                    });
                  }
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
                <h4 className="unselectable">Private</h4>
                <p className="unselectable">
                  Share your society's link to other users and approve their
                  join requests.
                </p>
              </div>
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
              value={this.state.society.societyId}
              onChange={(e) => {
                const { society } = this.state;
                society.societyId = e.target.value;
                this.setState({ society });
              }}
              placeholder="Society Id"
            />
          </div>
        </div>
      </div>
    );
  }
}
