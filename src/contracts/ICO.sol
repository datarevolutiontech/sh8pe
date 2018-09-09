pragma solidity ^0.4.18;

import "./Token.sol";

contract ICO is Token {
    using SafeMath for uint256;

    uint256 private constant MARCH_15_2018 = 1521072000;
    uint256 private constant MARCH_25_2018 = 1521936000;
    uint256 private constant MARCH_29_2018 = 1522281600;
    uint256 private constant APRIL_15_2018 = 1522540800;
    uint256 private constant APRIL_17_2018 = 1523923200;
    uint256 private constant APRIL_20_2018 = 1524182400;
    uint256 private constant APRIL_30_2018 = 1525046400;
    uint256 private constant MAY_15_2018 = 1526342400;
    uint256 private constant MAY_29_2018 = 1527552000;
    uint256 private constant JUNE_14_2018 = 1528934400;

    uint256 private constant PRE_SALE_MIN = 1 ether;
    uint256 private constant MAIN_SALE_MIN = 10 ** 17 wei;

    uint256 private constant PRE_SALE_HARD_CAP = 2491 ether;
    uint256 private constant MAX_CAP = 20000 ether;
    uint256 private constant TOKEN_PRICE = 10 ** 14 wei;

    uint256 private constant TIER_1_MIN = 10 ether;
    uint256 private constant TIER_2_MIN = 50 ether;

    uint8 private constant FOUNDERS_ADVISORS_ALLOCATION = 20; //Percent
    uint8 private constant OPERATIONAL_FUND_ALLOCATION = 20; //Percent
    uint8 private constant AIR_DROP_ALLOCATION = 5; //Percent

    address private constant WITHDRAW_ADDRESS = 0x008083e318d38ba2609b017e545d53227f1c612d2a;
    address private constant AIR_DROP = 0x008083e318d38ba2609b017e545d53227f1c612d2a;

    mapping (address => address) whitelist;
    mapping (address => address) tier1;
    mapping (address => address) tier2;

    uint32 public tier1Count;
    uint32 public tier2Count;

    uint256 preICOwei = 0;
    uint256 ICOwei = 0;

    function getTotalEthRaised() public constant returns(uint256) {
        return preICOwei + ICOwei;
    }

    function contractBalance() public constant returns(uint256) {
        return this.balance;
    }

    function getCurrentBonus(address participant) public constant returns (uint256) {

        if (isInTier2(participant)) {
            return 60;
        }

        if (isInTier1(participant)) {
            return 40;
        }

        if (inPublicPreSalePeriod()) {
            return 30;
        }

        if (inAngelPeriod()) {
            return 20;
        }

        if (now >= APRIL_17_2018 && now < APRIL_20_2018) {
            return 10;
        }

        if (now >= APRIL_20_2018 && now < APRIL_30_2018) {
            return 5;
        }

        return 0;
    }

    function inPrivatePreSalePeriod() public constant returns (bool) {
        return (now >= MARCH_15_2018 && now < APRIL_15_2018);
    }

    function inPublicPreSalePeriod() public constant returns (bool) {
        return (now >= MARCH_15_2018 && now < MARCH_25_2018);
    }

    function inAngelPeriod() public constant returns (bool) {
        return (now >= APRIL_15_2018 && now < APRIL_17_2018);
    }

    function inMainSalePeriod() public constant returns (bool) {
        return (now >= APRIL_17_2018 && now < MAY_15_2018);
    }

    function isInTier1(address participant) public constant 
        participantIsValid(participant) 
        returns (bool) 
    {
        return !(tier1[participant] == address(0));
    }

    function addTier1Member(address participant) public 
        participantIsValid(participant) 
        onlyWhiteLister 
    {
        tier1[participant] = participant;
        tier1Count += 1;

        NewTier1Participant(participant);
    }

    function isInTier2(address participant) public constant 
        participantIsValid(participant) 
        returns (bool) 
    {
        return !(tier2[participant] == address(0));
    }

    function addTier2Member(address participant) public 
        onlyWhiteLister 
        participantIsValid(participant) 
    {
        tier2[participant] = participant;
        tier2Count += 1;

        NewTier2Participant(participant);
    }

    function buyTokens() public payable {

        require(msg.sender != address(0));
        
        require(inPrivatePreSalePeriod() || inPublicPreSalePeriod() || inAngelPeriod() || inMainSalePeriod() || isInTier1(msg.sender) || isInTier2(msg.sender));

        if (isInTier1(msg.sender)) {
            require(msg.value >= TIER_1_MIN);
        }

        if (isInTier2(msg.sender)) {
            require(msg.value >= TIER_2_MIN);
        }

        if (inPrivatePreSalePeriod() == true) {
            require(msg.value >= PRE_SALE_MIN);

            require(PRE_SALE_HARD_CAP >= preICOwei.add(msg.value));
            preICOwei = preICOwei.add(msg.value);
        }

        if (inMainSalePeriod() == true) {
            require(msg.value >= MAIN_SALE_MIN);

            require(MAX_CAP >= preICOwei + ICOwei.add(msg.value));
            ICOwei = ICOwei.add(msg.value);
        }

        uint256 deltaTokens = 0;

        uint256 tokens = msg.value.div(TOKEN_PRICE);
        uint256 bonusTokens = getCurrentBonus(msg.sender).mul(tokens.div(100));

        tokens = tokens.add(bonusTokens);
        balances[msg.sender] = balances[msg.sender].add(tokens);

        deltaTokens = deltaTokens.add(tokens);

        balances[FOUNDERS] += tokens.mul(100).div(FOUNDERS_ADVISORS_ALLOCATION);
        deltaTokens += tokens.mul(100).div(FOUNDERS_ADVISORS_ALLOCATION);

        balances[INVOICE_FOUND] += tokens.mul(100).div(OPERATIONAL_FUND_ALLOCATION);
        deltaTokens += tokens.mul(100).div(OPERATIONAL_FUND_ALLOCATION);

        balances[AIR_DROP] += tokens.mul(100).div(AIR_DROP_ALLOCATION);
        deltaTokens += tokens.mul(100).div(AIR_DROP_ALLOCATION);

        totalSupply = totalSupply.add(deltaTokens);

        TokenPurchase(msg.sender, msg.value, tokens);
    }

    function() public payable {
        buyTokens();
    }

    function airDrop(address participant, uint256 value) public onlyOwner {
        require(value > 0);

        require(balances[AIR_DROP] >= value);
        balances[AIR_DROP] -= value;
        balances[participant] += value;
    }

    function withdrawPreICOEth() public {
        require(now > MARCH_29_2018);
        WITHDRAW_ADDRESS.transfer(preICOwei);
    }

    function withdrawICOEth() public {
        require(now > MAY_29_2018);
        WITHDRAW_ADDRESS.transfer(ICOwei);
    }

    function withdrawAll() public {
        require(now > JUNE_14_2018);
        WITHDRAW_ADDRESS.transfer(this.balance);
    }

    event TokenPurchase(address indexed _purchaser, uint256 _value, uint256 _amount);
    event EthTransfered(uint256 _amount);

    event NewTier1Participant(address indexed _participant);
    event NewTier2Participant(address indexed _participant);

    modifier onlyWhiteLister() {
        require(msg.sender == owner);
        _;
    }

    modifier participantIsValid(address participant) {
        require(participant != address(0));
        _;
    }
}
