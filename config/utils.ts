import config, { ArchwayConfig } from "./archway.config";

export function getNetworkConfig(): ArchwayConfig {
  const network = process.env.NETWORK || "testnet";
  return config[network as keyof typeof config];
}

export function getContractAddress(contractName: string): string {
  const contract =
    config.contracts[contractName as keyof typeof config.contracts];
  if (!contract?.address) {
    throw new Error(`Contract address not found for ${contractName}`);
  }
  return contract.address;
}

export function getEuclidConfig() {
  return config.euclid;
}

// Helper to validate configuration
export function validateConfig() {
  const requiredEnvVars = [
    "NETWORK",
    "UL_NFT_ADDRESS",
    "MARKETPLACE_ADDRESS",
    "LIQUIDITY_WRAPPER_ADDRESS",
    "EUCLID_ROUTER_ADDRESS",
    "EUCLID_FACTORY_ADDRESS",
  ];

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
