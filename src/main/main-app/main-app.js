import React from "react";
import Loader from "../../assets/components/loader/loader";
import { _auth, _database } from "../../config";
import LandingPage from "./landing-page/landing-page";
import "./main-app.css";
import UserProfile from "./user-profile/user-profile";

export default class MainApp extends React.Component {
  state = {
    loading: [true, true],
  };
  async componentDidMount() {
    this.props.init();
    const uid = _auth.currentUser.uid;
    _database.ref("society").on("value", async (x) => {
      const societies = [];
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      x.forEach((i) => {
        societies.push(i.val());
      });
      const break_down = {
        admin: [],
        recommended: [],
      };
      for (let i = 0; i < societies.length; i++) {
        const e = societies[i];
        const loc = e.categoryLocation.split("a#o");
        const admin_id = e.admin_id;
        let admin = null;
        if (admin_id && _auth.currentUser.uid !== admin_id) {
          await _database.ref(`users/data/${admin_id}`).once("value", (r) => {
            const { email, fullName, userDp } = r.val();
            geojson.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [loc[1], loc[0]],
              },
              properties: {
                title: e.societyName,
                description: e.discord_channel,
                icon: e.societyDp,
                admin: { email, fullName, userDp },
              },
            });
            break_down.recommended.push(e);
            this.setState({ geojson, break_down });
          });
        } else {
          await setTimeout(() => {
            if (!admin_id) {
              break_down.recommended.push(e);
            } else {
              break_down.admin.push(e);
            }
            geojson.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [loc[1], loc[0]],
              },
              properties: {
                title: e.societyName,
                description: e.discord_channel,
                icon: e.societyDp,
                admin,
              },
            });
          }, 10);
        }
      }
      const { loading } = this.state;
      loading[0] = false;
      this.setState({ loading, societies, geojson, break_down });
    });

    await _database.ref("users/data/" + uid).on("value", (x) => {
      const { loading } = this.state;

      console.log(x.child("userId").val());
      if (x.hasChild("userId")) {
        this.setState({ user: x.val() });
      } else if (loading[1]) {
        this.setState({ newUser: true, editProfile: true });
      }
      loading[1] = false;
      this.setState({ loading });
    });
  }
  render() {
    const loading = () => {
      for (let i = 0; i < this.state.loading.length; i++) {
        const e = this.state.loading[i];
        if (e) return true;
      }
      return false;
    };
    return (
      <>
        {loading() ? (
          <Loader />
        ) : this.state.editProfile ? (
          <UserProfile
            newUser={this.state.newUser}
            user={this.state.user}
            closeToast={this.props.scloseToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            closeEditing={() => {
              this.setState({ editProfile: undefined });
            }}
            revokeAccess={this.props.revokeAccess}
          />
        ) : (
          <LandingPage
            user={this.state.user}
            geojson={this.state.geojson}
            societies={this.state.societies}
            break_down={this.state.break_down}
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            revokeAccess={this.props.revokeAccess}
            editProfile={() => {
              this.setState({ editProfile: true });
            }}
          />
        )}
      </>
    );
  }
}
