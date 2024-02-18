const { ethers, JsonRpcProvider } = require('ethers');
const fs = require('fs-extra');
require('dotenv').config();

async function main(){
    try {
        const provider = new JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY,provider); 
        
        const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi","utf-8");
        const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin","utf-8");
        const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
        
        console.log("Deploying contracts...");
        const contract = await contractFactory.deploy();
        await contract.deploymentTransaction().wait(2);
        const address = await contract.getAddress();
        console.log(`contract : ${address}`);
        let currentFavoriteNumber = await contract.retrieve();
        console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
        
        console.log("Updating favorite number...");
        const nonce = await provider.getTransactionCount(wallet.address);
        let transactionResponse = await contract.store(45, { nonce });
        let transactionReceipt = await transactionResponse.wait(1);
        
        currentFavoriteNumber = await contract.retrieve();
        console.log(`New Favorite Number: ${currentFavoriteNumber}`);
        console.log("Contract deployed successfully");
    } catch(error) {
        console.error("Error:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("Connection to Ganache refused. Make sure Ganache is running and listening on port 7545.");
        }
        process.exit(1);
    }
}

main();
