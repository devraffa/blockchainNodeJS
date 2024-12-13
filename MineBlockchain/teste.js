const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const Keys = require('./keys');


const keys1 = new Keys();
const node1Keys = new Keys();
const node2Keys = new Keys();
const node3Keys = new Keys();

const node1 = new Node(node1Keys.address);
const node2 = new Node(node2Keys.address);
const node3 = new Node(node3Keys.address);


const bitcoins = new Blockchain(keys1.address);

//const endereco2 = bitcoins.criarEndereco();
//const endereco3 = bitcoins.criarEndereco();
//const endereco4 = bitcoins.criarEndereco();
//const endereco5 = bitcoins.criarEndereco();


bitcoins.criaTransaction(keys1.address, endereco3, 20, 2);
bitcoins.criaTransaction(endereco3, endereco4, 5,4);

bitcoins.minerarTraPendente(endereco5);

bitcoins.printBlockchain();

console.log(`Essa blockchain é válida? ${bitcoins.validBlockchain()}`);

const historico = bitcoins.historicTransaction(keys1.address);
console.log("Histórico de transações: ", historico);






