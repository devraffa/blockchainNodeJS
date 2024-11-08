const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

const bitcoins = new Blockchain('2x000000000000000000000000000000000000000001');
bitcoins.minerarTraPendente('2x000000000000000000000000000000000000001234');

bitcoins.criaTransaction('2x000000000000000000000000000000000000000001', '2x000000000000000000000000000000000000000002', 20); 
bitcoins.criaTransaction('2x000000000000000000000000000000000000000001', '2x000000000000000000000000000000000000000004', 40); 

bitcoins.minerarTraPendente('22x000000000000000000000000000000000000012345');

bitcoins.printBlockchain();

console.log(`Essa blockchain é válida? ${bitcoins.validBlockchain()}`);

const historico = bitcoins.historicTransaction('2x000000000000000000000000000000000000000001');
console.log("Histórico de transações: ", historico);

console.log(bitcoins.validAddress("2x001abc245123"));  // teste da função retornar false
console.log(bitcoins.validAddress("a1b2c3d4e5f67890123456789abcdef1234567890")); // retornar false

