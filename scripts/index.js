import { ethers } from "hardhat";
import { readFileSync } from "fs";

async function interactWithWall(contractAddress, newValue) {
    // Ensure the provided address is valid
    if (!ethers.utils.isAddress(contractAddress)) {
        throw new Error("Invalid Ethereum address provided.");
    }

    // Get the Wall contract instance
    const WallContract = await ethers.getContractFactory('Wall');
    const wallInstance = WallContract.attach(contractAddress);

    // Store the new value in the Wall
    await wallInstance.addEntry(newValue);
    console.log(`Stored new value: ${newValue} in Wall.`);
    
    // Retrieve the current value from the Wall
    const currentValue = await wallInstance.getLatestEntry();
    console.log('Current value in Wall:', currentValue);

    // Retrieve the history value from the Wall
    const historyValue = await wallInstance.getAllEntries();
    console.log('History value in Wall:', historyValue);
}

// Main execution
(async () => {
    const contractAddressData = readFileSync('../contracts_build/contract-address.json', 'utf8');
    const { WALL_CONTRACT_ADDRESS } = JSON.parse(contractAddressData);

    // Extract newValue from environment variable
    const newValue = process.env.NEW_VALUE;

    if (!newValue || typeof newValue !== 'string') {
        console.error("Please provide a newValue as an environment variable.");
        process.exit(1);
    }

    try {
        await interactWithWall(WALL_CONTRACT_ADDRESS, newValue);
        process.exit(0);
    } catch (error) {
        console.error("Error interacting with Wall:", error.message);
        process.exit(1);
    }
})();
