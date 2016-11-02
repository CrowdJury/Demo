pragma solidity ^0.4.2;

contract Crowdjury {

    address public owner;

    event newUser(address);
    event error(uint);

    struct User {
        address userAddress;
        string username;
        string password;
    }

    mapping(address => uint) private usersIndex;
    User[] private users;

    function Crowdjury(string _electionName) {
        owner = msg.sender;
        users.length ++;
    }

    function register(string _username,  string _password){
        if (usersIndex[msg.sender] > 0) throw;

        uint pos = users.length ++;
        users[pos] = User(msg.sender, _username, _password);
        usersIndex[msg.sender] = pos;
        newUser(msg.sender);
    }

    function verifyUser(string _username, string _password) constant returns (bool){
        uint userIndex = usersIndex[msg.sender];
        if (userIndex == 0) throw;

        if (stringsEqual(users[userIndex].username, _username) && stringsEqual(users[userIndex].password, _password))
            return (true);
        else
            return (false);
    }

    function getUsersCount() public constant returns(uint) {
        return users.length;
    }

    function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
		bytes storage a = bytes(_a);
		bytes memory b = bytes(_b);
        bool equals = true;
		if (a.length != b.length)
			equals = false;
		if (equals)
    		for (uint i = 0; i < a.length; i ++)
    			if ((a[i] != b[i]) && (equals))
    				equals = false;
		return (equals);
	}

}
