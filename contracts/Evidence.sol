pragma solidity ^0.4.2;

import './Owned.sol';

contract Evidence is Owned{

    address private jugdment;
    string private name;
    string private url;

    function Evidence(address _jugdment, string _name, string _url) {
        owner = msg.sender;
        jugdment = _jugdment;
        name = _name;
        url = _url;
    }

    function edit(string _name, string _url) constant fromOwner returns (bool){
        if (owner != msg.sender)
            return (false);
        url = _url;
        name = _name;
        return (true);
    }

    function getData() constant returns (address, address, string, string){
        return (owner, jugdment, name, url);
    }

}
