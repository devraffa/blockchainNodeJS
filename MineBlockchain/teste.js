const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const Keys = require('./keys');


const keys1 = new Keys();

const bitcoins = new Blockchain(keys1.address);

const endereco2 = bitcoins.criarEndereco();
const endereco3 = bitcoins.criarEndereco();
const endereco4 = bitcoins.criarEndereco();
const endereco5 = bitcoins.criarEndereco();


bitcoins.criaTransaction(keys1.address, endereco3, 20, 2);
//bitcoins.criaTransaction(endereco3, endereco4, 40,4);

bitcoins.minerarTraPendente(endereco5);

bitcoins.printBlockchain();

console.log(`Essa blockchain é válida? ${bitcoins.validBlockchain()}`);

const historico = bitcoins.historicTransaction(endereco2);
console.log("Histórico de transações: ", historico);



