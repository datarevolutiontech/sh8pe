const Token = artifacts.require("Sh8pe");

const tokenName = 'Sh8pe Angel Token';
const decimalUnits = 18;
const tokenSymbol = 'SH8PE';

contract('Sh8pe', function(accounts) {
  beforeEach(async function () {
    this.token = await Token.new();
  });

  describe("Test ERC20 properties", async function() {
    it("should have symbol SH8PE", async function () {
      const actual = await this.token.symbol();
      assert.equal(actual, tokenSymbol, "Symbol should be SH8PE");
    });

    it("should have name sh", async function () {
      const actual = await this.token.name();
      assert.equal(actual, tokenName, "Name should be Sh8pe Angel Token");
    });

    it("should have total supply of 100000000", async function () {
      const balance = await this.token.balanceOf(accounts[0]);
      assert.equal(balance.valueOf(), 100000000, "First account (owner) balance must be 100000000");
    });

    it("should put 0 INVX to supply and in the first account", async function () {
      const actual = await this.token.totalSupply();
      assert.equal(actual.valueOf(), 0, "Total supply should be 0");
    });
  });
});