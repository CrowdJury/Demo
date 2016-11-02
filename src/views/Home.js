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
            window.location.replace(window.location.href.replace('#/home','#/login'));
    }

    logout(){
        Store.setUser({username: '', address: ''});
        window.location.replace(window.location.href.replace('#/home','#/login'));
    }

    render() {
        var self = this;
        var reports = [{
            title: 'Report title 1',
            fullName: 'Report author 1',
            description: 'description here 1',
            reward: '66'
        },{
            title: 'Report title 2',
            fullName: 'Report author 2',
            description: 'description here 2',
            reward: '662'
        },{
            title: 'Report title 3',
            fullName: 'Report author 3',
            description: 'description here 3',
            reward: '663'
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
                                        <p>{report.fullName}</p>
                                        <p>{report.description}</p>
                                        <p>Reward: Ƀ {report.reward}</p>
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
