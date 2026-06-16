import type { Metadata } from "next";
import { SignMessagePanel } from "@/components/wallet/SignMessagePanel";

export const metadata: Metadata = {
  title: "Sign in — JP Soccer",
  description:
    "Connect your wallet and sign in to JP Soccer with a wallet signature.",
};

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-yellow-300/80">
            Wallet
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-yellow-200">
            Sign in with your wallet
          </h1>
          <p className="mt-3 text-gray-300 max-w-2xl">
            Connect a wallet from the header, then sign the message below.
            We use the signature to prove you control the address — no
            transactions or fees involved.
          </p>
        </header>

        <SignMessagePanel />
      </div>
    </div>
  );
}
