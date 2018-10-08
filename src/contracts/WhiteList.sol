pragma solidity ^0.4.24;

import "./Ownable.sol";

contract WhiteList is Ownable {

    mapping(address => address) whiteList;

    constructor() public {
        whiteList[msg.sender] = msg.sender;
    }

    function add(address who) public onlyOwner() {
        require(who != address(0), "Invalid address");
        whiteList[who] = who;
    }

    function remove(address who) public onlyOwner() {
        require(who != address(0), "Invalid address");
        delete whiteList[who];
    }

    function isWhiteListed(address who) public view returns (bool) {
        return whiteList[who] != address(0);
    }
}