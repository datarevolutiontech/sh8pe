pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./WhiteList.sol";

contract Sh8pe is Ownable, WhiteList {
    using SafeMath for uint;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;

    constructor () public {

        name = "Sh8pe Angel Token";
        symbol = "SH8PE";
        decimals = 18;
        totalSupply = 100000000;

        balances[msg.sender] = totalSupply;
        emit Transfer(this, msg.sender, totalSupply);
    }

    function balanceOf(address who) public view returns (uint256) {
        return balances[who];
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(isWhiteListed(msg.sender) == true, "Not white listed");
        require(balances[msg.sender] >= value, "Insufficient balance");

        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balances[from] >= value && allowed[from][msg.sender] >= value && balances[to] + value >= balances[to], "Insufficient balance");

        balances[from] = balances[from].sub(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "Invalid address");

        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
}
