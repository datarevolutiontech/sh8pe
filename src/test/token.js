const Token = artifacts.require("Sh8pe");

contract('Sh8pe', function(accounts) {
  beforeEach(async function () {
    this.token = await Token.new();
  });

  describe("Test ERC20 properties", async function() {
    it("should have symbol SH8PE", async function () {
      const actual = await this.token.symbol();
      assert.equal(actual, "SH8PE", "Symbol should be SH8PE");
    });

    it("should have name Sh8pe Angel Token", async function () {
      const actual = await this.token.name();

      assert.equal(actual, "Sh8pe Angel Token", "Name should be Sh8pe Angel Token");
    });

    it("should have total supply of 100000000", async function () {
      const actual = await this.token.totalSupply();
      assert.equal(actual.valueOf(), 100000000, "Total supply should be 0");
    });

    it("should put 0 Sh8pe to supply and in the first account", async function () {
      const actual = await this.token.balanceOf(accounts[0]);
      assert.equal(actual.valueOf(), 100000000, "First account (owner) balance must be 100000000");
    });
  });
});