/**
 * Linera Blockchain Configuration
 *
 * Application ID: b21cfa468a7a1d6554e1c87bd1fef88bf1e81dfaafac59e6286a624b928bf10a
 * Chain ID: 1f7983cf40b5dd57d299367a0ee6cf47ce93c5b7da5564e65c27a16087c56515
 * Testnet: Conway Testnet
 * Faucet: https://faucet.testnet-conway.linera.net
 */

export const LINERA_CONFIG = {
  APPLICATION_ID: "b21cfa468a7a1d6554e1c87bd1fef88bf1e81dfaafac59e6286a624b928bf10a",
  CHAIN_ID: "1f7983cf40b5dd57d299367a0ee6cf47ce93c5b7da5564e65c27a16087c56515",
  TESTNET: "Conway Testnet",
  FAUCET_URL: "https://faucet.testnet-conway.linera.net",
} as const;

export type LineraMarket = {
  question: string;
  optionA: string;
  optionB: string;
  totalA: number;
  totalB: number;
  isOpen: boolean;
  winningOption: number | null;
};
