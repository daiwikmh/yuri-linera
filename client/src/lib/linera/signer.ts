/**
 * Linera MetaMask Signer Integration
 *
 * This service implements MetaMask's blind-signing capabilities
 * to sign Linera blockchain transactions.
 */

import { MetaMaskSigner } from "@linera/signer";
import { LINERA_CONFIG } from "./config";

let signerInstance: MetaMaskSigner | null = null;
let currentAccount: string | null = null;

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
}

/**
 * Get or create the MetaMask signer instance
 */
export function getSigner(): MetaMaskSigner | null {
  if (!isMetaMaskInstalled()) {
    console.error("MetaMask is not installed");
    return null;
  }

  if (!signerInstance) {
    try {
      signerInstance = new MetaMaskSigner();
      console.log("✅ MetaMask signer initialized");
    } catch (error) {
      console.error("❌ Failed to initialize MetaMask signer:", error);
      return null;
    }
  }

  return signerInstance;
}

/**
 * Connect to MetaMask and request account access
 */
export async function connectMetaMask(): Promise<string | null> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  try {
    const signer = getSigner();
    if (!signer) {
      throw new Error("Failed to initialize signer");
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts && accounts.length > 0) {
      currentAccount = accounts[0];
      console.log("✅ Connected to MetaMask:", currentAccount);
      return currentAccount;
    }

    throw new Error("No accounts found");
  } catch (error) {
    console.error("❌ Failed to connect to MetaMask:", error);
    throw error;
  }
}

/**
 * Disconnect from MetaMask
 */
export function disconnectMetaMask(): void {
  currentAccount = null;
  console.log("✅ Disconnected from MetaMask");
}

/**
 * Get the current connected account
 */
export function getCurrentAccount(): string | null {
  return currentAccount;
}

/**
 * Check if wallet is currently connected
 */
export function isConnected(): boolean {
  return currentAccount !== null;
}

/**
 * Get accounts from MetaMask
 */
export async function getAccounts(): Promise<string[]> {
  if (!isMetaMaskInstalled()) {
    return [];
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts || [];
  } catch (error) {
    console.error("Error getting accounts:", error);
    return [];
  }
}

/**
 * Listen for account changes
 */
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      currentAccount = null;
      console.log("🔌 MetaMask disconnected");
    } else if (accounts[0] !== currentAccount) {
      // User switched accounts
      currentAccount = accounts[0];
      console.log("🔄 Account switched to:", currentAccount);
    }
    callback(accounts);
  };

  window.ethereum.on("accountsChanged", handleAccountsChanged);

  // Return cleanup function
  return () => {
    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  };
}

/**
 * Listen for chain changes
 */
export function onChainChanged(callback: (chainId: string) => void): () => void {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  const handleChainChanged = (chainId: string) => {
    console.log("⛓️  Chain changed to:", chainId);
    callback(chainId);
  };

  window.ethereum.on("chainChanged", handleChainChanged);

  // Return cleanup function
  return () => {
    window.ethereum.removeListener("chainChanged", handleChainChanged);
  };
}

/**
 * Sign a Linera transaction using MetaMask blind signing
 */
export async function signTransaction(transaction: any): Promise<string> {
  const signer = getSigner();
  if (!signer) {
    throw new Error("Signer not initialized");
  }

  if (!currentAccount) {
    throw new Error("No account connected. Please connect MetaMask first.");
  }

  try {
    // Use MetaMask signer to sign the transaction
    const signature = await signer.sign(transaction);
    console.log("✅ Transaction signed successfully");
    return signature;
  } catch (error) {
    console.error("❌ Failed to sign transaction:", error);
    throw error;
  }
}

/**
 * Initialize account check on load
 */
export async function initializeAccount(): Promise<string | null> {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await getAccounts();
    if (accounts.length > 0) {
      currentAccount = accounts[0];
      console.log("✅ Account restored:", currentAccount);
      return currentAccount;
    }
  } catch (error) {
    console.error("Error initializing account:", error);
  }

  return null;
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Request to add Linera network to MetaMask (if needed for future)
 */
export async function addLineraNetwork(): Promise<void> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x" + parseInt(LINERA_CONFIG.CHAIN_ID, 16).toString(16),
          chainName: "Linera Conway Testnet",
          nativeCurrency: {
            name: "Linera",
            symbol: "LINERA",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.testnet-conway.linera.net"],
          blockExplorerUrls: ["https://explorer.testnet-conway.linera.net"],
        },
      ],
    });
    console.log("✅ Linera network added to MetaMask");
  } catch (error) {
    console.error("❌ Failed to add Linera network:", error);
    throw error;
  }
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}
