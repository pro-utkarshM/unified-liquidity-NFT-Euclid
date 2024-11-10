import { validateConfig, getNetworkConfig } from "../config/utils";

async function deploy() {
  validateConfig();
  const network = getNetworkConfig();

  console.log(`Deploying to ${network.chainId}...`);
  // To be addded ... Deployment logic here...
}
