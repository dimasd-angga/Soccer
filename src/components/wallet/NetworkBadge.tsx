"use client";

import { AlertTriangle } from "lucide-react";
import { useChainId, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";

import { getChainMeta, isSupportedChain } from "@/lib/web3/chains";

export function NetworkBadge() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const supported = isSupportedChain(chainId);
  const meta = getChainMeta(chainId);

  if (!supported) {
    return (
      <button
        type="button"
        onClick={() => switchChain({ chainId: mainnet.id })}
        disabled={isPending}
        className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/20 transition-colors disabled:opacity-60"
        aria-label="Unsupported network — click to switch to Ethereum"
      >
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
        {isPending ? "Switching…" : "Unsupported"}
      </button>
    );
  }

  return (
    <span
      className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-100"
      aria-live="polite"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
      {meta?.name ?? "Unknown"}
    </span>
  );
}
