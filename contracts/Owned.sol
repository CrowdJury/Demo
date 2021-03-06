pragma solidity ^0.4.2;

contract Owned {

    address public owner;

    modifier fromOwner() {
        if (msg.sender != owner)
			_;
    }

    function getOwner() constant returns (address) {
        return owner;
    }

}
