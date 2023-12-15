import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const loan = await ethers.deployContract("Loan", ['0xB2b5841DBeF766d4b521221732F9B618fCf34A87']);

    console.log("Loan address:", await loan.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });