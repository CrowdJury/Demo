import React from 'react';
import {Link} from "react-router";

import async from 'async';

import Store from "../Store";
import * as Actions from "../actions";
import Loader from "../components/Loader";
import Modal from '../components/Modal';
import Input from "../components/Input";

var packageJson = JSON.parse(require('../../package.json'));

var contracts = JSON.parse(require('../contracts.json'));

export default class Configure extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: false,
            web3Provider: Store.web3Provider || '',
        }
    }

    configure(){
        Actions.Config.configure(this.state.web3Provider);
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
                            <h1>Configuration</h1>
                        </div>
                        <form class="col-xs-8 col-xs-offset-2 col-md-6 col-md-offset-3">
                            <Input
                                ref={(c) => this._web3Provider = c}
                                type='text'
                                regex=""
                                title='Web3 Provider'
                                placeholder='Web3 Provider'
                                initialValue={self.state.web3Provider}
                            />
                            <div class="row margin-bottom margin-top text-center">
                                <button type='submit' class="btn btn-raised btn-default" onClick={() => this.configure()}>Configure</button>
                            </div>
                            <div class="row margin-bottom margin-top text-center">
                                <button class="btn btn-raised btn-default" onClick={() => {window.localStorage.clear();window.location.reload()}}>Clear Storage</button>
                            </div>
                        </form>
                        <div class="col-xs-12 text-center">
                            <Link to="/" class="cursor-pointer"><h4>Go Back</h4></Link>
                        </div>
                    </div>
                }
            </div>
        )
    }

}
