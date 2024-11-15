import { useArchwayClient } from "./useArchwayClient";
import { useState } from "react";

export function useNFTContract() {
  const { client, address } = useArchwayClient();
  const [loading, setLoading] = useState(false);

  const mintNFT = async (liquidityPositions) => {
    if (!client || !address) return;

    setLoading(true);
    try {
      const result = await client.execute(
        address,
        process.env.NEXT_PUBLIC_UL_NFT_ADDRESS!,
        {
          mint: {
            positions: liquidityPositions,
            token_uri: null,
          },
        },
        "auto"
      );
      return result;
    } catch (error) {
      console.error("Mint error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const queryNFT = async (tokenId: string) => {
    if (!client) return null;

    try {
      const result = await client.queryContractSmart(
        process.env.NEXT_PUBLIC_UL_NFT_ADDRESS!,
        {
          get_token: { token_id: tokenId },
        }
      );
      return result;
    } catch (error) {
      console.error("Query error:", error);
      return null;
    }
  };

  return { mintNFT, queryNFT, loading };
}
