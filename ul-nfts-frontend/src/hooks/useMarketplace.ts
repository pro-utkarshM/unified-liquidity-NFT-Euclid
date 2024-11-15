import { useState } from "react";
import { useArchwayClient } from "./useArchwayClient";
import { CONTRACT_ADDRESSES } from "../services/contracts";
import { MarketplaceListing } from "../services/types";
import { Uint128 } from "@cosmjs/cosmwasm-stargate";

export function useMarketplace() {
  const { client, address } = useArchwayClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createListing = async (tokenId: string, price: string) => {
    if (!client || !address) throw new Error("Wallet not connected");

    setLoading(true);
    setError(null);

    try {
      // First approve the marketplace contract
      const approveMsg = {
        approve: {
          spender: CONTRACT_ADDRESSES.MARKETPLACE,
          token_id: tokenId,
        },
      };

      await client.execute(
        address,
        CONTRACT_ADDRESSES.UL_NFT,
        approveMsg,
        "auto"
      );

      // Then create the listing
      const listingMsg = {
        create_listing: {
          token_id: tokenId,
          price: Uint128.from(price),
        },
      };

      const result = await client.execute(
        address,
        CONTRACT_ADDRESSES.MARKETPLACE,
        listingMsg,
        "auto"
      );

      return result;
    } catch (err) {
      console.error("Listing creation error:", err);
      setError(err instanceof Error ? err.message : "Failed to create listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buyNFT = async (listingId: string) => {
    if (!client || !address) throw new Error("Wallet not connected");

    setLoading(true);
    setError(null);

    try {
      const result = await client.execute(
        address,
        CONTRACT_ADDRESSES.MARKETPLACE,
        {
          buy_nft: {
            listing_id: listingId,
          },
        },
        "auto"
      );
      return result;
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err instanceof Error ? err.message : "Failed to purchase NFT");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getListings = async (): Promise<MarketplaceListing[]> => {
    if (!client) throw new Error("Client not initialized");

    try {
      const result = await client.queryContractSmart(
        CONTRACT_ADDRESSES.MARKETPLACE,
        {
          get_listings: {},
        }
      );
      return result.listings;
    } catch (err) {
      console.error("Query error:", err);
      throw err;
    }
  };

  const getUserListings = async (
    userAddress: string
  ): Promise<MarketplaceListing[]> => {
    if (!client) throw new Error("Client not initialized");

    try {
      const result = await client.queryContractSmart(
        CONTRACT_ADDRESSES.MARKETPLACE,
        {
          get_listings_by_seller: {
            seller: userAddress,
          },
        }
      );
      return result.listings;
    } catch (err) {
      console.error("Query error:", err);
      throw err;
    }
  };

  return {
    createListing,
    buyNFT,
    getListings,
    getUserListings,
    loading,
    error,
  };
}
