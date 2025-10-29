/**
 * React Hooks for Linera Prediction Market Integration
 */

import { useState, useEffect, useCallback } from "react";
import {
  initializeLineraClient,
  getMarket,
  createMarket as createMarketService,
  placeBet as placeBetService,
  closeMarket as closeMarketService,
  resolveMarket as resolveMarketService,
  subscribeToUpdates,
} from "@/lib/linera/service";
import type { LineraMarket } from "@/lib/linera/config";

/**
 * Hook to manage Linera client initialization
 */
export function useLineraClient() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setIsLoading(true);
        await initializeLineraClient();
        if (mounted) {
          setIsInitialized(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to initialize"));
          setIsInitialized(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return { isInitialized, isLoading, error };
}

/**
 * Hook to fetch and subscribe to market data
 */
export function useMarket() {
  const [market, setMarket] = useState<LineraMarket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMarket = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMarket();
      setMarket(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch market"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarket();

    // Subscribe to blockchain updates
    const unsubscribe = subscribeToUpdates(() => {
      fetchMarket();
    });

    return unsubscribe;
  }, [fetchMarket]);

  return { market, isLoading, error, refetch: fetchMarket };
}

/**
 * Hook for market creation operations
 */
export function useCreateMarket() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createMarket = useCallback(
    async (question: string, optionA: string, optionB: string) => {
      try {
        setIsCreating(true);
        setError(null);
        await createMarketService(question, optionA, optionB);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to create market"));
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  return { createMarket, isCreating, error };
}

/**
 * Hook for betting operations
 */
export function usePlaceBet() {
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const placeBet = useCallback(async (option: 0 | 1, amount: number) => {
    try {
      setIsPlacingBet(true);
      setError(null);
      await placeBetService(option, amount);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to place bet"));
      return false;
    } finally {
      setIsPlacingBet(false);
    }
  }, []);

  return { placeBet, isPlacingBet, error };
}

/**
 * Hook for market management operations
 */
export function useMarketManagement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const closeMarket = useCallback(async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await closeMarketService();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to close market"));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const resolveMarket = useCallback(async (winningOption: 0 | 1) => {
    try {
      setIsProcessing(true);
      setError(null);
      await resolveMarketService(winningOption);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to resolve market"));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { closeMarket, resolveMarket, isProcessing, error };
}

/**
 * Combined hook with all market operations
 */
export function useLineraMarket() {
  const client = useLineraClient();
  const market = useMarket();
  const { createMarket, isCreating } = useCreateMarket();
  const { placeBet, isPlacingBet } = usePlaceBet();
  const { closeMarket, resolveMarket, isProcessing } = useMarketManagement();

  return {
    // Client state
    isInitialized: client.isInitialized,
    isClientLoading: client.isLoading,
    clientError: client.error,

    // Market data
    market: market.market,
    isMarketLoading: market.isLoading,
    marketError: market.error,
    refetchMarket: market.refetch,

    // Operations
    createMarket,
    isCreating,
    placeBet,
    isPlacingBet,
    closeMarket,
    resolveMarket,
    isProcessing,
  };
}
