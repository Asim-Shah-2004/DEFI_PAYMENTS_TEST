const { ethers, JsonRpcProvider } = require('ethers');
const fs = require('fs-extra');
require('dotenv').config();

async function main(){
    try{
        const provider = new JsonRpcProvider(process.env.BLOCKCHAIN_CONNECTION); // Assuming you have a provider defined somewhere
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);   
        const encryptedKey = await wallet.encrypt(process.env.PASSWORD);
        console.log(encryptedKey);
        fs.writeFileSync('./.encryptedKey.json',encryptedKey);
    }catch(error){
        console.error("Error:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("Connection to Ganache refused. Make sure Ganache is running and listening on port 7545.");
        }
        process.exit(1);
    }
}


main();