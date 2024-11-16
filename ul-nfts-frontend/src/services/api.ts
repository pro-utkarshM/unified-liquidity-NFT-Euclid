export class ApiService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL;

  static async getPoolStats(poolId: string) {
    const response = await fetch(`${this.baseUrl}/pools/${poolId}/stats`);
    if (!response.ok) throw new Error("Failed to fetch pool stats");
    return response.json();
  }

  static async getLiquidityPositions(address: string) {
    const response = await fetch(`${this.baseUrl}/positions/${address}`);
    if (!response.ok) throw new Error("Failed to fetch positions");
    return response.json();
  }

  static async estimateGas(operation: string, params: unknown) {
    const response = await fetch(`${this.baseUrl}/estimate-gas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation, params }),
    });
    if (!response.ok) throw new Error("Failed to estimate gas");
    return response.json();
  }
}
