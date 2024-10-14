const Block = require('./block');
const Transaction = require('./transaction');

class Blockchain {
    constructor(address) {
        this.premioMine = 500.00;
        this.chain = [this.createGenesis(address)];
        this.dif = 4;
        this.pendenciaTrans = [];
    }

    createGenesis(premioMineAddress) {
        const primeHash = '0000000';  // exemplo do bloco gênesis
        const genesi_transacao = new Transaction(null, premioMineAddress, this.premioMine);  // certo dessa vez
        //const transacaoGenesis = new Transacao('[]', address, this.premioMine);
        return new Block(Date.now(), primeHash, [genesi_transacao]
    
    );
    }

    getSaldoAddress(address) {
        let saldo = 0;

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.originEnde === address) {
                    saldo -= transaction.valor;
                }
                if (transaction.destinEnde === address) {
                    saldo += transaction.valor;
                }
            });
        });

        return saldo;
    }

    createTransaction(transaction) {
        const saldo = this.getSaldoAddress(transaction.originEnde);
        let pendente = 0;

        this.pendenciaTrans.forEach(tx => {
            if (tx.originEnde === transaction.originEnde) {
                pendente += tx.valor;
            }
        });


        if (saldo - pendente < transaction.valor) {
            console.log('transação inválida: saldo insuficiente.');
        } else {
            this.pendenciaTrans.push(transaction);
        }
    }


    getultimoBlock() {
        return this.chain[this.chain.length - 1];
    }

    minerarTraPendente(premioMineAddress) {
        this.pendenciaTrans.push(new Transaction(null, premioMineAddress, this.premioMine));

        let block = new Block(Date.now(), this.getultimoBlock().hash, this.pendenciaTrans);
        block.mine(this.dif);

        this.chain.push(block);
        this.pendenciaTrans = []; 
    }

    validBlockchain() {
        console.log("iniciando validação da blockchain");

        for (let i = 1; i < this.chain.length; i++) {
            const atualBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // hash anterior
            if (atualBlock.last_hash !== previousBlock.hash) {
                console.log("hash do bloco anterior não corresponde");
                return false;
            }

            // hash atual
            if (atualBlock.hash !== atualBlock.calcularhash()) {
                console.log("hash do bloco foi alterado");
                return false;
            }
        }

        return true;
    }

    printBlockchain() {
        this.chain.forEach(block => {
            console.log(`Block
        nonce: ${block.nonce}
        hash: ${block.hash}
        timestamp: ${block.defTimestamp()}
        last Hash: ${block.last_hash}`
            );

            console.log("Transaction:");
            block.data.forEach(transaction => {
                console.log(`   origin Address: ${transaction.originEnde}`);
                console.log(`   destiny Address: ${transaction.destinEnde}`);
                console.log(`   valor: ${transaction.valor}`);
            });
    
            console.log('\n'); 
        });
    }
}

module.exports = Blockchain;