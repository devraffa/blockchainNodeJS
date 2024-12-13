const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const crypto = require('crypto');

class Node {
    constructor(id, blockchain) {

        this.blockchain = blockchain; // Instância da blockchain
        this.peers = []; // Lista de peers conectados
    }

    // Gera um ID exclusivo para uma transação
    generateTransactionID(transaction) {
        const hash = crypto.createHash('sha256');
        hash.update(transaction.originEnde + transaction.destinEnde + transaction.valor + transaction.taxa + transaction.timestamp);
        return hash.digest('hex');
    }

    // Verifica se um bloco específico já está na blockchain
    containsBlock(blockHash) {
        return this.blockchain.chain.some((block) => block.hash === blockHash);
    }

    // Verifica se uma transação específica já está no pool de transações pendentes
    containsTransaction(transactionSignature) {
        return this.blockchain.pendenciaTrans.some(
            (transaction) => transaction.signature === transactionSignature
        );
    }

    // Conecta este nó a outro nó
    connectPeer(peer) {
        if (!this.peers.includes(peer)) {
            this.peers.push(peer);
            peer.connectPeer(this); // Conexão bidirecional
        }
    }

    // Transmite um bloco para todos os peers conectados
    broadcastBlock(block) {
        this.peers.forEach(peer => {
            console.log('Nó enviando bloco para todos');
            peer.receiveBlock(block);
        });
    }

    // Transmite uma transação para todos os peers conectados
    broadcastTransaction(transaction) {
        transaction= this.generateTransactionID(transaction); // Adiciona o ID à transação
        this.peers.forEach(peer => {
            console.log('nó enviando transactions para todos');
            peer.receiveTransaction(transaction);
        });
    }

    // Recebe um bloco de outro nó
    receiveBlock(block) {
        console.log('Nó recebeu um bloco');

        // Valida o bloco
        const lastBlock = this.blockchain.ultimoBlock();
        if (block.last_hash !== lastBlock.hash) {
            console.log('hash anterior não corresponde.');
            return;
        }

        // Verifica se o bloco recebido é válido
        if (block.hash !== block.calcularhash()) {
            console.log('hash inválido.');
            return;
        }

        // Adiciona o bloco à blockchain local
        this.blockchain.chain.push(block);
        console.log('adicionou bloco à blockchain.');
    }

    // Recebe uma transação de outro nó
    receiveTransaction(transaction) {
        console.log('recebeu transação');

        // Valida os endereços e saldo na transação
        if (!this.blockchain.validAddress(transaction.originEnde) ||
            !this.blockchain.validAddress(transaction.destinEnde)) {
            console.log('rejeitou transação: endereços inválidos.');
            return;
        }

        const saldo = this.blockchain.saldoEndereco(transaction.originEnde);
        if (saldo < transaction.valor + transaction.taxa) {
            console.log('rejeitou transação: saldo insuficiente.');
            return;
        }

        // Verifica ou gera o ID da transação
        if (!transaction.id) {
            transaction.id = this.generateTransactionID(transaction);
        }

        // Adiciona a transação às pendências
        this.blockchain.pendenciaTrans.push(transaction);
        console.log('adicionou transação às pendências.');

        // Transmite a transação para os peers
        this.broadcastTransaction(transaction);
    }

    // Sincroniza a blockchain com outro nó
    syncBlockchain(peer) {
        if (peer.blockchain.chain.length > this.blockchain.chain.length) {
            console.log('sincronizando blockchain com Nó');
            this.blockchain.chain = JSON.parse(JSON.stringify(peer.blockchain.chain));
        } else {
            console.log('já possui a cadeia mais longa.');
        }
    }

    // Obtém todos os endereços envolvidos em transações da blockchain
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

    update_saldo() {
        const allAddresses = this.getAllAddresses();
        allAddresses.forEach((address) => {
            const balance = this.blockchain.saldoEndereco(address);
            this.blockchain.update_saldo(address, balance);
        });
        console.log('Saldos atualizados');
    }

    resolveFork(peer) {
        if (peer.blockchain.chain.length > this.blockchain.chain.length) {
            console.log('detectou um fork');
    
            // Substitui a cadeia local pela cadeia do peer
            this.blockchain.chain = JSON.parse(JSON.stringify(peer.blockchain.chain));
            console.log('atualizou a blockchain para a mais longa.');
    
            // Atualiza o livro de saldos
            const balanceBook = new Map();
            this.blockchain.chain.forEach((block) => {
                block.data.forEach((transaction) => {
                    const fromBalance = balanceBook.get(transaction.originEnde) || 0;
                    balanceBook.set(
                        transaction.originEnde,
                        fromBalance - (transaction.valor + transaction.taxa)
                    );
    
                    const toBalance = balanceBook.get(transaction.destinEnde) || 0;
                    balanceBook.set(
                        transaction.destinEnde,
                        toBalance + transaction.valor
                    );
                });
            });
            this.blockchain.balanceBook = balanceBook;
            console.log('atualizou os saldos.');
    
            // Remove transações pendentes que já estão em blocos
            const confirmedTransactions = new Set();
            this.blockchain.chain.forEach((block) => {
                block.data.forEach((transaction) => {
                    confirmedTransactions.add(transaction.signature);
                });
            });
    
            this.blockchain.pendenciaTrans = this.blockchain.pendenciaTrans.filter(
                (transaction) => !confirmedTransactions.has(transaction.signature)
            );
            console.log('limpou o pool de transações pendentes.');
        } else {
            console.log('manteve sua blockchain como a mais longa.');
        }
    }
        
}

module.exports = Node;
