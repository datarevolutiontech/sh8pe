const ICO = artifacts.require("ICO");
//const assertJump = require("./assertJump.js");
//const BigNumber = require('bignumber.js');
const assertError = require('./helpers/AssertError');
const durationTime = 28; //4 weeks

//Mnemonic
//whip venture public clip similar debris minimum mandate despair govern rotate swim

const owner = '0x1B70EA1E5f0fF005794AAA79465D4B7D2C664E36'; //account 0
const public = '0x521f76B5F95bc0b0acd8c2D27c1f48e5DB97E0c2'; //account 1
const tier1 = '0x4828001f96A67244257369cF67579B3b357E1E4E'; //account 4
const tier2 = '0xd5206054Bee5f6Dd2905911859ba53cC442e037B'; //account 5

const timeController = (() => {
  
    const addSeconds = (seconds) => new Promise((resolve, reject) =>
      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [seconds],
        id: new Date().getTime()
      }, (error, result) => error ? reject(error) : resolve(result.result)));
  
    const addDays = (days) => addSeconds(days * 24 * 60 * 60);
  
    const currentTimestamp = () => web3.eth.getBlock(web3.eth.blockNumber).timestamp;

    return {
      addSeconds,
      addDays,
      currentTimestamp
    };
  })();
  
async function advanceByDays(value) {
  return await timeController.addDays(value);
}

async function advanceBySeconds(value) {
  return await timeController.addSeconds(value);
}

async function advanceToDate(value) {
  const currentTimestamp = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;

  value = value / 1000 | 0;
  let delta = value - currentTimestamp;

  let result = await timeController.addSeconds(delta);
}

