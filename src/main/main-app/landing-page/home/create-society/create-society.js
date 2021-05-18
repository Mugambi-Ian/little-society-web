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

export default class CreateSociety extends React.Component {
  state = {
    currentStep: 1,
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
  step2 = (<Step2 />);
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
                  label: "Society Type",
                  name: "step 2",
                  content: this.step2,
                },
                {
                  label: "Society Info",
                  name: "step 2",
                },
                {
                  label: "User Base",
                  name: "step 2",
                },
                {
                  label: "Validity",
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
  render() {
    return (
      <div className="step2">
        <h1 className="unselectable">Select one that suits your needs</h1>
        <div style={{ display: "flex" }}>
          <div className="button">
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
          <div className="button">
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
          <div className="button">
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
                Share your society's link to other users and approve their join
                requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
