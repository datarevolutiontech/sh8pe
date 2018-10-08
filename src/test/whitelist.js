const WhiteList = artifacts.require("WhiteList");

contract('WhiteList', function(accounts) {
  beforeEach(async function () {
    this.whitelist = await WhiteList.new();
  });

  describe("Test WhiteList", async function() {

    it("should have owner in white list", async function () {
      const actual = await this.whitelist.isWhiteListed(accounts[0]);
      assert.equal(actual, true, "Account 0 (owner) should be white listed");
    });

    it("should not be in white list", async function () {
      const actual = await this.whitelist.isWhiteListed(accounts[1]);
      assert.equal(actual, false, "Account 1 should not be white listed");
    });

    it("should add account 1 to white list", async function () {
      await this.whitelist.add(accounts[1]);
      const actual = await this.whitelist.isWhiteListed(accounts[1]);
      assert.equal(actual, true, "Account 1 should not be white listed");
    });
  });
});