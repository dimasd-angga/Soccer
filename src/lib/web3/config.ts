import { http } from "viem";
import { arbitrum, base, mainnet, polygon, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

import { SUPPORTED_CHAINS } from "./chains";

const APP_NAME = "JP Soccer";
const APP_DESCRIPTION = "Premium soccer uniform e-commerce";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() || "";

export const HAS_WALLETCONNECT = PROJECT_ID.length > 0;

let cachedConfig: ReturnType<typeof getDefaultConfig> | undefined;

export function getWagmiConfig() {
  if (cachedConfig) return cachedConfig;

  cachedConfig = getDefaultConfig({
    appName: APP_NAME,
    appDescription: APP_DESCRIPTION,
    appUrl:
      process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000",
    // WalletConnect requires a project id; we pass a harmless placeholder
    // when it's missing so the build still works. Connect button warns
    // about the missing id at runtime — see Web3Provider.
    projectId: PROJECT_ID || "DEMO_PROJECT_ID",
    chains: SUPPORTED_CHAINS,
    transports: {
      [mainnet.id]: http(
        process.env.NEXT_PUBLIC_ETH_RPC_URL?.trim() || undefined
      ),
      [polygon.id]: http(
        process.env.NEXT_PUBLIC_POLYGON_RPC_URL?.trim() || undefined
      ),
      [base.id]: http(),
      [arbitrum.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true,
  });

  return cachedConfig;
}
