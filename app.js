const express = require("express")
const crypto = require("crypto")

const app = express()

// Third-party server's public key
const thirdPartyPublicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEA8BxmiItetM08GA3mOdTMeA5Z0pzCO5ZFPDrgzzy0gwBJC02EXcve
tx3WbG1O1/yIZuAHXOeYoTOGXbRiTCzukXvDLhhs3vPFhgFFKuVrOEgbaB8m+m/b
l1VuQNS/9XBTGJa3nYyqTZ+C7ermcKLnjUiHyuivMRSUlIKhmZeRz6JQ3Fw2/LaC
nyjKt3ofqacsT8v9JdPjCQc8dB0plHoB0QoHS38aqLwlbrQ2363mJO662vhzE4zW
n9UsEjDg4mkN6uc42qM9LfwTJF2u+OKwDU4DM/WxRaDxZxxA4oN+Kjy+MW0besPH
7p3hrexE7QFFi/qNM50RQHOnHfRz5URZLwIDAQAB
-----END RSA PUBLIC KEY-----`;

// Generate a random encryption key and initialization vector (IV)
const encryptionKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

console.log(`encryptionKey: ${encryptionKey.toString("base64")}, ${encryptionKey}
            iv: ${iv.toString("base64")}
`)

// const rsa = new NodeRSA(thirdPartyPublicKey, 'public', {
//     encryptionScheme: {
//       scheme: 'pkcs1',
//       hash: 'sha256',
//     },
//   });

// const encryptedKey = rsa.encrypt(encryptionKey, 'base64');
// const encryptedIV = rsa.encrypt(iv, 'base64');
    
// console.log('Encrypted Key:', encryptedKey);
// console.log('Encrypted IV:', encryptedIV);

// Convert encryption key and IV to base64 format
// const keyBase64 = Buffer.from(encryptionKey, 'base64')
// const ivBase64 = Buffer.from(iv, "base64")

// Encrypt the encryption key and IV using the third-party public key
const encryptedKey = crypto.publicEncrypt(thirdPartyPublicKey, Buffer.from(encryptionKey, 'base64'));
const encryptedIV = crypto.publicEncrypt(thirdPartyPublicKey, Buffer.from(iv, 'base64'));

// Convert the encrypted key and IV to base64 strings
const encryptedKeyBase64 = encryptedKey.toString('base64');
const encryptedIVBase64 = encryptedIV.toString('base64');

console.log(`encryptedkey :${encryptedKeyBase64} 
             encryptedIV  :${encryptedIVBase64}
`)

// Encrypt the payload
//Advanced Encryption Standard (AES) algorithm in Cipher Block Chaining (CBC)
function encryptPayload(payloadString) {
    const payload = JSON.stringify(payloadString);
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv); //symmetric encryption algorithm. 
    let encryptedData = cipher.update(payload, 'utf8', 'base64');
    encryptedData += cipher.final('base64');
    return {
      data: encryptedData,
      iv: iv.toString('base64'),
    };
  }

const payload = {
    key1:"value1",
    key2:"value2",
    key3:"value3"
};
const encryptedPayload = encryptPayload(payload);
console.log('Encrypted Payload:', encryptedPayload);  

app.listen(3000,()=>{
    console.log(`server running`)
})