pragma solidity ^0.4.2;

import './Owned.sol';

contract Person is Owned{

    string first_name;
    string last_name;
    string email;
    bytes12 birthdate;
    string id;
    bytes32 id_type;
    string skills;
    Addresses jugdments;

    struct Addresses {
        uint size;
        mapping (uint => address) array;
    }

    function Person(string _first_name, string _last_name, string _email, bytes12 _birthdate, string _id, bytes32 _id_type, string _skills) {
        owner = msg.sender;
        first_name = _first_name;
        last_name = _last_name;
        email = _email;
        birthdate = _birthdate;
        id = _id;
        id_type = _id_type;
        jugdments = Addresses(0);
        skills = _skills;
    }

    function edit(string _first_name, string _last_name, string _email, bytes12 _birthdate, string _id, bytes32 _id_type, string _skills) constant fromOwner returns (bool){
        first_name = _first_name;
        last_name = _last_name;
        email = _email;
        birthdate = _birthdate;
        id = _id;
        id_type = _id_type;
        skills = _skills;
        return (true);
    }

    function getData() constant returns (string, string, string, bytes12, string, bytes32, string){
        return (first_name, last_name, email, birthdate, id, id_type, skills);
    }

    function getJugdment(uint i) constant returns (address){
        if (i < jugdments.size)
            return (jugdments.array[i]);
        return (0x0);
    }

    function addJugdment(address jugdment_address) constant fromOwner returns (bool){
        for(uint i = 0; i < jugdments.size; i ++)
            if (jugdments.array[i] == jugdment_address)
                return (false);
        jugdments.array[jugdments.size] = jugdment_address;
        jugdments.size ++;
        return (true);
    }

    function removeJugdment(address jugdment_address) constant fromOwner returns (bool){
        for(uint i = 0; i < jugdments.size; i ++)
            if (jugdments.array[i] == jugdment_address){
                if (i == (jugdments.size-1)){
                    delete jugdments.array[i];
                } else {
                    for(uint z = i; z < jugdments.size; z ++)
                        jugdments.array[z] = jugdments.array[z+1];
                    delete jugdments.array[jugdments.size-1];
                }
                jugdments.size --;
                return (true);
            }
        return (false);
    }

}
