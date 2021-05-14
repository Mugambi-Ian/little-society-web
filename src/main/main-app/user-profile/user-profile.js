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
import { validField, _database, _storage } from "../../../config";

var src = "";
export default class UserProfile extends React.Component {
  state = {
    user: {
      userDp: "",
      userName: "",
      userAge: "",
      userId: "",
      userGender: "",
    },
  };
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
                  user.productDp = url;
                  this.setState({ user, uploadPic: undefined });
                  this.saveProduct();
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
    const { createdOn, userAge, userId, userDp, userGender, userName } =
      this.state.user;
    if (validField(userAge) && validField(userName) && validField(userGender)) {
      await _database.ref("users/data/" + userId).once("value", async (x) => {
        await x.ref.child("userDp").set(userDp);
        await x.ref.child("userId").set(userId);
        await x.ref.child("userAge").set(userAge);
        await x.ref.child("userGender").set(userGender);
        await x.ref.child("userName").set(userName);
        await x.ref.child("createdOn").set(createdOn);
      });
      this.props.showTimedToast("Save Successfull");
    } else {
      this.props.showTimedToast("All fields are required");
    }
  }

  render() {
    return (
      <div className="profile-body">
        <h1>My Profile</h1>
        <h2>Fill out your details</h2>
        <span className="line" />
        <div className="info-div">
          <div className="pic">
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
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.user.userGender}
                onChange={(e)}
              >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
                <MenuItem value={3}>Non-Binary</MenuItem>
                <MenuItem value={4}>Rather Not Say</MenuItem>
                <MenuItem value={undefined}>----</MenuItem>
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
              date={new Date()}
              onChange={(date) => {
                console.log(date);
              }}
            />
          </div>
        </div>
        {this.props.newUser === true ? (
          ""
        ) : (
          <div className="button left">
            <img
              src={require("../../../assets/drawables/ic-close.png").default}
              alt=" "
              className="unselectable"
            />
            <p className="unselectable">Close</p>
          </div>
        )}
        <div
          className="button right"
          onClick={async () => {
            await setTimeout(() => {
              this.updateUser();
            }, 200);
          }}
        >
          <img
            src={require("../../../assets/drawables/ic-save.png").default}
            alt=" "
            className="unselectable"
          />
          <p className="unselectable">Save</p>
        </div>
      </div>
    );
  }
}

export const ImageUploader = (props) => {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
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
        src = undefined;
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
        <div className="upload-img">
          <p className="unselectable">Click to upload Image</p>
          <img
            ref={uploadedImage}
            onClick={() => imageUploader.current.click()}
            alt="product-Logo"
            src={require("../../../assets/drawables/ic-camera.png").default}
          />
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
      ) : props.src() ? (
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
        <div className="upload-img">
          <p className="unselectable">Click to upload Image</p>
          <img
            ref={uploadedImage}
            onClick={() => imageUploader.current.click()}
            alt="product-Logo"
            src={require("../../../assets/drawables/ic-camera.png").default}
          />
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
