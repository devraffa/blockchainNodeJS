const Blockchain = require('./blockchain');

class Node{

    constructor(id) {
        this.id = id; 
        this.blockchain = new Blockchain('2x000000000000000000000000000000000000000001'); 
        this.peers = []; 
    }

    connectPeer(peer){
        this.peers.push(peer);
    }

    broadcastBlock(block) {
        this.peers.forEach(peer => {
            console.log(`Nó ${this.id} enviando bloco para Nó ${peer.id}`);
            peer.receiveBlock(block);
        });
    }

    broadcastTransaction(transaction) {
        this.peers.forEach(peer => {
            console.log(`Nó ${this.id} enviando transação para Nó ${peer.id}`);
            peer.receiveTransaction(transaction);
        });
    }

    receiveBlock(block) {
        if (this.blockchain.validBlockchain()) {
            console.log(`Nó ${this.id} recebeu bloco válido`);
            this.blockchain.chain.push(block);
        } else {
            console.log(`Nó ${this.id} rejeitou bloco inválido`);
        }
    }

    receiveTransaction(transaction) {
        console.log(`Nó ${this.id} recebeu transação`);
        this.blockchain.criaTransaction(
            transaction.originEnde,
            transaction.destinEnde,
            transaction.valor
        );
    }
}

module.exports = Node;