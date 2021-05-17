import React from "react";
import ReactDOM from "react-dom";
import App from "./main/main";
import { BrowserRouter as Router } from "react-router-dom";

//import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
//reportWebVitals();
