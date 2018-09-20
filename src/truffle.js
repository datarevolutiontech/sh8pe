module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 4600000
    },
     ropsten:  {
     network_id: 3,
     host: "localhost",
     port:  8545,
     gas:   2900000
  }}
};