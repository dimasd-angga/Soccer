"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { getWagmiConfig, HAS_WALLETCONNECT } from "@/lib/web3/config";

const theme = darkTheme({
  accentColor: "#FDE68A",
  accentColorForeground: "#0a0a0a",
  borderRadius: "large",
  overlayBlur: "small",
  fontStack: "system",
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [config] = useState(() => getWagmiConfig());
  const [queryClient] = useState(() => new QueryClient());

  if (
    !HAS_WALLETCONNECT &&
    process.env.NODE_ENV !== "production" &&
    typeof window !== "undefined"
  ) {
    // Surface the missing env var once during dev so the team knows why
    // WalletConnect QR pairing won't work.
    console.warn(
      "[Web3Provider] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set; " +
        "WalletConnect QR pairing will fail. Injected wallets still work."
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
