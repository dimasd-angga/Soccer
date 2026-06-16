"use client";

import { ChevronDown, Wallet } from "lucide-react";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { shortenAddress } from "@/lib/web3/format";
import { NetworkBadge } from "./NetworkBadge";
import { WalletMenu } from "./WalletMenu";

export function WalletButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted, authenticationStatus }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && !!account && !!chain;

        if (!ready) {
          return (
            <div
              aria-hidden
              className="h-10 w-32 rounded-xl bg-yellow-500/10 animate-pulse"
            />
          );
        }

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-200 to-yellow-100 px-4 py-2 text-sm font-semibold text-black shadow-md hover:scale-[1.03] transition-transform"
            >
              <Wallet className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          );
        }

        return (
          <div className="relative flex items-center gap-2">
            <NetworkBadge />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="inline-flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm font-semibold text-yellow-100 hover:bg-yellow-500/15 transition-colors"
            >
              <span className="font-mono">
                {shortenAddress(account.address)}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {menuOpen ? <WalletMenu onClose={() => setMenuOpen(false)} /> : null}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
