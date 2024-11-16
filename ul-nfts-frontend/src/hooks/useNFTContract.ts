// import { useArchwayClient } from "./useArchwayClient";
// import { useState } from "react";
// import { CONTRACT_ADDRESSES } from "../services/contracts";
// import { LiquidityPosition, NFTMetadata } from "../services/types";

// export function useNFTContract() {
//   const { client, address } = useArchwayClient();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const mintNFT = async (positions: LiquidityPosition[]) => {
//     if (!client || !address) throw new Error("Wallet not connected");

//     setLoading(true);
//     setError(null);

//     try {
//       const result = await client.execute(
//         address,
//         CONTRACT_ADDRESSES.UL_NFT,
//         {
//           mint: {
//             positions,
//             token_uri: null,
//           },
//         },
//         "auto"
//       );
//       return result;
//     } catch (err) {
//       console.error("Mint error:", err);
//       setError(err instanceof Error ? err.message : "Failed to mint NFT");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getUserNFTs = async (userAddress: string): Promise<NFTMetadata[]> => {
//     if (!client) throw new Error("Client not initialized");

//     try {
//       const result = await client.queryContractSmart(
//         CONTRACT_ADDRESSES.UL_NFT,
//         {
//           get_tokens_by_owner: { owner: userAddress },
//         }
//       );
//       return result.tokens;
//     } catch (err) {
//       console.error("Query error:", err);
//       throw err;
//     }
//   };

//   const queryNFT = async (tokenId: string): Promise<NFTMetadata> => {
//     if (!client) throw new Error("Client not initialized");

//     try {
//       const result = await client.queryContractSmart(
//         CONTRACT_ADDRESSES.UL_NFT,
//         {
//           get_token: { token_id: tokenId },
//         }
//       );
//       return result;
//     } catch (err) {
//       console.error("Query error:", err);
//       throw err;
//     }
//   };

//   return {
//     mintNFT,
//     queryNFT,
//     getUserNFTs,
//     loading,
//     error,
//   };
// }

import { ContractService } from "@/services/contract.service";

export function useNFTContract() {
  const mintNFT = async (positions: unknown) => {
    return await ContractService.mintNFT(positions);
  };

  const getUserNFTs = async (address: string) => {
    return await ContractService.getNFTs(address);
  };

  return {
    mintNFT,
    getUserNFTs,
    loading: false,
    error: null,
  };
}