contract('Invox ICO', function(accounts) {
  beforeEach(async function () {
    this.ico = await ICO.new();
  });

  describe("Test ICO helper functions and properties", async function() {

    it("should allow owner to add to tier 1 white list", async function () {
      let count = await this.ico.tier1Count();
      assert.equal(count.valueOf(), 0, "Tier 1 count should be 0");

      let actual = await this.ico.isInTier1(tier1);
      assert.equal(actual, false, "Account 0x4828001f96A67244257369cF67579B3b357E1E4E should not be in tier1");

      let result = await this.ico.addTier1Member(tier1);

      count = await this.ico.tier1Count();
      assert.equal(count.valueOf(), 1, "Tier 1 count should be 1");

      actual = await this.ico.isInTier1(tier1);
      assert.equal(actual, true, "Account 0x4828001f96A67244257369cF67579B3b357E1E4E should be in tier1");
    });

    it("should not allow public to add to tier 1 white list", async function () {
      try {
        await this.ico.addTier1Member(tier1, {from: accounts[9]});
      } catch(error) {
        assertError(error);
      }
    });

    it("should allow owner to add to tier 2 white list", async function () {
      let count = await this.ico.tier2Count();
      assert.equal(count.valueOf(), 0, "Tier 2 count should be 0");

      let actual = await this.ico.isInTier2(tier2);
      assert.equal(actual, false, "Account 0xd5206054Bee5f6Dd2905911859ba53cC442e037B should not be in tier2");

      let result = await this.ico.addTier2Member(tier2);

      count = await this.ico.tier2Count();
      assert.equal(count.valueOf(), 1, "Tier 2 count should be 1");

      actual = await this.ico.isInTier2(tier2);
      assert.equal(actual, true, "Account 0xd5206054Bee5f6Dd2905911859ba53cC442e037B should be in tier2");
    });
  });

  describe("Before ICO tests", async function() {

    before(async function() {
      this.ico = await ICO.new();
      await advanceToDate(Date.parse("March 14, 2018"));
    });

    it("should not be in private pre sale period", async function() {
      const actual = await this.ico.inPrivatePreSalePeriod();
      assert.equal(actual, false, "in public pre sale period should be false");
    });

    it("should not be in public pre sale period", async function() {
      const actual = await this.ico.inPublicPreSalePeriod();
      assert.equal(actual, false, "in public pre sale period should be false");
    });

    it("should not be in main sale period", async function() {
      const actual = await this.ico.inMainSalePeriod();
      assert.equal(actual, false, "in main sale period should be false");
    });

    it("should not be able to buy outside of sales periods", async function() {
      try {
        await this.ico.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[1]});
      } catch(error) {
        assertError(error);
      }
    });
  });

  describe("Private pre sale tests - [March 15, 2018 to April 15, 2018]", async function() {
    before(async function () {
      this.ico = await ICO.new();
      
      let t1 = await this.ico.isInTier1(tier1);
      let t2 = await this.ico.isInTier2(tier2);
      assert.equal(t1, false, "Account " + tier1 + " should not be in tier1");
      assert.equal(t2, false, "Account " + tier2 + " should not be in tier2");

      let t1result = await this.ico.addTier1Member(tier1);
      let t2result = await this.ico.addTier2Member(tier2);

      let actual = await this.ico.isInTier1(tier1);
      assert.equal(actual, true, "Account " + tier1 + " should be in tier1");

      await advanceToDate(Date.parse("March 16, 2018"));
    });

    it("should be in private pre sale period", async function() {
      const actual = await this.ico.inPrivatePreSalePeriod();
      assert.equal(actual, true, "in private pre sale period should be true");
    });

    it("should not be in main sale period", async function() {
      const actual = await this.ico.inMainSalePeriod();
      assert.equal(actual, false, "in main sale period should be false");
    });

    it("should be 40% bonus for tier 1", async function() {
      const expected = 40;
      const actual = await this.ico.getCurrentBonus(tier1);
      assert.equal(actual.valueOf(), expected, "Bonus should be 40");
    });

    it("should be 60% bonus for tier 2", async function() {
      const expected = 60;
      const actual = await this.ico.getCurrentBonus(tier2);
      assert.equal(actual.valueOf(), expected, "Bonus should be 60");
    });

    it("should not allow the tier 1 participants to buy tokens for less than the min", async function() {
      const expected = 0;
      try {
        await this.ico.buyTokens({from: tier1, value: web3.toWei(1, 'ether')});
      } catch(error) {
        assertError(error);
      }
      const actual = await this.ico.balanceOf(tier1);
      assert.equal(actual.valueOf(), expected, "Tokens should be 0");
    });

    it("should allow the tier 1 participants to buy tokens", async function() {
      const expected = 140000;
      await this.ico.buyTokens({from: tier1, value: web3.toWei(10, 'ether')});

      const actual = await this.ico.balanceOf(tier1);
      assert.equal(actual.valueOf(), expected, "Tokens should be 140000");

      const totalETH = await this.ico.getTotalEthRaised();
      assert.equal(totalETH.valueOf(), 10000000000000000000);

      const contractBalance = await this.ico.contractBalance();
      assert.equal(contractBalance.valueOf(), 10000000000000000000);
    });

    it("should not allow the tier 2 participants to buy tokens for less than the min", async function() {
      const expected = 0;
      try {
        await this.ico.buyTokens({from: tier2, value: web3.toWei(1, 'ether')});
      } catch(error) {
        assertError(error);
      }
      const actual = await this.ico.balanceOf(tier2);
      assert.equal(actual.valueOf(), expected, "Tokens should be 0");
    });

    it("should allow the tier 2 participants to buy tokens", async function() {
      const expected = 800000;
      await this.ico.buyTokens({from: tier2, value: web3.toWei(50, 'ether')});

      const actual = await this.ico.balanceOf(tier2);
      assert.equal(actual.valueOf(), expected, "Tokens should be 800000");

      const contractBalance = await this.ico.contractBalance();
      assert.equal(contractBalance.valueOf(), 600000000000000000000);
    });

    it("should not allow ETH withdraw", async function() {

    });
  });

  describe("Public pre sale tests - [March 15, 2018 to April 15, 2018", async function() {
    before(async function () {
      this.ico = await ICO.new();

      let t1result = await this.ico.addTier1Member(tier1);
      let t2result = await this.ico.addTier2Member(tier2);

      await advanceToDate(Date.parse("March 16, 2018"));
    });

    it("should be in private pre sale period", async function() {
      const actual = await this.ico.inPrivatePreSalePeriod();
      assert.equal(actual, true, "in private pre sale period should be true");
    });

    it("should not be in main sale period", async function() {
      const actual = await this.ico.inMainSalePeriod();
      assert.equal(actual, false, "in main sale period should be false");
    });

    it("should be 30% bonus for public", async function() {
      const expected = 30;
      const actual = await this.ico.getCurrentBonus(public);
      assert.equal(actual.valueOf(), expected, "Bonus should be 30");
    });

    it("should buy 13000 tokens for 1 ETH", async function() {
      const expected = 13000;
      await this.ico.buyTokens({from: public, value: web3.toWei(1, 'ether')});

      const actual = await this.ico.balanceOf(public);

      assert.equal(actual.valueOf(), expected, "Tokens should be 13000");
    });

    it("should buy 26000 tokens for 2 ETH", async function() {
      const expected = 26000;
      await this.ico.buyTokens({from: accounts[6], value: web3.toWei(2, 'ether')});

      const actual = await this.ico.balanceOf(accounts[6]);

      assert.equal(actual.valueOf(), expected, "Tokens should be 26000");
    });

    it("should buy another 13000 tokens for 1 ETH", async function() {
      const expected = 26000;
      await this.ico.buyTokens({from: public, value: web3.toWei(1, 'ether')});

      const actual = await this.ico.balanceOf(public);

      assert.equal(actual.valueOf(), expected, "Tokens should be 26000");
    });

    it("should not allow ETH withdraw", async function() {
      try {
        await this.ico.withdrawPreICOEth();
      } catch(error) {
        assertError(error);
      }
    });
  });

  describe("Angel days sale tests - [April 15, 2018]", async function() {
    before(async function () {
      this.ico = await ICO.new();

      let t1result = await this.ico.addTier1Member(tier1);
      let t2result = await this.ico.addTier2Member(tier2);

      await advanceToDate(Date.parse("April 15, 2018"));
    });

    it("should get 20% bonus for public", async function() {
      const expected = 20;
      const actual = await this.ico.getCurrentBonus(public);
      assert.equal(actual.valueOf(), expected, "Bonus should be 20");
    });

  });

  describe("Public main sale tests", async function() {
    before(async function () {
      this.ico = await ICO.new();

      let t1result = await this.ico.addTier1Member(tier1);
      let t2result = await this.ico.addTier2Member(tier2);
      
      await advanceToDate(Date.parse("April 18, 2018"));
    });

    it("should be 40% bonus for tier 1", async function() {
      const expected = 40;
      const actual = await this.ico.getCurrentBonus(tier1);
      assert.equal(actual.valueOf(), expected, "Bonus should be 40");
    });

    it("should be 60% bonus for tier 2", async function() {
      const expected = 60;
      const actual = await this.ico.getCurrentBonus(tier2);
      assert.equal(actual.valueOf(), expected, "Bonus should be 60");
    });

    it("should be in day 1 of main sale with 10% bonus for public", async function() {
      const expected = 10;
      const actual = await this.ico.getCurrentBonus(public);
      assert.equal(actual.valueOf(), expected, "Bonus should be 10");
    });

    it("public should buy 11000 tokens for 1 ETH", async function() {
      const expected = 11000;
      await this.ico.buyTokens({from: public, value: web3.toWei(1, 'ether')});

      const actual = await this.ico.balanceOf(public);
      assert.equal(actual.valueOf(), expected, "Tokens should be 11000");
    });

    it("should buy 5500 tokens for 0.5 ETH", async function() {
      const expected = 5500;
      await this.ico.buyTokens({from: accounts[7], value: web3.toWei(500, 'finney')});

      const actual = await this.ico.balanceOf(accounts[7]);

      assert.equal(actual.valueOf(), expected, "Tokens should be 7500");
    });
  });
});