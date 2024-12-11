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
        // Calcular a soma de todas as taxas das transações pendentes
        let taxasTotais = 0;
        this.pendenciaTrans.forEach(transaction => {
            taxasTotais += transaction.taxa || 0; // Adiciona a taxa se existir
        });
    
        // Recompensa total para o minerador = prêmio fixo + taxas totais
        const recompensaTotal = this.premioMine + taxasTotais;
    
        // Criar uma transação de recompensa para o minerador
        this.pendenciaTrans.push(new Transaction(this.firstAddress, premioMine_ende, recompensaTotal));
    
        // Criar e minerar o novo bloco
        let block = new Block(Date.now(), this.ultimoBlock().hash, this.pendenciaTrans);
        block.mine(this.dif);
    
        // Adicionar o bloco à blockchain
        this.chain.push(block);
    
        // Atualizar o saldo do minerador
        if (!this.validAddress(premioMine_ende)) {
            console.log("Endereço do minerador inválido.");
        } else {
            const saldoAtual = this.saldoEndereco(premioMine_ende);
            this.saldoEndereco[premioMine_ende] = saldoAtual + recompensaTotal;
        }
    
        // Limpar as transações pendentes
        this.pendenciaTrans = [];
    }
    

    /*minerarTraPendente(premioMine_ende) {
        this.pendenciaTrans.push(new Transaction(this.firstAddress, premioMine_ende, this.premioMine));

        let block = new Block(Date.now(), this.ultimoBlock().hash, this.pendenciaTrans);
        block.mine(this.dif);

        this.chain.push(block);
        this.pendenciaTrans = []; 
    }*/

        resolveFork(newChain) {
            // Verifica se a nova cadeia tem mais blocos do que a atual
            if (newChain.length > this.chain.length) {
                console.log("Novo fork detectado. Adotando a cadeia mais longa.");
        
                // Verifica se a nova cadeia é válida
                if (this.validBlockchain(newChain)) {
                    // Substitui a cadeia atual pela nova cadeia
                    this.chain = newChain;
                } else {
                    console.log("A nova cadeia não é válida. Não será adotada.");
                }
            } else {
                console.log("A cadeia atual é mais longa ou igual. Não é necessário resolver o fork.");
            }
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