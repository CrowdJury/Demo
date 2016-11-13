
//React ,router and history
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute } from "react-router";
import createHashHistory from 'history/lib/createHashHistory';

//Views
import Layout from "./Layout";

import Login from "./views/Login";
import Register from "./views/Register";
import CreateAccount from "./views/CreateAccount";

import Home from "./views/Home";

import Accounts from "./views/Accounts";

import Admin from "./views/Admin";

//Actions
import * as Actions from "./actions";

//Store
import Store from "./Store";

Actions.Config.configure(Store.web3Provider);

//CSS
require('../node_modules/bootstrap/dist/css/bootstrap.css');
require('../node_modules/react-select/dist/react-select.css');
require('../node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.css');
require('../node_modules/bootstrap-material-design/dist/css/ripples.min.css');
require('font-awesome-webpack');
require('./css/all.css');

//Set history
const history = createHashHistory({ queryKey: false })
const app = document.getElementById('app');


//Set router
ReactDOM.render(
  <Router history={history}>
    <Route path="/" component={Layout}>

        <IndexRoute component={Login}></IndexRoute>

        <Route path="/login" name="login" component={Login}></Route>
        <Route path="/register" name="register" component={Register}></Route>
        <Route path="/createAccount" name="createAccount" component={CreateAccount}></Route>

        <Route path="/home" name="home" component={Home}></Route>

        <Route path="/accounts" name="accounts" component={Accounts}></Route>

        <Route path="/admin" name="admin" component={Admin}></Route>

    </Route>
  </Router>,
app);
