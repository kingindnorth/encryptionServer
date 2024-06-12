const express = require("express")
const cryptop = require("crypto")
const axios = require("axios")

const app = express()


const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6mdJ/n05p5oKmQOsTraN
7zB6OZVSOCqRILq/cAN/cdledP+ZtCg/PVykIqk+DZH87ewgh5fV4+s+H+FgNfSy
X/oEubK3YCJ9oO2rdcKAQ3ZCbR4pMJfb+43C+NJkCYWhQsaVqLPAsokrChs6OyB5
elLwrszNda44oRMtBkH6psiZxCHruBkniOFTTnBjH5dlwXt3oBQTI74IaVKAIBeZ
3KAzYm8YqYRAzhcIp5kfR9nukiwt9iZgJvP69tZ5cvRgHml/SXohMhfsjKpB4DGL
QZHrB7RBaYNNJWsQhi+k9EIxy0rvJz+qF2kpTEb4euynqowUKXJq+q/3JHdQRPhY
AwIDAQAB
-----END PUBLIC KEY-----`

// Encrypt function
function encryptUsingPublicKey(password, publicKey) {
  // Create a buffer from the password
  const secretMessageBuffer = Buffer.from(password, 'utf8');

  // Load the public key
  const loadedPublicKey = cryptop.createPublicKey(publicKey);

  // Encrypt the password using RSA algorithm
  const encryptedMessageBuffer = cryptop.publicEncrypt(
    {
      key: loadedPublicKey,
      padding: cryptop.constants.RSA_PKCS1_PADDING,
    },
    secretMessageBuffer,
  );

  // Encode the encrypted password using Base64
  const encryptedPassword = encryptedMessageBuffer.toString('base64');
  return encryptedPassword;
}

// Usage example
const password = "Password@1309";
const encryptedPassword = encryptUsingPublicKey(password, publicKey)
    console.log('Encrypted Password:', encryptedPassword);
    let applicationSecretPlainText = "virema@123$"
    const randomSalt = cryptop.randomBytes(10).toString('hex');
    console.log(randomSalt.length)
    applicationSecretPlainText = applicationSecretPlainText + randomSalt;

    const hash = cryptop.createHash('sha256');
    hash.update(applicationSecretPlainText);
    const generatedHash = hash.digest('base64');

    const applicationSecret = randomSalt + generatedHash;
   console.log(applicationSecret)
   const headers = {
    "Application-Id": "15000000010161",
    "Application-Secret": applicationSecret,
    "Services": "APPROVAL",
    "Content-Type": "application/json",
    "x-apikey": "AQw6Ha94o1PCAnqJZe3HOqEO1QnMC7G9eeNf7dv6hYWaQxAP"
}
const body = {
  "searchAttributes": [
    {
      "attributeName": "USER_ID",
      "attributeValue": "872342"
    }
  ],
  "notification": [
    {
      "notificationType": "EMAIL",
      "messageBody": "Dear Customer, <OTP> is the OTP to LOGIN to ICICI Bank VRM. OTPs are SECRET. DO NOT disclose it to anyone. Bank NEVER asks for OTP.",
      "templateId": "TMPT1001"
    },
    {
      "notificationType": "SMS",
      "messageBody": "Dear Customer, <OTP> is the OTP to LOGIN to ICICI Bank VRM. OTPs are SECRET. DO NOT disclose it to anyone. Bank NEVER asks for OTP.",
      "templateId": "TMPT1001"
    }
  ],
  "password": encryptedPassword
}

//gateway encryption

// Generate a random encryption key and initialization vector (IV)
const encryptionKey = cryptop.randomBytes(32);
const iv = encryptionKey.slice(0, 16);

console.log(iv,"fjfd")

console.log("-----------")
console.log(encryptionKey,iv)

//encrypt body
    const payloadBody = JSON.stringify(body);
    const cipherB = cryptop.createCipheriv('aes-256-cbc', encryptionKey,iv); //symmetric encryption algorithm. 
    console.log("working")
    let encryptedBodyData = cipherB.update(payloadBody, 'utf8', 'base64');
    encryptedBodyData += cipherB.final('base64');
//encrypt header
const payloadHeader = JSON.stringify(headers);
const cipherH = cryptop.createCipheriv('aes-256-cbc', encryptionKey, iv); //symmetric encryption algorithm. 
let encryptedHeaderData = cipherH.update(payloadHeader, 'utf8', 'base64');
encryptedHeaderData += cipherH.final('base64');

// Encrypt the encryption key and IV using the third-party public key
const encryptedKey = cryptop.publicEncrypt(publicKey, Buffer.from(encryptionKey, 'base64'));
const encryptedIV = cryptop.publicEncrypt(publicKey, Buffer.from(iv, 'base64'));

// Convert the encrypted key and IV to base64 strings
const encryptedKeyBase64 = encryptedKey.toString('base64');
const encryptedIVBase64 = encryptedIV.toString('base64');
const encryptionFinalKey = encryptedKeyBase64 

const encrypyedFinalBody = {
    data:encryptedBodyData,
    encryptionKey: encryptionFinalKey
}

console.log(encrypyedFinalBody)
console.log("-----------------------")
console.log({headers:encryptedHeaderData})

// // Third-party server's public key
// const thirdPartyPublicKey = `-----BEGIN RSA PUBLIC KEY-----
// MIIBCgKCAQEA8BxmiItetM08GA3mOdTMeA5Z0pzCO5ZFPDrgzzy0gwBJC02EXcve
// tx3WbG1O1/yIZuAHXOeYoTOGXbRiTCzukXvDLhhs3vPFhgFFKuVrOEgbaB8m+m/b
// l1VuQNS/9XBTGJa3nYyqTZ+C7ermcKLnjUiHyuivMRSUlIKhmZeRz6JQ3Fw2/LaC
// nyjKt3ofqacsT8v9JdPjCQc8dB0plHoB0QoHS38aqLwlbrQ2363mJO662vhzE4zW
// n9UsEjDg4mkN6uc42qM9LfwTJF2u+OKwDU4DM/WxRaDxZxxA4oN+Kjy+MW0besPH
// 7p3hrexE7QFFi/qNM50RQHOnHfRz5URZLwIDAQAB
// -----END RSA PUBLIC KEY-----`;

