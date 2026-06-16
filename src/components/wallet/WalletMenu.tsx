"use client";

import Link from "next/link";
import {
  Check,
  Copy,
  ExternalLink,
  LogOut,
  PenLine,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useDisconnect,
} from "wagmi";

import { getChainMeta } from "@/lib/web3/chains";
import { explorerAddressUrl, shortenAddress } from "@/lib/web3/format";

interface WalletMenuProps {
  onClose: () => void;
}

export function WalletMenu({ onClose }: WalletMenuProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const balance = useBalance({ address });
  const meta = getChainMeta(chainId);
  const explorer = explorerAddressUrl(chainId, address);
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function handleCopy() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard can fail in non-secure contexts; ignore silently
    }
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Wallet menu"
      className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-3 text-sm shadow-2xl z-50"
    >
      <div className="px-2 pb-3 border-b border-gray-700">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          Wallet
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="font-mono text-yellow-100">
            {shortenAddress(address)}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-yellow-200 hover:bg-yellow-500/10 transition-colors"
            aria-label="Copy address"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-2 py-3 border-b border-gray-700">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          Network
        </p>
        <p className="mt-1 text-yellow-100">{meta?.name ?? "Unsupported"}</p>
      </div>

      <div className="px-2 py-3 border-b border-gray-700">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          Balance
        </p>
        <p className="mt-1 text-yellow-100">
          {balance.isPending
            ? "Loading…"
            : balance.isError
              ? "Unavailable"
              : balance.data
                ? `${Number(balance.data.formatted).toFixed(4)} ${balance.data.symbol}`
                : "0"}
        </p>
      </div>

      <ul className="mt-2 space-y-1" role="none">
        {explorer ? (
          <li role="none">
            <a
              role="menuitem"
              href={explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-yellow-100 hover:bg-yellow-500/5 transition-colors"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View on explorer
            </a>
          </li>
        ) : null}
        <li role="none">
          <Link
            href="/wallet"
            role="menuitem"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-yellow-100 hover:bg-yellow-500/5 transition-colors"
          >
            <PenLine className="h-4 w-4" aria-hidden />
            Sign in to JP Soccer
          </Link>
        </li>
        <li role="none">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              disconnect();
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Disconnect
          </button>
        </li>
      </ul>
    </div>
  );
}
