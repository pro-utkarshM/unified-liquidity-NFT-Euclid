import { SigningArchwayClient } from "@archwayhq/arch3.js";
import { useCallback, useState } from "react";
import { CHAIN_CONFIG } from "../services/contracts";

interface UseArchwayClientReturn {
  client: SigningArchwayClient | null;
  address: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  loading: boolean;
  error: string | null;
}

export function useArchwayClient(): UseArchwayClientReturn {
  const [client, setClient] = useState<SigningArchwayClient | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Keplr is installed
      if (!window.keplr) {
        throw new Error("Please install Keplr extension");
      }

      // Enable Keplr for our chain
      await window.keplr.enable(CHAIN_CONFIG.CHAIN_ID);

      // Get the offline signer
      const offlineSigner = await window.keplr.getOfflineSigner(
        CHAIN_CONFIG.CHAIN_ID
      );

      // Get the user's account
      const accounts = await offlineSigner.getAccounts();

      // Create signing client
      const client = await SigningArchwayClient.connectWithSigner(
        CHAIN_CONFIG.RPC,
        offlineSigner
      );

      setClient(client);
      setAddress(accounts[0].address);
    } catch (err) {
      console.error("Connection error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setClient(null);
    setAddress("");
  }, []);

  return {
    client,
    address,
    connect,
    disconnect,
    loading,
    error,
  };
}
