const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const Keys = require('./keys');


const keys1 = new Keys();

const bitcoins = new Blockchain(keys1.address);

const endereco2 = bitcoins.criarEndereco();
console.log("esse é o endereço 2:", endereco2);
const endereco3 = bitcoins.criarEndereco();
console.log("esse é o endereço 3:", endereco3);
const endereco4 = bitcoins.criarEndereco();
console.log("esse é o endereço 4:", endereco4);
const endereco5 = bitcoins.criarEndereco();


bitcoins.criaTransaction(keys1.address, endereco3, 20, 2);
console.log("Saldo do endereço 3:", bitcoins.saldoEndereco(endereco3));
bitcoins.criaTransaction(endereco3, endereco4, 5,4);
console.log("Saldo do endereço 3:", bitcoins.saldoEndereco(endereco3));
console.log("Saldo do endereço 4:", bitcoins.saldoEndereco(endereco4));

console.log("Transações pendentes antes de minerar:", bitcoins.pendenciaTrans);
bitcoins.minerarTraPendente(endereco5);
console.log("Saldo do minerador (endereço5) após mineração:", bitcoins.saldoEndereco(endereco5));

bitcoins.printBlockchain();

console.log(`Essa blockchain é válida? ${bitcoins.validBlockchain()}`);

const historico = bitcoins.historicTransaction(keys1.address);
console.log("Histórico de transações: ", historico);






