import { SigningArchwayClient } from "@archwayhq/arch3.js";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { readFileSync, writeFileSync } from "fs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();
console.log(process.env);
// Constants for deployment
const NETWORK = process.env.NETWORK || "testnet"; // 'testnet' or 'mainnet'
const CHAIN_ID = NETWORK === "mainnet" ? "archway-1" : "constantine-3";
const RPC_ENDPOINT =
  NETWORK === "mainnet"
    ? "https://rpc.mainnet.archway.io"
    : "https://rpc.constantine.archway.io";

interface DeploymentConfig {
  network: string;
  contracts: {
    [key: string]: {
      codeId?: number;
      address?: string;
    };
  };
}

async function deploy() {
  console.log(`Starting deployment on ${NETWORK}...`);

  try {
    // Setup wallet and client
    if (!process.env.MNEMONIC) {
      throw new Error("MNEMONIC environment variable is not set");
    }

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env.MNEMONIC,
      { prefix: "archway" },
    );

    const [account] = await wallet.getAccounts();
    console.log(`Deploying from account: ${account.address}`);

    const client = await SigningArchwayClient.connectWithSigner(
      RPC_ENDPOINT,
      wallet,
    );

    let config: DeploymentConfig = {
      network: NETWORK,
      contracts: {},
    };

    // Load existing config if exists
    try {
      const existingConfig = readFileSync(
        path.join(__dirname, `../config/deployment.${NETWORK}.json`),
        "utf-8",
      );
      config = JSON.parse(existingConfig);
    } catch (error) {
      console.log("No existing config found, creating new one...");
    }

    // 1. Deploy Core NFT Contract
    console.log("Deploying UL-NFT Core contract...");
    const ulNftWasm = readFileSync(
      path.join(__dirname, "../artifacts/ul_nft_core-aarch64.wasm"),
    );
    const ulNftResult = await client.upload(
      account.address,
      ulNftWasm,
      "auto",
      "UL-NFT Core Upload",
    );
    console.log(`UL-NFT Core uploaded with code ID: ${ulNftResult.codeId}`);
    config.contracts.ulNft = { codeId: ulNftResult.codeId };

    // 2. Deploy Marketplace Contract
    console.log("Deploying Marketplace contract...");
    const marketplaceWasm = readFileSync(
      path.join(__dirname, "../artifacts/marketplace-aarch64.wasm"),
    );
    const marketplaceResult = await client.upload(
      account.address,
      marketplaceWasm,
      "auto",
      "Marketplace Upload",
    );
    console.log(
      `Marketplace uploaded with code ID: ${marketplaceResult.codeId}`,
    );
    config.contracts.marketplace = { codeId: marketplaceResult.codeId };

    // 3. Deploy Liquidity Wrapper Contract
    console.log("Deploying Liquidity Wrapper contract...");
    const wrapperWasm = readFileSync(
      path.join(__dirname, "../artifacts/liquidity_wrapper-aarch64.wasm"),
    );
    const wrapperResult = await client.upload(
      account.address,
      wrapperWasm,
      "auto",
      "Liquidity Wrapper Upload",
    );
    console.log(
      `Liquidity Wrapper uploaded with code ID: ${wrapperResult.codeId}`,
    );
    config.contracts.liquidityWrapper = { codeId: wrapperResult.codeId };

    // 4. Instantiate Core NFT Contract
    console.log("Instantiating UL-NFT Core contract...");
    const ulNftInstance = await client.instantiate(
      account.address,
      config.contracts.ulNft.codeId!,
      {
        name: "Unified Liquidity NFT",
        symbol: "ULNFT",
        euclid_router: process.env.EUCLID_ROUTER_ADDRESS,
      },
      "UL-NFT Core v1",
      "auto",
      { admin: account.address },
    );
    config.contracts.ulNft.address = ulNftInstance.contractAddress;
    console.log(
      `UL-NFT Core instantiated at: ${ulNftInstance.contractAddress}`,
    );

    // 5. Instantiate Marketplace Contract
    console.log("Instantiating Marketplace contract...");
    const marketplaceInstance = await client.instantiate(
      account.address,
      config.contracts.marketplace.codeId!,
      {
        ul_nft_contract: config.contracts.ulNft.address,
        fee_percentage: 250, // 2.5%
      },
      "UL-NFT Marketplace v1",
      "auto",
      { admin: account.address },
    );
    config.contracts.marketplace.address = marketplaceInstance.contractAddress;
    console.log(
      `Marketplace instantiated at: ${marketplaceInstance.contractAddress}`,
    );

    // 6. Instantiate Liquidity Wrapper Contract
    console.log("Instantiating Liquidity Wrapper contract...");
    const wrapperInstance = await client.instantiate(
      account.address,
      config.contracts.liquidityWrapper.codeId!,
      {
        ul_nft_contract: config.contracts.ulNft.address,
        euclid_router: process.env.EUCLID_ROUTER_ADDRESS!,
        euclid_factory: process.env.EUCLID_FACTORY_ADDRESS!,
      },
      "Liquidity Wrapper v1",
      "auto",
      { admin: account.address },
    );
    config.contracts.liquidityWrapper.address = wrapperInstance.contractAddress;
    console.log(
      `Liquidity Wrapper instantiated at: ${wrapperInstance.contractAddress}`,
    );

    // Save deployment config
    writeFileSync(
      path.join(__dirname, `../config/deployment.${NETWORK}.json`),
      JSON.stringify(config, null, 2),
    );
    console.log("Deployment config saved!");

    console.log("\nDeployment completed successfully! Contract addresses:");
    console.log("UL-NFT Core:", config.contracts.ulNft.address);
    console.log("Marketplace:", config.contracts.marketplace.address);
    console.log(
      "Liquidity Wrapper:",
      config.contracts.liquidityWrapper.address,
    );
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

// Run deployment
deploy().catch(console.error);
