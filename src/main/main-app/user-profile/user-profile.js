import React from "react";
import "./user-profile.css";
import Slider from "@material-ui/core/Slider";
import getCroppedImg from "../../../assets/resources/create-image";
import Cropper from "react-easy-crop";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import Lottie from "react-lottie";
import pictureAnim from "../../../assets/animations/picture.json";
import saveAnim from "../../../assets/animations/save.json";
import signOutAnim from "../../../assets/animations/log-out.json";
import signUpAnim from "../../../assets/animations/signup.json";
import launchAnim from "../../../assets/animations/launch.json";
import {
  dateToday,
  validField,
  _auth,
  _database,
  _storage,
} from "../../../config";
import Loader from "../../../assets/components/loader/loader";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAP_KEY } from "../../../config/config";

export default class UserProfile extends React.Component {
  state = {
    loading: true,
    recap: undefined,
    user: {
      userDp: "",
      userName: "",
      userAge: "",
      userId: _auth.currentUser.uid,
      userGender: "__",
      phoneNumber: "",
      email: "",
      fullName: "",
    },
  };
  async componentWillMount() {
    var { user } = this.state;
    if (this.props.newUser === true) {
      user.createdOn = dateToday();
      user.userName = _auth.currentUser.email.split("@")[0];
      user.fullName = _auth.currentUser.displayName;
    } else {
      user = this.props.user;
    }
    this.setState({ user, loading: false });
  }
  //-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz
  isValidUSerName() {
    var regex = /^[0-9A-Za-z_-]+[0-9A-Za-z_-]*$/g;
    return regex.test(this.state.user.userName);
  }
  async uploadDp() {
    this.setState({ loading: true });
    const id = this.state.user.userId + new Date().getTime();
    const uploadTask = _storage
      .ref("user/")
      .child(id + ".jpeg")
      .put(this.state.user.userDp);
    await uploadTask
      .on(
        "state_changed",
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(
              async function (downloadURL) {
                await setTimeout(() => {
                  var url = "" + downloadURL;
                  const { user } = this.state;
                  user.userDp = url;
                  this.setState({ user, uploadPic: undefined });
                  this.syncUser();
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

  async updateUser() {
    var { userAge, userGender, userName, phoneNumber, email, fullName } =
      this.state.user;
    if (this.state.dateSelected) {
      const x = this.state.dateSelected;
      userAge = x.getFullYear() + "-" + x.getMonth() + "-" + x.getDate();
    }
    if (this.isValidUSerName() === false) {
      this.props.showTimedToast("Use alphanumeric characters for a username.");
    } else if (
      validField(userAge) &&
      userGender !== "__" &&
      validField(phoneNumber) &&
      validField(fullName) &&
      validField(email)
    ) {
      await _database.ref("users/social/" + userName).once("value", (x) => {
        console.log(x.val());
        if (x.val() == null || x.val() === _auth.currentUser.uid) {
          if (this.state.uploadPic) {
            this.uploadDp();
          } else {
            this.syncUser();
          }
        } else {
          this.props.showTimedToast("This username is unavailble");
        }
      });
    } else {
      this.props.showTimedToast("All fields are required");
    }
  }
  async syncUser() {
    var { user } = this.state;
    if (this.state.dateSelected) {
      const x = this.state.dateSelected;
      user.userAge = x.getFullYear() + "-" + x.getMonth() + "-" + x.getDate();
    }
    this.setState({ loading: true });
    const x = _database.ref("users/data/" + user.userId);
    x.set(user);
    await _database
      .ref("users/social/" + user.userName)
      .set(_auth.currentUser.uid);
    this.setState({ loading: false });
    this.props.showTimedToast("Save Successfull");
    this.props.closeEditing();
  }

  render() {
    return (
      <div style={{ backgroundColor: "#fff", animation: "fade-in .3s both" }}>
        {this.state.loading === true ? (
          ""
        ) : (
          <>
            <div className="launch-anim right">
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: signUpAnim,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
              />
            </div>
          </>
        )}
        <div className="profile-body">
          {this.state.loading === true ? (
            <Loader />
          ) : (
            <>
              <div>
                <ReCAPTCHA
                  size="invisible"
                  sitekey={RECAP_KEY}
                  onChange={(e) => {
                    this.setState({ recap: e });
                  }}
                  onExpired={() => {
                    this.setState({ recap: undefined });
                  }}
                />
              </div>
              <h1>My Profile</h1>
              <h2>Fill out your details</h2>
              <span className="line" />
              <div className="info-div">
                <div className="pic" style={{ marginRight: "40px" }}>
                  <ImageUploader
                    src={() => {
                      return this.state.user.userDp === ""
                        ? undefined
                        : this.state.user.userDp;
                    }}
                    hideField={() => {
                      this.setState({ hideField: true });
                    }}
                    showField={() => {
                      this.setState({ hideField: undefined });
                    }}
                    updateValue={(x) => {
                      fetch(x)
                        .then((res) => res.blob())
                        .then((blob) => {
                          const { user } = this.state;
                          user.userDp = blob;
                          this.setState({ user, uploadPic: true });
                        });
                    }}
                  />
                </div>
                <div className="details">
                  <Input
                    value={this.state.user.userName}
                    onChange={(e) => {
                      const { user } = this.state;
                      user.userName = e.target.value;
                      this.setState({ user });
                    }}
                    placeholder="User Name"
                  />
                  <Input
                    value={this.state.user.fullName}
                    onChange={(e) => {
                      const { user } = this.state;
                      user.fullName = e.target.value;
                      this.setState({ user });
                    }}
                    placeholder="Full Name"
                  />
                  <Input
                    value={this.state.user.phoneNumer}
                    onChange={(e) => {
                      const { user } = this.state;
                      user.phoneNumber = e.target.value;
                      this.setState({ user });
                    }}
                    placeholder="Phone Number"
                  />
                  <Input
                    value={this.state.user.email}
                    onChange={(e) => {
                      const { user } = this.state;
                      user.email = e.target.value;
                      this.setState({ user });
                    }}
                    placeholder="Email Address"
                  />
                  <FormControl style={{ marginTop: "20px" }}>
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={this.state.user.userGender}
                      onChange={(e) => {
                        const { user } = this.state;
                        user.userGender = e.target.value;
                        this.setState({ user });
                      }}
                    >
                      <MenuItem value={1}>Male</MenuItem>
                      <MenuItem value={2}>Female</MenuItem>
                      <MenuItem value={3}>Non-Binary</MenuItem>
                      <MenuItem value={4}>Rather Not Say</MenuItem>
                      <MenuItem value="__">----</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div
                  style={{
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p className="f-t unselectable">Date Of Birth</p>
                  <Calendar
                    date={this.state.dateSelected}
                    onChange={(date) => {
                      this.setState({ dateSelected: date });
                    }}
                    maxDate={new Date()}
                  />
                </div>
              </div>
              <div
                className="button right"
                onClick={async () => {
                  await setTimeout(() => {
                    this.updateUser();
                  }, 200);
                }}
              >
                <p className="unselectable">Save</p>
              </div>
              {this.props.newUser === true ? (
                <div
                  className="button left"
                  onClick={async () => {
                    await setTimeout(() => {
                      _auth.signOut().then(() => {
                        this.props.revokeAccess();
                      });
                    }, 200);
                  }}
                >
                  <p className="unselectable">Sign Out</p>
                </div>
              ) : (
                <div
                  className="button left"
                  onClick={async () => {
                    await setTimeout(() => {
                      this.props.closeEditing();
                    }, 200);
                  }}
                >
                  <p className="unselectable">Close</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export const ImageUploader = (props) => {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [src, setSrc] = React.useState(props.src());
  const [updated, setUpdated] = React.useState(false);
  const [image, setImage] = React.useState(undefined);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [cropped, setCropped] = React.useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const aspect = 1 / 1;
  function onCropChange(crop) {
    setCrop(crop);
  }

  const onCropComplete = React.useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  function onZoomChange(zoom) {
    setZoom(zoom);
  }
  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        setSrc(undefined);
        current.src = e.target.result;
        setUpdated(true);
        setImage(e.target.result);
        setCropped(false);
      };
      reader.readAsDataURL(file);
    }
  };
  const showCroppedImage = React.useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
      props.updateValue(croppedImage);
      setImage(croppedImage);
      setSrc(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, image, props]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={imageUploader}
        style={{
          display: "none",
        }}
      />
      {updated === false && src === undefined ? (
        <div
          className="upload-img"
          onClick={() => imageUploader.current.click()}
        >
          <p className="unselectable">Click to upload Image</p>
          <lottie>
            <Lottie
              ref={uploadedImage}
              options={{
                loop: true,
                autoplay: true,
                animationData: pictureAnim,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </lottie>
        </div>
      ) : cropped === false && src === undefined ? (
        <div className="crop-image-body">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => onZoomChange(zoom)}
            classes={{ container: "slider" }}
          />
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={onZoomChange}
          />
          <div
            style={{
              display: "flex",
              position: "fixed",
              bottom: "10vh",
              left: 0,
              right: 0,
              margin: "auto",
              alignSelf: "center",
              maxHeight: "40px",
              maxWidth: "500px",
            }}
          >
            <div
              className="button"
              style={{ flex: 1 }}
              onClick={async () => {
                await setTimeout(() => {
                  setCropped(false);
                  setImage(undefined);
                  setUpdated(false);
                  props.showField();
                }, 100);
              }}
            >
              <img
                src={require("../../../assets/drawables/ic-close.png").default}
                alt=""
                draggable={false}
                className="unselectable"
              />
              <p className="unselectable">Cancel</p>
            </div>
            <div
              className="button"
              style={{ flex: 1 }}
              onClick={async () => {
                await showCroppedImage();
                await setTimeout(() => {
                  setCropped(true);
                  setUpdated(true);
                  props.showField();
                }, 100);
              }}
            >
              <img
                src={require("../../../assets/drawables/ic-crop.png").default}
                alt=""
                draggable={false}
                className="unselectable"
              />
              <p className="unselectable">Crop</p>
            </div>
          </div>
        </div>
      ) : src ? (
        <img
          ref={uploadedImage}
          alt=""
          className="img-upload unselectable"
          draggable={false}
          src={image !== undefined ? image : props.src()}
          onClick={async () => {
            await setTimeout(() => {
              imageUploader.current.click();
            }, 100);
          }}
        />
      ) : (
        <div
          className="upload-img"
          onClick={() => imageUploader.current.click()}
        >
          <p className="unselectable">Click to upload Image</p>
          <lottie>
            <Lottie
              ref={uploadedImage}
              options={{
                loop: true,
                autoplay: true,
                animationData: pictureAnim,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </lottie>
        </div>
      )}
    </div>
  );
};
export class Input extends React.Component {
  render() {
    return (
      <div
        className={
          this.props.center === true
            ? "form__group field center-center"
            : "form__group field"
        }
      >
        <input
          className="form__field"
          placeholder={this.props.placeholder}
          required
          onChange={(e) => {
            this.props.onChange(e);
          }}
          value={this.props.value}
        />
        <label for="name" className="form__label">
          {this.props.placeholder}
        </label>
      </div>
    );
  }
}
