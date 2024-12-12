
class Transaction {
    constructor(originEnde, destinEnde, valor, taxa = 0) {
        this.originEnde = originEnde;
        this.destinEnde = destinEnde;
        this.valor = valor;
        this.taxa = taxa;
    }
}

module.exports = Transaction;