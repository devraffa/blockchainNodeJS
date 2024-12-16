const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const Keys = require('./keys');
const Node = require('./node');

// Chaves principais e inicialização dos nós
const keys1 = new Keys();

// Inicializar blockchains associadas aos nós
const blockchain1 = new Blockchain(keys1.address);

// Criar endereços em blockchain1
const endereco3 = blockchain1.criarEndereco();
const endereco4 = blockchain1.criarEndereco();
const endereco5 = blockchain1.criarEndereco();
const endereco6 = blockchain1.criarEndereco();
const endereco7 = blockchain1.criarEndereco();

// Inicializar nós e associar suas blockchains
const node1 = new Node(blockchain1);
const node2 = new Node(blockchain1); 
const node3 = new Node(blockchain1);

// Conectar os nós
node1.connectNode(node2);
node2.connectNode(node3);
node1.connectNode(node3);

// Criar e minerar transações na blockchain1
const transaction1 = node1.blockchain.criaTransaction(keys1.address, endereco3, 20, 2);
node1.broadcastTransaction(transaction1);
const transaction2 = node1.blockchain.criaTransaction(endereco3, endereco4, 5, 4);
node1.broadcastTransaction(transaction2);
const block1 = node1.blockchain.minerarTraPendente(endereco5);
node1.broadcastBlock(block1);
node1.blockchain.printBlockchain();
node2.blockchain.printBlockchain();
node3.blockchain.printBlockchain();

// // Criar e minerar transações na blockchain2
// blockchain2.criaTransaction(node1Keys.address, end6, 10, 1);
// blockchain2.criaTransaction(end6, end7, 3, 2);
// blockchain2.minerarTraPendente(end8);
// blockchain2.printBlockchain();

// Validar as blockchains
// console.log(endereco5);
// console.log(`Blockchain 1 é válida? ${node1.blockchain.validBlockchain()}`);

// Histórico de transações
// const historico1 = node1.blockchain.historicTransaction(keys1.address);
// console.log("Histórico de transações na Blockchain 1: ", historico1);

//teste do fork
console.log("iniciando teste fork");
node2.blockchain.criaTransaction(endereco5, endereco6, 100, 150);
node2.blockchain.minerarTraPendente(endereco7);
// console.log(endereco5);
// console.log(endereco6);
// console.log(endereco7);
node1.sync(node2);
node3.sync(node2);

// // node2.broadcastTransaction(transaction3);
// // const block2 = node2.blockchain.minerarTraPendente(endereco7);
// // node2.broadcastBlock(block2);
// // node1.fork(node2);
// console.log("print dps do fork");
node1.blockchain.printBlockchain();
node2.blockchain.printBlockchain();
node3.blockchain.printBlockchain();



