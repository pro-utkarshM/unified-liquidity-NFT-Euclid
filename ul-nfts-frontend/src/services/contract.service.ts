// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { NFTS } from "./Data";

export class ContractService {
  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async connect() {
    await this.delay(1000);
    return {
      address: "archway1...xyz",
      balance: "1000ARCH",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getNFTs(address: string) {
    await this.delay(1500);
    return NFTS;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async mintNFT(positions: unknown) {
    await this.delay(2000);
    return {
      success: true,
      txHash: "0x...",
      nftId: `ulnft-${Math.floor(Math.random() * 1000)}`,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async listNFT(nftId: string, price: string) {
    await this.delay(1500);
    return {
      success: true,
      listingId: `listing-${Math.floor(Math.random() * 1000)}`,
      txHash: "0x...",
    };
  }
}
