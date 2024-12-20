const Block = require('./block');
const Keys = require('./keys');
const Transaction = require('./transaction');

class Blockchain {
    constructor(Endereco) {
        this.premioMine = 500.00;
        this.vetorSaldo = [];
        this.registraAddress("2x000000000000000000000000000000000000000000");
        this.firstAddress ="2x000000000000000000000000000000000000000000"
        this.registraAddress(Endereco);
        this.chain = [this.criaGenesis(Endereco)];
        this.dif = 4;
        this.pendenciaTrans = [];
    }

    registraAddress(endereco){

        if(!this.validAddress(endereco)){
            console.log("endereço invalido");
        }
        else{
            this.vetorSaldo.push([endereco, 0]);
        }
    }

    criarEndereco(){

        const key = new Keys();
        const endereco = key.address;
        this.registraAddress(endereco);
        return endereco;
    }


    criaGenesis(premioMine_ende) {
        
    const last_hash = ''; 
    const genesisTransacao = new Transaction(this.firstAddress, premioMine_ende, this.premioMine);  
    const genesisBlock = new Block(Date.now(), last_hash, [genesisTransacao]);
    genesisBlock.hash = genesisBlock.calcularhash(); 

    const indexDestin = this.vetorSaldo.findIndex(item => item[0] === premioMine_ende);
    if (indexDestin !== -1) {
        this.vetorSaldo[indexDestin][1] += this.premioMine;
    } else {
        console.log("Endereço inicial inválido no bloco gênesis.");
    }

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

    saldoEndereco(endereco) {

            let saldo = 0;
        
            // Calcular saldo pelas transações confirmadas na blockchain
            this.chain.forEach(block => {
                block.data.forEach(transaction => {
                    if (transaction.originEnde === endereco) {
                        saldo -= transaction.valor + transaction.taxa; // Subtrai para saídas
                    }
                    if (transaction.destinEnde === endereco) {
                        saldo += transaction.valor; // Adiciona para entradas
                    }
                });
            });
        
            // Calcular saldo pelas transações pendentes
            this.pendenciaTrans.forEach(transaction => {
                if (transaction.originEnde === endereco) {
                    saldo -= transaction.valor + transaction.taxa; // Subtrai para saídas
                }
                if (transaction.destinEnde === endereco) {
                    saldo += transaction.valor; // Adiciona para entradas
                }
            });
        
            return saldo;
        }
        
    criaTransaction(originEnde, destinEnde, valor, taxa=0) {

        if (!this.validAddress(originEnde)) {
            console.log("transação inválida: endereço de origem inválido.");
            return;
        }
    
        if (!this.validAddress(destinEnde)) {
            console.log("transação inválida: endereço de destino inválido.");
            return;
        }
    
        const saldo = this.saldoEndereco(originEnde);
    
        if (originEnde !== this.firstAddress && saldo < (valor + taxa)) {
            console.log(saldo)
            console.log(`transação inválida: saldo insuficiente. Endereço de origem: ${originEnde}, destino: ${destinEnde}`);
            return;
        } 

        const transaction = new Transaction(originEnde, destinEnde, valor, taxa);
        this.pendenciaTrans.push(transaction);

        return transaction;

    }

    updateSaldo_Block(){

        this.pendenciaTrans.forEach((transaction)=>{
            const indexOrigin = this.vetorSaldo.findIndex(item => item[0] === transaction.originEnde);
            const indexDestin = this.vetorSaldo.findIndex(item=> item[0] === transaction.destinEnde);
            this.vetorSaldo[indexOrigin][1] -= transaction.valor + transaction.taxa;
            this.vetorSaldo[indexDestin][1] += transaction.valor;
        });

        this.pendenciaTrans = [];
    }
    

    ultimoBlock() {
        return this.chain[this.chain.length - 1];
    }


    minerarTraPendente(premioMine_ende) {
        // calcular a soma de todas as taxas das transações pendentes
        let taxasTotais = 0;
        this.pendenciaTrans.forEach(transaction => {
            taxasTotais += transaction.taxa || 0; // adiciona a taxa se existir
        });
    
        const recompensaTotal = this.premioMine + taxasTotais;
    
        this.pendenciaTrans.push(new Transaction(this.firstAddress, premioMine_ende, recompensaTotal));

        let block = new Block(Date.now(), this.ultimoBlock().hash, this.pendenciaTrans);
        block.mine(this.dif);

        this.updateSaldo_Block();

        this.chain.push(block);

        if (!this.validAddress(premioMine_ende)) {
            console.log("Endereço do minerador inválido.");
        } else {
            const saldoAtual = this.saldoEndereco(premioMine_ende);
            this.saldoEndereco[premioMine_ende] = saldoAtual + recompensaTotal;
        }
    
        this.pendenciaTrans = [];


        return block;

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
                console.log(`   taxa: ${transaction.taxa}`);
            });
    
            console.log('\n'); 
        });

        this.vetorSaldo.forEach(vetor =>{
            if(vetor[0] != '2x000000000000000000000000000000000000000000'){
                console.log(vetor);
            }
        });
    }
}

module.exports = Blockchain;