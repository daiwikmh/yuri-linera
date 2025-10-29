/**
 * React Hooks for Linera Wallet Integration with MetaMask
 */

import { useState, useEffect, useCallback } from "react";
import {
  isMetaMaskInstalled,
  connectMetaMask,
  disconnectMetaMask,
  getCurrentAccount,
  isConnected as checkIsConnected,
  initializeAccount,
  onAccountsChanged,
  onChainChanged,
  shortenAddress,
} from "@/lib/linera/signer";

/**
 * Hook for Linera wallet connection via MetaMask
 */
export function useLineraWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    setHasMetaMask(isMetaMaskInstalled());
  }, []);

  // Initialize account on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const currentAccount = await initializeAccount();
      if (mounted && currentAccount) {
        setAccount(currentAccount);
        setIsConnected(true);
      }
    };

    if (hasMetaMask) {
      init();
    }

    return () => {
      mounted = false;
    };
  }, [hasMetaMask]);

  // Listen for account changes
  useEffect(() => {
    if (!hasMetaMask) return;

    const unsubscribeAccounts = onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    });

    const unsubscribeChain = onChainChanged(() => {
      // Optionally handle chain changes
      console.log("Chain changed");
    });

    return () => {
      unsubscribeAccounts();
      unsubscribeChain();
    };
  }, [hasMetaMask]);

  // Connect function
  const connect = useCallback(async () => {
    if (!hasMetaMask) {
      const error = new Error("MetaMask is not installed");
      setError(error);
      throw error;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const account = await connectMetaMask();
      if (account) {
        setAccount(account);
        setIsConnected(true);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to connect");
      setError(error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [hasMetaMask]);

  // Disconnect function
  const disconnect = useCallback(() => {
    disconnectMetaMask();
    setAccount(null);
    setIsConnected(false);
    setError(null);
  }, []);

  return {
    account,
    isConnected,
    isConnecting,
    error,
    hasMetaMask,
    connect,
    disconnect,
    shortenAddress: account ? shortenAddress(account) : null,
  };
}

/**
 * Hook to get wallet status
 */
export function useWalletStatus() {
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    setHasMetaMask(isMetaMaskInstalled());
    setIsConnected(checkIsConnected());
    setAccount(getCurrentAccount());
  }, []);

  return {
    hasMetaMask,
    isConnected,
    account,
  };
}

/**
 * Hook for account info
 */
export function useAccount() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const currentAccount = getCurrentAccount();
    setAccount(currentAccount);
    setIsConnected(currentAccount !== null);

    if (!isMetaMaskInstalled()) return;

    const unsubscribe = onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    });

    return unsubscribe;
  }, []);

  return {
    address: account,
    isConnected,
  };
}
