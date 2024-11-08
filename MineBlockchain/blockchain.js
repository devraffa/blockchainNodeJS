const Block = require('./block');
const Transaction = require('./transaction');

class Blockchain {
    constructor(Endereco) {
        this.premioMine = 500.00;
        this.firstAddress ="2x000000000000000000000000000000000000000000"
        this.chain = [this.criaGenesis(Endereco)];
        this.dif = 4;
        this.pendenciaTrans = [];
    }

    criaGenesis(premioMine_ende) {
        
    const last_hash = ''; 
    const genesisTransacao = new Transaction(this.firstAddress, premioMine_ende, this.premioMine);  
    const genesisBlock = new Block(Date.now(), last_hash, [genesisTransacao]);
    genesisBlock.hash = genesisBlock.calcularhash(); 
    return genesisBlock;
        
    }

    validAddress(endereco) {

        console.log("Verificando endereço: ", endereco);

    if (typeof endereco !== 'string') {
        console.log("Endereço inválido: O endereço não é uma string.");
        return false;
    }
    
        const fix = '2x00';
        if (!endereco.startsWith(fix)) {
            return false;
        }

        const addressnotfix = endereco.slice(fix.length);
        if (addressnotfix.length !== 40) {
            return false;
        }
            
        const hexRegex = /^[0-9a-fA-F]{40}$/;
        return hexRegex.test(addressnotfix);
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
            // para as pendetes que bugavam 
        this.pendenciaTrans.forEach(transaction => {
            if (transaction.originEnde === Endereco) {
                saldo -= transaction.valor;
            }
            if (transaction.destinEnde === Endereco) {
                saldo += transaction.valor;
            }
        });

        return saldo;
    }

    criaTransaction(originEnde, destinEnde, valor) {

        if (!this.validAddress(originEnde)) {
            console.log("transação inválida: endereço de origem inválido.");
            return;
        }
    
        if (!this.validAddress(destinEnde)) {
            console.log("transação inválida: endereço de destino inválido.");
            return;
        }
    
        const saldo = this.saldoEndereco(originEnde);
    
        if (saldo < valor && originEnde !== this.firstAddress) {
            console.log('transação inválida: saldo insuficiente.');
            return;
        } 

        const transaction = new Transaction(originEnde, destinEnde, valor);
        this.pendenciaTrans.push(transaction);
    }
    

    ultimoBlock() {
        return this.chain[this.chain.length - 1];
    }

    minerarTraPendente(premioMine_ende) {
        this.pendenciaTrans.push(new Transaction(this.firstAddress, premioMine_ende, this.premioMine));

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

    historicTransaction(Endereco){
        const history = [];

        this.chain.forEach((block) => {
            block.data.forEach((transaction) => {
                if (
                    transaction.originEnde === Endereco ||
                    transaction.destinEnde === Endereco
                ) {
                    history.push(transaction);
                }
            });
        });

        return history;
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