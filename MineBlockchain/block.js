const crypto = require('crypto');

class Block {
    constructor(timestamp, last_hash, data) {
        this.timestamp = timestamp;
        this.last_hash = last_hash;
        this.data = data;
        this.nonce = 0;
        this.hash = this.calcularhash(); 
    }

    calcularhash() {
        return crypto.createHash('sha256').update(
            this.timestamp + this.last_hash + JSON.stringify(this.data) + this.nonce
        ).digest('hex');
        // const info = this.tempo + this.hashAnterior + JSON.stringify(this.dados) + this.nonce; erro por algum motivo
        // return crypto.createHash('sha256').update(info).digest('hex');
    }

    defTimestamp() {
        const date = new Date(this.timestamp);
        return date.toISOString();
    }
    
    mine(dif) { // tentativa de fazer uma função para mineração
        while(this.hash.substring(0, dif) !== '0'.repeat(dif)){
            this.nonce++;
            this.hash = this.calcularhash();
        }

        /*for (this.nonce = 0; !found; this.nonce++) {
                this.hash = this.calculateBlockHash();
                found = this.hash.substring(0, difficulty) === target;
            }*/
    }
    
}

module.exports = Block;