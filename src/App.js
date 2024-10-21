import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import SignUp from "./components/Auth/SignUp/SignUp";
import CreateAccount from "./components/Auth/CreateAccount/CreateAccount";
import AccessAccount from "./components/Auth/AccessAccount/AccessAccount";
import UserAccount from "./components/Auth/UserAccount/UserAccount";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={CreateAccount} />
        <Route exact path="/access-account" component={AccessAccount} />
        <Route exact path="/user-account" component={UserAccount} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
      </Switch>
    </Router>
  );
}

export default App;
