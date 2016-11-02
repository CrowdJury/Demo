import { EventEmitter } from "events";
import dispatcher from "./Dispatcher";

var config = JSON.parse(require('./config.json'));
var contracts = JSON.parse(require('./contracts.json'));

class AppStore extends EventEmitter {
	constructor() {
		super();

		this.contracts = contracts;
		for (var i = 0; i < config.contracts.length; i++) {
			if (this.contracts[config.contracts[i].name]){
				this.contracts[config.contracts[i].name].address = config.contracts[i].address;
				this.contracts[config.contracts[i].name].interface = JSON.parse(this.contracts[config.contracts[i].name].interface);
			}
		}

		if (window.localStorage.getItem('web3Provider'))
			this.web3Provider = window.localStorage.web3Provider;
		else
			this.web3Provider = config.web3Provider;

		if (window.localStorage.getItem('user'))
			this.user = JSON.parse(window.localStorage.user);
		else
			this.user = {
				username: '',
				address: ''
			};

		this.web3 = null;
	}

	getContract(name){
		return this.web3.eth.contract(Store.contracts[name].interface).at(Store.contracts[name].address);
	}

	setWeb3Provider(provider) {
		this.web3Provider = provider;
		window.localStorage.setItem('web3Provider', this.web3Provider);
	}

	setUser(newUser) {
		this.user = newUser;
		window.localStorage.setItem('user', JSON.stringify(this.user));
	}

	handleActions(action) {
		switch(action.type) {
			case "SET_WEB3": {
		        this.web3 = action.web3;
		        this.emit("web3Ready");
		        break;
		    }
		}
	}

}

const Store = new AppStore;
dispatcher.register(Store.handleActions.bind(Store));

export default Store;
