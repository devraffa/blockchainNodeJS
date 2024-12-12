const Blockchain = require('./blockchain');

class Node{

    constructor(blockchain){
        
        this.blockchain = blockchain;
        this.peer = [];
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
        console.log(`Nó ${this.id} recebeu um bloco`);
        
        // valida o obloco
        if (!this.blockchain.validBlockchain()) {
            console.log(`Nó ${this.id} rejeitou bloco inválido`);
            return;
        }

        // verificar fork
        if (this.blockchain.chain.length >= block.index) {
            console.log(`Nó ${this.id} detectou fork`);
            this.resolveFork(block);
        } else {
            console.log(`Nó ${this.id} adicionando bloco à blockchain`);
            this.blockchain.chain.push(block);
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

    syncBlockchain(peer) {
        console.log(`Nó ${this.id} sincronizando blockchain com Nó ${peer.id}`);
        this.blockchain.chain = [...peer.blockchain.chain];
    }

    getAllAddresses() {
        const addresses = new Set();
        this.blockchain.chain.forEach(block => {
            block.data.forEach(transaction => {
                addresses.add(transaction.originEnde);
                addresses.add(transaction.destinEnde);
            });
        });
        return Array.from(addresses);
    }


}

module.exports = Node;