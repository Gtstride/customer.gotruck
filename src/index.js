// import React from "react";
// import ReactDOM from "react-dom";
// import { createBrowserHistory } from "history";
// import { Router, Route, Switch, Redirect } from "react-router-dom";

// // core components
// import Admin from "./layouts/Admin";
// import "./assets/css/material-dashboard-react.css";

// const hist = createBrowserHistory();

// ReactDOM.render(
//   <Router history={hist}>
//     <Switch>
//       {/* <Route path="/admin" component={Admin} /> */}
//       <Route path="/" component={Admin} />

//       <Redirect from="/" to="/admin/dashboard" />
//     </Switch>
//   </Router>,
//   document.getElementById("root")
// );


import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "./layouts/Admin";
import LoginPage from "./layouts/LoginPage";
import "./assets/css/material-dashboard-react.css";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/" exact component={LoginPage} /> 
      <Route path="/admin" component={Admin} />
       <Redirect from="/" exact to="admin/dashboard" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
