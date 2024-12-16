const crypto = require('crypto');

class Transaction {
    constructor(originEnde, destinEnde, valor, taxa = 0) {
        this.originEnde = originEnde;
        this.destinEnde = destinEnde;
        this.valor = valor;
        this.taxa = taxa;

        this.id = this.generateID(this);
    }

    generateID(transaction) {
        const hash = crypto.createHash('sha256');
        hash.update(transaction.originEnde + transaction.destinEnde + transaction.valor + transaction.taxa + transaction.timestamp);
        return hash.digest('hex');
    }

}

module.exports = Transaction;