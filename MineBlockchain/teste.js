const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

const bitcoins = new Blockchain('primeiro endereço');

bitcoins.createTransaction(new Transaction('primeiro endereço', 'segundo endereço', 10)); 
bitcoins.createTransaction(new Transaction('primeiro endereço', 'terceiro endereço', 10)); 

bitcoins.minerarTraPendente('segundo endereço');

bitcoins.printBlockchain();

console.log(`Essa blockchain é válida? ${bitcoins.validBlockchain()}`);