// // Generate a random encryption key and initialization vector (IV)
// const encryptionKey = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

// console.log(`encryptionKey: ${encryptionKey.toString("base64")}, ${encryptionKey}
//             iv: ${iv.toString("base64")}
// `)

// // const rsa = new NodeRSA(thirdPartyPublicKey, 'public', {
// //     encryptionScheme: {
// //       scheme: 'pkcs1',
// //       hash: 'sha256',
// //     },
// //   });

// // const encryptedKey = rsa.encrypt(encryptionKey, 'base64');
// // const encryptedIV = rsa.encrypt(iv, 'base64');
    
// // console.log('Encrypted Key:', encryptedKey);
// // console.log('Encrypted IV:', encryptedIV);

// // Convert encryption key and IV to base64 format
// // const keyBase64 = Buffer.from(encryptionKey, 'base64')
// // const ivBase64 = Buffer.from(iv, "base64")

// // Encrypt the encryption key and IV using the third-party public key
// const encryptedKey = crypto.publicEncrypt(thirdPartyPublicKey, Buffer.from(encryptionKey, 'base64'));
// const encryptedIV = crypto.publicEncrypt(thirdPartyPublicKey, Buffer.from(iv, 'base64'));

// // Convert the encrypted key and IV to base64 strings
// const encryptedKeyBase64 = encryptedKey.toString('base64');
// const encryptedIVBase64 = encryptedIV.toString('base64');

// console.log(`encryptedkey :${encryptedKeyBase64} 
//              encryptedIV  :${encryptedIVBase64}
// `)

// // Encrypt the payload
// //Advanced Encryption Standard (AES) algorithm in Cipher Block Chaining (CBC)
// function encryptPayload(payloadString) {
//     const payload = JSON.stringify(payloadString);
//     const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv); //symmetric encryption algorithm. 
//     let encryptedData = cipher.update(payload, 'utf8', 'base64');
//     encryptedData += cipher.final('base64');
//     return {
//       data: encryptedData,
//       iv: iv.toString('base64'),
//     };
//   }

// const payload = {
//     key1:"Hi shiv",
//     key2:"Hi moshin",
//     key3:"Hi adarsh"
// };
// const encryptedPayload = encryptPayload(payload);
// console.log('Encrypted Payload:', encryptedPayload);

// //send data and keys to server 2
// app.use("/sendEncryptedData",async(req,res)=>{
//   try{
//     //send an http request to server 2
//     const url = "http://localhost:2000/decryptPayload"
//     const data = {
//       encryptedPayload,
//       encryptedKeyBase64,
//       encryptedIVBase64
//     }
//     const response = await axios.post(url,data)
//     if(!response) res.send("could not send data to server 2")
//     res.send("data sent to server 2")
//   }catch(err){
//     console.log(err)
//   }
// })

app.listen(3000,()=>{
    console.log(`server running`)
})