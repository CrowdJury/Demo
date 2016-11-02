
import React from 'react';
import {Link} from "react-router";

import * as Actions from "../actions";
import Store from "../Store";

export default class Navbar extends React.Component {

    constructor() {
        super();
        this.state = {
            info: Actions.Ethereum.getNodeInfo(),
        }
    }

    componentWillMount() {
        var self = this;
    }

    render() {
        const path = window.location.hash;
        return(
            <nav class="navbar navbar-default navbar-static-top">
                <div class="container">
                    <div class="navbar-header">
                        <Link class="navbar-brand" to="/">CJ Demo</Link>
                    </div>
                    <div id="navbar" class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-right">
                            <li><Link to="accounts"><i class="fa fa-list"></i></Link></li>
                            <li><Link to="configure"><i class="fa fa-cog"></i></Link></li>
                            <li><a class="cursor-pointer">Block #{this.state.info.block}</a></li>
                            <li><a class="cursor-pointer"><span class={this.state.info.connected ? "fa fa-circle green" : "fa fa-circle"}></span></a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

}
