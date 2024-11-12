import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

async function deploy() {
  console.log('Starting deployment...');

  // Setup client
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.WALLET_MNEMONIC!,
    { prefix: 'archway' }
  );
  
  const [account] = await wallet.getAccounts();
  console.log(`Deploying from account: ${account.address}`);
  
  const client = await SigningArchwayClient.connectWithSigner(
    process.env.ARCHWAY_NODE!,
    wallet
  );

  try {
    // 1. Deploy UL-NFT Core
    console.log('Deploying UL-NFT Core...');
    const ulNftWasm = readFileSync('artifacts/ul_nft_core.wasm');
    const ulNftResult = await client.upload(
      account.address,
      ulNftWasm,
      'auto'
    );
    console.log(`UL-NFT uploaded with code ID: ${ulNftResult.codeId}`);

    // 2. Instantiate UL-NFT
    const ulNftInstance = await client.instantiate(
      account.address,
      ulNftResult.codeId,
      {
        name: "Unified Liquidity NFT",
        symbol: "ULNFT",
        euclid_router: process.env.EUCLID_ROUTER_ADDRESS,
      },
      "UL-NFT v1",
      'auto',
      { admin: account.address }
    );
    console.log(`UL-NFT deployed at: ${ulNftInstance.contractAddress}`);

    // Continue with other contracts...
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy().catch(console.error);