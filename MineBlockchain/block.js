class Block{
    constructor(timestamp, lasthash, hash, data, nonce){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    genesis(){
        return new this('Gensesis time', '---------', 'JHJHSD', []);
    }

    hash(){
        
    }
}

class Transasion{
    constructor(destinoAdress, fromAdress, valor){
            this.fromAdress = fromAdress;
            this.destinoAdress = destinoAdress;
            this.valor = valor;
    }
}

class Blockchain{
    constructor(){
    this.chain=[];
    this.pedenciatransation=[];
    }
}