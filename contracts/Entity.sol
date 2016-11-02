pragma solidity ^0.4.2;

import './Owned.sol';

contract Entity is Owned{

    string name;
    string legal_name;
    string legal_email;
    string residency_country;
    string residency_address;
    string id_string;
    string id_type;
    Addresses jugdments;

    struct Addresses {
        uint size;
        mapping (uint => address) array;
    }

    function Entity(string _legal_name, string _legal_email, string _residency_country, string _residency_address, string _id_string, string _id_type) {
        owner = msg.sender;
        legal_name = _legal_name;
        legal_email = _legal_email;
        residency_country = _residency_country;
        residency_address = _residency_address;
        id_string = _id_string;
        id_type = _id_type;
        jugdments = Addresses(0);
    }

    function edit(string _legal_name, string _legal_email, string _residency_country, string _residency_address, string _id_string, string _id_type) constant fromOwner returns (bool){
        legal_name = _legal_name;
        legal_email = _legal_email;
        residency_country = _residency_country;
        residency_address = _residency_address;
        id_string = _id_string;
        id_type = _id_type;
        return (true);
    }

    function getData() constant returns (string, string, string, string, string, string){
        return (legal_name, legal_email,residency_country, residency_address, id_string, id_type);
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
