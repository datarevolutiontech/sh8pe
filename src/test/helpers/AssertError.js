module.exports = function(error) {
    assert.equal(error.message.search('VM Exception while processing transaction'), 0, 'Invalid opcode error must be returned');
}