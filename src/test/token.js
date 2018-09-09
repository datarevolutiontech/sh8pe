const Token = artifacts.require("Sh8pe");
//const assertJump = require("./assertJump.js");
const tokenName = 'Sh8pe';
const decimalUnits = 18;
const tokenSymbol = 'INVOX';

const durationTime = 28; //4 weeks

contract('Sh8pe', function(accounts) {
  beforeEach(async function () {
    this.token = await Token.new();
  });

  //describe erc20 tests
  describe("Test ERC20 properties", async function() {
    it("should have symbol INVOX", async function () {
      const actual = await this.token.symbol();
      assert.equal(actual, tokenSymbol, "Symbol should be Sh8pe");
    });

    it("should have name Invox", async function () {
      const actual = await this.token.name();
      assert.equal(actual, tokenName, "Name should be Sh8pe");
    });

    it("should have total supply of 0", async function () {
      const balance = await this.token.balanceOf(accounts[0]);
      assert.equal(balance.valueOf(), 0, "First account (owner) balance must be 0");
    });

    it("should put 0 INVX to supply and in the first account", async function () {
      const actual = await this.token.totalSupply();
      assert.equal(actual.valueOf(), 0, "Total supply should be 0");
    });
  });
});