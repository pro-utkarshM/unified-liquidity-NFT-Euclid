export interface ArchwayConfig {
  endpoints: {
    rpc: string;
    rest: string;
  };
  chainId: string;
  prefix: string;
}

export interface ContractConfig {
  codeId?: string;
  address?: string;
}

export interface EuclidConfig {
  router: string;
  factory: string;
}

export interface Config {
  mainnet: ArchwayConfig;
  testnet: ArchwayConfig;
  contracts: {
    ul_nft: ContractConfig;
    marketplace: ContractConfig;
    liquidity_wrapper: ContractConfig;
  };
  euclid: EuclidConfig;
}

const config: Config = {
  mainnet: {
    endpoints: {
      rpc: "https://rpc.mainnet.archway.io",
      rest: "https://api.mainnet.archway.io",
    },
    chainId: "archway-1",
    prefix: "archway",
  },
  testnet: {
    endpoints: {
      rpc: "https://rpc.testnet.archway.io",
      rest: "https://api.testnet.archway.io",
    },
    chainId: "constantine-3",
    prefix: "archway",
  },
  contracts: {
    ul_nft: {
      codeId: process.env.UL_NFT_CODE_ID,
      address: process.env.UL_NFT_ADDRESS,
    },
    marketplace: {
      codeId: process.env.MARKETPLACE_CODE_ID,
      address: process.env.MARKETPLACE_ADDRESS,
    },
    liquidity_wrapper: {
      codeId: process.env.LIQUIDITY_WRAPPER_CODE_ID,
      address: process.env.LIQUIDITY_WRAPPER_ADDRESS,
    },
  },
  euclid: {
    router: process.env.EUCLID_ROUTER_ADDRESS || "",
    factory: process.env.EUCLID_FACTORY_ADDRESS || "",
  },
};

export default config;
