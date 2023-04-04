var HDWalletProvider = require("@truffle/hdwallet-provider");

var mnemonic = "mountains supernatural bird ...";

module.exports = {
  networks: {
    mumbai: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider('patient skirt secret action actor ceiling chalk warm loop thing situate public',
        // remember to change this to your own phrase!
        'https://rpc-mumbai.maticvigil.com/v1/fbfd2a06db235d6862a67db6411d9f34c39cff54'),
      network_id: '80001',
    }
  }
};