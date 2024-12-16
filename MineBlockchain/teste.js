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

//teste do fork
console.log("iniciando teste fork");
node2.blockchain.criaTransaction(endereco5, endereco6, 100, 150);
node2.blockchain.minerarTraPendente(endereco7);

node1.sync(node2);
node3.sync(node2);

node1.blockchain.printBlockchain();
node2.blockchain.printBlockchain();
node3.blockchain.printBlockchain();



