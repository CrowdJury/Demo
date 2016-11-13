import React from 'react';
import {Link} from "react-router";

import async from 'async';

import * as Actions from "../actions";
import Store from "../Store";
import Loader from "../components/Loader";

export default class Home extends React.Component {

    constructor() {
        super();
    }

    componentWillMount(){
        if (Store.user.username == '')
            this.goTo('/login');
    }

    logout(){
        Store.setUser({username: '', address: ''});
        this.goTo('/login');
    }

    goTo(hash){
        window.location.replace(window.location.protocol+'//'+window.location.host+'/#'+hash);
    }

    render() {
        var self = this;
        var reports = [{
            title: 'Freelance Example Report',
            fullName: 'My User Full Name',
            description: 'A freelance work dispute about  website development contract.',
            reward: '0.02 BTC'
        }]

        return(
            <div class="row">
                <h3> Your Reports </h3>
                <div class="row">
                    {reports.map(function(report, index){
                        return (
                            <div class="col-xs-6 col-md-4" style={{display:"inline-block"}}>
                                <div class="panel panel-default">
                                    <div class="panel-heading">{report.title}</div>
                                    <div class="panel-body">
                                        <p>Author: {report.fullName}</p>
                                        <p>{report.description}</p>
                                        <p>Reward: {report.reward}</p>
                                    </div>
                                    <div class="panel-footer">
                                        <ul class="pager" style={{margin: 0}}>
                                            <li><a class="withripple" href="#/invitation">Help in This case</a></li>
                                            <li><a class="withripple" href="#/invitation">See More</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div class="row">
                    <div class="col-xs-6 text-left">
                        <a onClick={()=> self.logout()} class="btn btn-raised btn-primary">Logout</a>
                    </div>
                    <div class="col-xs-6 text-right">
                        <a href="#/report" class="btn btn-danger btn-fab"><i class="material-icons">add</i></a>
                    </div>
                </div>
            </div>
        )
    }

}
