const { ethers, JsonRpcProvider } = require('ethers');
const fs = require('fs-extra');

async function main(){
    try {
        const provider = new JsonRpcProvider("http://127.0.0.1:7545");
        const wallet = new ethers.Wallet("0x11a54bf18356fe703b43b75579e275a0a054abe044577ea8339f24830035992a",provider);   
        const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi","utf-8");
        const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin","utf-8");
        const contractFactory = new ethers.ContractFactory(abi,binary,wallet);
        console.log("deploying contracts...");
        const contract = await contractFactory.deploy();
        console.log("contracts deployed successfully.");
        console.log(contract);
    } catch(error) {
        console.error("Error:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("Connection to Ganache refused. Make sure Ganache is running and listening on port 7545.");
        }
        process.exit(1);
    }
}

main();
