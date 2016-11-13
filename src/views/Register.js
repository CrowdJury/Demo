import React from 'react';
import {Link} from "react-router";

import Select from 'react-select';
import async from 'async';

import Store from "../Store";
import * as Actions from "../actions";
import Loader from "../components/Loader";
import Modal from '../components/Modal';
import Input from "../components/Input";

export default class Register extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: false
        }
    }

    componentWillMount() {
        var self = this;
        console.log(Store.contracts);
        console.log(Store.getContract('Crowdjury'));
    }

    register(){
        var self = this;
        if (
            self._username.isValid() && self._password.isValid()
            && self._userAccount.isValid() && (self.state._userPassword != "")
        ){
            var username = self._username.getValue();
            var password = self._password.getValue();
            var userPassword = self._userPassword.getValue();
            var userAccount = self._userAccount.getValue();
            self.setState({loading: true});
            Actions.Account.unlockAccount({
                password: userPassword,
                data: userAccount
            }, function(err, decryptedAccount){
                var payloadData = Actions.Ethereum.buildFunctionData([
                    username, password
                ], 'register', Store.contracts.Crowdjury.interface)
                var registerTx = Actions.Ethereum.buildTX({
                    to: Store.contracts.Crowdjury.address,
                    from : decryptedAccount.address,
                    data: payloadData
                });
                Actions.Account.sign({
                    password: userPassword,
                    data: userAccount
                },
                registerTx,
                function(err, signedTX){
                    Actions.Ethereum.sendTXs([signedTX], function(err){
                        if (err){
                            var modalBody =
                                <div class="row modalBody">
                                    <div class="col-xs-12 text-center margin-bottom">
                                        {err}
                                    </div>
                                </div>;
                            self.setState({loading: false});
                            self._modal.setState({open: true, title: 'Error', body: modalBody});
                        } else {
                            var modalBody =
                                <div class="row modalBody">
                                    <div class="col-xs-12 text-center margin-bottom">
                                        New user registered:
                                        <br/><strong>{username}</strong><br></br>
                                    </div>
                                </div>;
                            self.setState({loading: false});
                            self._modal.setState({open: true, title: 'User Registered', body: modalBody});
                        }
                    });
                });
            });
        }
    }

    render() {
        var self = this;
        return(
            <div>
                { self.state.loading ?
                    <Loader />
                :
                <div>
                    <div class="col-xs-12 text-center">
                        <h1 class="title">Register</h1>
                    </div>
                    <form class="col-xs-8 col-xs-offset-2">
                        <Input
                            ref={(c) => this._username = c}
                            type='text'
                            regex="^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœñÑ ]{4,}$"
                            title='Crowdjury Username'
                            placeholder='Username'
                        />
                        <Input
                            ref={(c) => this._password = c}
                            type='password'
                            regex="^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœñÑ$@$!%*?&#_~]{6,}$"
                            title='Crowdjury Password'
                            placeholder='Password'
                        />
                        <Input
                            ref={(c) => this._userAccount = c}
                            type='account'
                            regex="^[a-zA-Z0-9+/\r\n]+={0,2}$"
                            title='Account Data'
                            placeholder='Account'
                        />
                        <Input
                            ref={(c) => this._userPassword = c}
                            regex="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#_~])[A-Za-z0-9$@$!%*?&#_~]{8,}"
                            type='password'
                            title='Account Password'
                            placeholder='Password'
                        />
                        <div class="row text-center">
                            <button type="submit" class="btn btn-raised btn-primary" onClick={() => this.register()}>Submit</button>
                        </div>
                    </form>
                    <div class="col-xs-12 col-sm-6 text-center">
                        <Link to="login" class="btn btn-raised btn-default"><h4>Login</h4></Link>
                    </div>
                    <div class="col-xs-12 col-sm-6 text-center">
                        <Link to="createAccount" class="btn btn-raised btn-default"><h4>Create Account</h4></Link>
                    </div>
                    <Modal ref={(c) => this._modal = c} />
                </div>}
            </div>
        )
    }

}
