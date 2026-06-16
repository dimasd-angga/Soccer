import { arbitrum, base, mainnet, polygon, sepolia } from "wagmi/chains";

export function shortenAddress(address: string | undefined, chars = 4): string {
  if (!address) return "";
  if (address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

const EXPLORERS: Record<number, string> = {
  [mainnet.id]: "https://etherscan.io",
  [polygon.id]: "https://polygonscan.com",
  [base.id]: "https://basescan.org",
  [arbitrum.id]: "https://arbiscan.io",
  [sepolia.id]: "https://sepolia.etherscan.io",
};

export function explorerAddressUrl(
  chainId: number | undefined,
  address: string | undefined
): string | undefined {
  if (chainId === undefined || !address) return undefined;
  const base = EXPLORERS[chainId];
  if (!base) return undefined;
  return `${base}/address/${address}`;
}

export function shortenSignature(signature: string, head = 10, tail = 8): string {
  if (signature.length <= head + tail + 1) return signature;
  return `${signature.slice(0, head)}…${signature.slice(-tail)}`;
}
