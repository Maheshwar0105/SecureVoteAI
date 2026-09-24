const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const VotingSystem = await ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();
  await votingSystem.waitForDeployment();

  const contractAddress = await votingSystem.getAddress();
  console.log("VotingSystem deployed to address:", contractAddress);

  // Write contract address artifact for frontend
  const addressPath = path.join(__dirname, "../../frontend/src/config/contractAddress.json");
  try {
    fs.writeFileSync(
      addressPath,
      JSON.stringify({ address: contractAddress, deployedAt: new Date().toISOString() }, null, 2)
    );
    console.log("Updated contract address saved to:", addressPath);
  } catch (err) {
    console.warn("Could not write contract address to frontend config:", err.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

