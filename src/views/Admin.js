import React from 'react';
import {Link} from "react-router";

import Select from 'react-select';
import async from 'async';

import Store from "../Store";
import * as Actions from "../actions";
import Loader from "../components/Loader";
import Modal from '../components/Modal';
import Input from "../components/Input";

var contracts = JSON.parse(require('../contracts.json'));

export default class Admin extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: false
        }
    }
    deploy(){
        var self = this;
        if (self._address.isValid() && self._privateKey.isValid()){
            var address = self._address.getValue();
            var pvKey = self._privateKey.getValue();
            self.setState({loading: true, loadingMessage: 'Deploying Contract'});
            Actions.Ethereum.deployContract(
                pvKey,
                address,
                '0x'+contracts.Crowdjury.bytecode,
                JSON.parse(contracts.Crowdjury.interface),
                [],
                0,
                function(err, receipt){
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
                                    Contract Address
                                    <br/><strong>{receipt.contractAddress}</strong><br></br>
                                </div>
                                <div class="col-xs-12 text-center margin-bottom">
                                    Transaction Hash
                                    <br/><strong>{receipt.transactionHash}</strong><br></br>
                                </div>
                            </div>;
                        self.setState({loading: false, delpoyedAddress: receipt.contractAddress});
                        self._modal.setState({open: true, title: 'Contract Deployed', body: modalBody});
                    }
                }
            );
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
                        <h1 class="title">Admin</h1>
                    </div>
                    <form class="col-xs-8 col-xs-offset-2">

                        <Input
                            ref={(c) => this._address = c}
                            type='address'
                            title='Address'
                            placeholder='Address'
                        />
                        <Input
                            ref={(c) => this._privateKey = c}
                            type='text'
                            regex=""
                            title='Private Key'
                            placeholder='Private Key'
                        />
                        <div class="row text-center">
                            <button type="submit" class="btn btn-raised btn-primary" onClick={() => this.deploy()}>Deploy</button>
                        </div>
                    </form>
                    <Modal ref={(c) => this._modal = c} />
                </div>}
            </div>
        )
    }

}
