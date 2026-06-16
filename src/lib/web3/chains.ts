import { arbitrum, base, mainnet, polygon, sepolia } from "wagmi/chains";
import type { Chain } from "viem";

export const SUPPORTED_CHAINS = [
  mainnet,
  polygon,
  base,
  arbitrum,
  sepolia,
] as const satisfies readonly [Chain, ...Chain[]];

export const SUPPORTED_CHAIN_IDS: ReadonlySet<number> = new Set(
  SUPPORTED_CHAINS.map((c) => c.id)
);

export interface ChainMeta {
  id: number;
  name: string;
  shortName: string;
  emoji: string;
}

const META: Record<number, ChainMeta> = {
  [mainnet.id]: { id: mainnet.id, name: "Ethereum", shortName: "ETH", emoji: "⟠" },
  [polygon.id]: { id: polygon.id, name: "Polygon", shortName: "MATIC", emoji: "⬣" },
  [base.id]: { id: base.id, name: "Base", shortName: "BASE", emoji: "🔵" },
  [arbitrum.id]: { id: arbitrum.id, name: "Arbitrum", shortName: "ARB", emoji: "🔷" },
  [sepolia.id]: { id: sepolia.id, name: "Sepolia", shortName: "SEP", emoji: "🧪" },
};

export function getChainMeta(chainId: number | undefined): ChainMeta | undefined {
  if (chainId === undefined) return undefined;
  return META[chainId];
}

export function isSupportedChain(chainId: number | undefined): boolean {
  return chainId !== undefined && SUPPORTED_CHAIN_IDS.has(chainId);
}
