import { SigningArchwayClient } from "@archwayhq/arch3.js";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { useState, useEffect } from "react";

export function useArchwayClient() {
  const [client, setClient] = useState<SigningArchwayClient | null>(null);
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string>("");

  const connect = async () => {
    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        process.env.NEXT_PUBLIC_WALLET_MNEMONIC!,
        { prefix: "archway" }
      );

      const [account] = await wallet.getAccounts();
      const client = await SigningArchwayClient.connectWithSigner(
        process.env.NEXT_PUBLIC_ARCHWAY_RPC!,
        wallet
      );

      setClient(client);
      setAddress(account.address);
    } catch (err) {
      setError("Failed to connect wallet");
      console.error(err);
    }
  };

  return { client, address, error, connect };
}
