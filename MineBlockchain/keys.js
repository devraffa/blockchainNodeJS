const crypto = require('crypto');

class Keys {

  constructor() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
      namedCurve: "secp256k1",
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
    });
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.address = this.generateAddressFromKey(this.publicKey);
  }

  generateAddressFromKey(publicKey) {
    const sha256Hash = crypto.createHash("sha256").update(publicKey).digest();
    const ripemd160 = crypto.createHash("ripemd160").update(sha256Hash).digest("hex");    
    const prefix = "2x00";

    return prefix.concat(ripemd160);
  }

  /*verifyTransaction(transaction) {
    const validAddress = (address) => /^2x00[0-9a-fA-F]{40}$/.test(address);

    if (!validAddress(transaction.fromAddress) || !validAddress(transaction.toAddress)) {
      return false; 
    }

    return true;
  }*/
}

module.exports = Keys;
