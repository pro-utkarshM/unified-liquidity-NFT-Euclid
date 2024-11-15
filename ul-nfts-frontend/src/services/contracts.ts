export const CONTRACT_ADDRESSES = {
  UL_NFT: process.env.NEXT_PUBLIC_UL_NFT_ADDRESS as string,
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as string,
};

export const CHAIN_CONFIG = {
  RPC: process.env.NEXT_PUBLIC_ARCHWAY_RPC as string,
  REST: process.env.NEXT_PUBLIC_ARCHWAY_REST as string,
  CHAIN_ID: "archway-1",
  PREFIX: "archway",
};

// Validate environment variables
if (!CONTRACT_ADDRESSES.UL_NFT || !CONTRACT_ADDRESSES.MARKETPLACE) {
  throw new Error("Missing contract addresses in environment variables");
}

if (!CHAIN_CONFIG.RPC || !CHAIN_CONFIG.REST) {
  throw new Error("Missing chain configuration in environment variables");
}
