pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

contract Sh8pe is ERC20, Ownable {
    using SafeMath for uint;

    string public name = "Sh8pe";
    string public symbol = "Sh8pe";
    uint8 public decimals = 18;
    uint256 public totalSupply = 100000000;

    address private owner;

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;

    constructor () public {
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address who) public view returns (uint256) {
        return balances[who];
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value);

        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balances[from] >= value && allowed[from][msg.sender] >= value && balances[to] + value >= balances[to]);

        balances[from] = balances[from].sub(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0));
        require(allowed[msg.sender][spender] == 0 || amount == 0);

        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}
