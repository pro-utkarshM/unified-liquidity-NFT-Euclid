export const NFTS = [
  {
    id: "ulnft-1",
    name: "Blue Chip DeFi Bundle",
    owner: "archway1...xyz",
    totalValue: "$50,000",
    positions: [
      {
        pool_id: "eth-usdc-1",
        token_pair: ["ETH", "USDC"],
        amount: "10000",
        chain_id: "ethereum",
        apy: "12.5%",
        volume24h: "$2.1M",
      },
      {
        pool_id: "atom-osmo-1",
        token_pair: ["ATOM", "OSMO"],
        amount: "15000",
        chain_id: "osmosis",
        apy: "18.2%",
        volume24h: "$850K",
      },
    ],
    imageUrl: "/nft-previews/1.png",
  },
  {
    id: "ulnft-2",
    name: "Stablecoin Yield Optimizer",
    owner: "archway1...abc",
    totalValue: "$75,000",
    positions: [
      {
        pool_id: "usdc-usdt-1",
        token_pair: ["USDC", "USDT"],
        amount: "25000",
        chain_id: "archway",
        apy: "8.5%",
        volume24h: "$5.3M",
      },
    ],
    imageUrl: "/nft-previews/2.png",
  },
  // Add more mock NFTs...
];

export const TRENDING_POOLS = [
  {
    id: "pool-1",
    name: "ETH-USDC",
    tvl: "$125M",
    apy: "15.2%",
    volume24h: "$12.5M",
    chains: ["Ethereum", "Archway"],
    description:
      "High-performance ETH-USDC pool with cross-chain yield opportunities",
  },
  // Add more pools...
];
