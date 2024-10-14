const Block = require('./block');
const Transaction = require('./transaction');

class Blockchain {
    constructor(Endereco) {
        this.premioMine = 500.00;
        this.chain = [this.criaGenesis(Endereco)];
        this.dif = 4;
        this.pendenciaTrans = [];
    }

    criaGenesis(premioMine_ende) {
        const primeHash = '0000000';  // exemplo do bloco gênesis
        const genesi_transacao = new Transaction("genesi", premioMine_ende, this.premioMine);  // certo dessa vez
        //const transacaoGenesis = new Transacao('[]', Endereco, this.premioMine);
        return new Block(Date.now(), primeHash, [genesi_transacao]);
        
    }

    saldoEndereco(Endereco) {
        let saldo = 0;

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.originEnde === Endereco) {
                    saldo -= transaction.valor;
                }
                if (transaction.destinEnde === Endereco) {
                    saldo += transaction.valor;
                }
            });
        });

        return saldo;
    }

    criaTransaction(transaction) {
        const saldo = this.saldoEndereco(transaction.originEnde);

        if (saldo < transaction.valor) {
            console.log('transação inválida: saldo insuficiente.');
        } else {
            this.pendenciaTrans.push(transaction);
        }
    }

    ultimoBlock() {
        return this.chain[this.chain.length - 1];
    }

    minerarTraPendente(premioMine_ende) {
        this.pendenciaTrans.push(new Transaction("origem", premioMine_ende, this.premioMine));

        let block = new Block(Date.now(), this.ultimoBlock().hash, this.pendenciaTrans);
        block.mine(this.dif);

        this.chain.push(block);
        this.pendenciaTrans = []; 
    }

    validBlockchain() {
        console.log("iniciando validação da blockchain");

        for (let i = 1; i < this.chain.length; i++) {
            const atualBlock = this.chain[i];
            const anteriorBlock = this.chain[i - 1];

            // hash anterior
            if (atualBlock.last_hash !== anteriorBlock.hash) {
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
                console.log(`   origin Endereco: ${transaction.originEnde}`);
                console.log(`   destiny Endereco: ${transaction.destinEnde}`);
                console.log(`   valor: ${transaction.valor}`);
            });
    
            console.log('\n'); 
        });
    }
}

module.exports = Blockchain;