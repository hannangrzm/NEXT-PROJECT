// scripts/deploy.ts
import * as dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DonationMetaTx = require("../artifacts/contracts/DonationMetaTx.sol/DonationMetaTx.json");

async function main() {
    //Connect to Quorum RPC
    if (!process.env.RPC_URL) throw new Error("Missing RPC_URL in .env");
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    //Load deployer wallet
    if (!process.env.PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY in .env");
    const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("Deploying DonationMetaTx contract using account:", deployer.address);

    //Deploy the DonationMetaTx contract
    const DonationMetaTxFactory = new ethers.ContractFactory(
        DonationMetaTx.abi,
        DonationMetaTx.bytecode,
        deployer
    );

    // Pass in constructor args (name, version)
    const contract = await DonationMetaTxFactory.deploy("DonationMetaTx", "1");
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    console.log("DonationMetaTx deployed to:", contractAddress);

    //(Optional) Log domain separator to verify EIP-712 setup
    const domainSeparator = await (contract as any).DOMAIN_SEPARATOR?.();
    if (domainSeparator) {
        console.log("DOMAIN_SEPARATOR:", domainSeparator);
    }

    console.log("🎉 Deployment complete!");
}

main().catch((err) => {
    console.error("Deployment failed:", err);
    process.exit(1);
});
