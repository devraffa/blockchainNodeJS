const cloneDeep = require('lodash/cloneDeep');

class Node {
    constructor(blockchain) {

        this.blockchain = cloneDeep(blockchain); // Instância da blockchain
        this.peers = new Set();
    }

    //se já tem aquele bloco na blockchain
    IFcontainsBlock(blockHash){
        return this.blockchain.chain.some((block)=> block.hash === blockHash);
    }

    //se já tem aquela transação
    IFcontainsTransaction(transactions){
        return this.blockchain.pendenciaTrans.some((transaction) => transaction.id === transactions.id);
    }

    // Conecta este nó a outro nó
    connectNode(peer) {

        if (!this.peers.has(peer)) {  // Verifica se o peer já está na lista
            this.peers.add(peer);     // Adiciona o peer ao Set
            peer.peers.add(this);     // Adiciona este nó ao Set do peer
        }
    
    }

    // Transmite um bloco para todos os peers conectados
    broadcastBlock(block) {
        
        console.log("inicio broadcast");

            console.log("detro do if broadcast");
            this.peers.forEach(peer => {
            console.log('Nó enviando bloco para todos');
            peer.receiveBlock(block);
            
        });

    }

    // Transmite uma transação para todos os peers conectados
    broadcastTransaction(transaction) { 

        this.peers.forEach(peer => {
            console.log('nó enviando transactions para todos');
            peer.receiveTransaction(transaction);

        });
    }

    // Recebe um bloco de outro nó
    receiveBlock(block) {
        console.log('Nó recebeu um bloco');

        if (block.hash !== block.calcularhash()) {
            console.log('hash inválido.');
            return;
        }
        
        const lastBlock = this.blockchain.ultimoBlock();
        if (block.last_hash !== lastBlock.hash) {
            console.log('hash anterior não corresponde.');
            return;
        }

        // Adiciona o bloco à blockchain local
        this.blockchain.chain.push(block);
        console.log('adicionou bloco à blockchain.');

        this.update_saldo(block);
        this.removeTransaction(block);
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
        if (transaction.id != transaction.generateID(transaction)) {
            console.log("id invalido");
        }

        // Adiciona a transação às pendências
        this.blockchain.pendenciaTrans.push(transaction);
        console.log('adicionou transação às pendências.');

    }

    // //resolver o fork
    sync(peer) {
        if (peer.blockchain.chain.length > this.blockchain.chain.length) {
            console.log('Sincronizando blockchain com nó');
            this.blockchain = cloneDeep(peer.blockchain); // Cópia profunda da blockchain do peer
            this.broadcastBlock(peer.blockchain.chain[peer.blockchain.chain.length - 1]); // Propaga o bloco mais recente
        } else {
            console.log('Já possui a cadeia mais longa.');
        }
    }

    update_saldo(block) {
        block.data.forEach((transaction) => {
            const indexOrigin = this.blockchain.vetorSaldo.findIndex(item => item[0] === transaction.originEnde);
            const indexDestin = this.blockchain.vetorSaldo.findIndex(item => item[0] === transaction.destinEnde);
    
            // Verifique se os índices foram encontrados
            if (indexOrigin === -1) {
                console.log(`Endereço de origem não encontrado: ${transaction.originEnde}`);
                return;
            }
            if (indexDestin === -1) {
                console.log(`Endereço de destino não encontrado: ${transaction.destinEnde}`);
                return;
            }
    
            // Atualiza os saldos se os índices forem válidos
            this.blockchain.vetorSaldo[indexOrigin][1] -= transaction.valor + transaction.taxa;
            this.blockchain.vetorSaldo[indexDestin][1] += transaction.valor;
    
            console.log(`Saldo atualizado: ${transaction.originEnde} -> ${this.blockchain.vetorSaldo[indexOrigin][1]}`);
            console.log(`Saldo atualizado: ${transaction.destinEnde} -> ${this.blockchain.vetorSaldo[indexDestin][1]}`);
        });
    }
    
    removeTransaction(block){

        block.data.forEach((transaction) =>{
            if(this.IFcontainsTransaction(transaction)){
                const indexT = this.blockchain.pendenciaTrans.findIndex(item => item.id === transaction.id)
                this.blockchain.pendenciaTrans.splice(indexT, 1);
                console.log(`Transação com id ${transaction.id} removida.`);
            }
            else{
                console.log("não achada a transação");
            }
        });       
}
}

module.exports = Node;
