"use client";

import { useState } from "react";
import { Check, Copy, PenLine, X } from "lucide-react";
import { UserRejectedRequestError } from "viem";
import { useAccount, useSignMessage } from "wagmi";

import { shortenAddress, shortenSignature } from "@/lib/web3/format";

const MESSAGE = "Sign in to JP Soccer";

type Toast =
  | { kind: "info"; text: string }
  | { kind: "error"; text: string }
  | null;

export function SignMessagePanel() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync, isPending, reset } = useSignMessage();
  const [signature, setSignature] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [copied, setCopied] = useState(false);

  function showToast(t: Toast) {
    setToast(t);
    if (t) setTimeout(() => setToast(null), 4000);
  }

  async function handleSign() {
    setSignature(null);
    try {
      const sig = await signMessageAsync({ message: MESSAGE });
      setSignature(sig);
    } catch (err) {
      if (
        err instanceof UserRejectedRequestError ||
        (err instanceof Error &&
          /reject|denied|user denied/i.test(err.message))
      ) {
        showToast({ kind: "info", text: "Signature request rejected." });
      } else {
        const text =
          err instanceof Error ? err.message : "Failed to sign message.";
        showToast({ kind: "error", text });
      }
      reset();
    }
  }

  async function handleCopy() {
    if (!signature) return;
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  if (!isConnected || !address) {
    return (
      <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-6 text-gray-300">
        Connect a wallet first to sign in.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-200">
            <PenLine className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="text-xl font-bold text-yellow-200">
            Sign in to JP Soccer
          </h2>
        </div>

        <p className="text-gray-300 text-sm mb-6">
          Prove ownership of your wallet by signing the message below. No
          transaction, no gas.
        </p>

        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
            Signer
          </p>
          <p className="font-mono text-yellow-100">
            {shortenAddress(address)}
          </p>
        </div>

        <pre className="rounded-xl border border-gray-700 bg-black/60 p-4 text-sm text-yellow-100 whitespace-pre-wrap break-words">
{MESSAGE}
        </pre>

        <button
          type="button"
          onClick={handleSign}
          disabled={isPending}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-200 to-yellow-100 px-5 py-3 text-sm font-bold text-black shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Awaiting signature…" : "Sign message"}
        </button>
      </div>

      {signature ? (
        <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/5 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h3 className="text-lg font-bold text-emerald-200">
              Signature
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/10 transition-colors"
              aria-label="Copy signature"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden /> Copy
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-sm text-emerald-100 break-all">
            {shortenSignature(signature, 14, 12)}
          </p>
          <p className="mt-3 text-xs text-emerald-300/80">
            Full signature length: {signature.length} characters
          </p>
        </div>
      ) : null}

      {toast ? (
        <div
          role="status"
          className={`fixed bottom-6 right-6 max-w-sm rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md flex items-start gap-3 ${
            toast.kind === "error"
              ? "border-red-500/40 bg-red-500/10 text-red-100"
              : "border-yellow-500/40 bg-yellow-500/10 text-yellow-100"
          }`}
        >
          <span className="flex-1 text-sm">{toast.text}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4 opacity-80" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
