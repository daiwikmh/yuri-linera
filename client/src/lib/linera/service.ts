/**
 * Linera Prediction Market Service
 *
 * This service handles all interactions with the Linera blockchain
 * prediction market smart contract via GraphQL queries and mutations.
 */

import { LINERA_CONFIG, type LineraMarket } from "./config";

// Type declarations for @linera/client
type LineraClient = any;
type ApplicationBackend = any;

let clientInstance: LineraClient | null = null;
let backendInstance: ApplicationBackend | null = null;

/**
 * Initialize the Linera client
 * Must be called before any other operations
 */
export async function initializeLineraClient(): Promise<void> {
  try {
    // Dynamic import of Linera client
    const linera = await import("@linera/client");

    // Initialize the Linera WASM module
    await linera.default();

    // Create client instance
    clientInstance = new linera.Client();

    // Get application backend
    backendInstance = clientInstance.application(LINERA_CONFIG.APPLICATION_ID);

    console.log("✅ Linera client initialized successfully");
    console.log("📝 Application ID:", LINERA_CONFIG.APPLICATION_ID);
    console.log("⛓️  Chain ID:", LINERA_CONFIG.CHAIN_ID);
  } catch (error) {
    console.error("❌ Failed to initialize Linera client:", error);
    throw new Error("Failed to initialize Linera client");
  }
}

/**
 * Get the backend instance (throws if not initialized)
 */
function getBackend(): ApplicationBackend {
  if (!backendInstance) {
    throw new Error("Linera client not initialized. Call initializeLineraClient() first.");
  }
  return backendInstance;
}

/**
 * Get the client instance (throws if not initialized)
 */
export function getClient(): LineraClient {
  if (!clientInstance) {
    throw new Error("Linera client not initialized. Call initializeLineraClient() first.");
  }
  return clientInstance;
}

/**
 * Query: Get the current market state
 */
export async function getMarket(): Promise<LineraMarket | null> {
  const backend = getBackend();

  const query = {
    query: `query {
      market {
        question
        optionA
        optionB
        totalA
        totalB
        isOpen
        winningOption
      }
    }`,
  };

  try {
    const response = await backend.query(JSON.stringify(query));
    const data = JSON.parse(response);

    if (!data.data || !data.data.market) {
      return null;
    }

    return data.data.market as LineraMarket;
  } catch (error) {
    console.error("Error fetching market:", error);
    throw error;
  }
}

/**
 * Mutation: Create a new prediction market
 */
export async function createMarket(
  question: string,
  optionA: string,
  optionB: string
): Promise<void> {
  const backend = getBackend();

  // Escape quotes in strings
  const escapeString = (str: string) => str.replace(/"/g, '\\"');

  const mutation = {
    query: `mutation {
      createMarket(
        question: "${escapeString(question)}",
        optionA: "${escapeString(optionA)}",
        optionB: "${escapeString(optionB)}"
      )
    }`,
  };

  try {
    await backend.query(JSON.stringify(mutation));
    console.log("✅ Market created successfully");
  } catch (error) {
    console.error("Error creating market:", error);
    throw error;
  }
}

/**
 * Mutation: Place a bet on an option
 * @param option - 0 for Option A, 1 for Option B
 * @param amount - Bet amount (in smallest unit)
 */
export async function placeBet(option: 0 | 1, amount: number): Promise<void> {
  const backend = getBackend();

  const mutation = {
    query: `mutation {
      placeBet(option: ${option}, amount: ${amount})
    }`,
  };

  try {
    await backend.query(JSON.stringify(mutation));
    console.log(`✅ Bet placed: ${amount} on option ${option}`);
  } catch (error) {
    console.error("Error placing bet:", error);
    throw error;
  }
}

/**
 * Mutation: Close the market to prevent further betting
 */
export async function closeMarket(): Promise<void> {
  const backend = getBackend();

  const mutation = {
    query: `mutation {
      closeMarket
    }`,
  };

  try {
    await backend.query(JSON.stringify(mutation));
    console.log("✅ Market closed successfully");
  } catch (error) {
    console.error("Error closing market:", error);
    throw error;
  }
}

/**
 * Mutation: Resolve the market by declaring the winner
 * @param winningOption - 0 for Option A wins, 1 for Option B wins
 */
export async function resolveMarket(winningOption: 0 | 1): Promise<void> {
  const backend = getBackend();

  const mutation = {
    query: `mutation {
      resolveMarket(winningOption: ${winningOption})
    }`,
  };

  try {
    await backend.query(JSON.stringify(mutation));
    console.log(`✅ Market resolved! Winner: Option ${winningOption}`);
  } catch (error) {
    console.error("Error resolving market:", error);
    throw error;
  }
}

/**
 * Subscribe to blockchain notifications
 * @param callback - Function to call when new blocks are created
 */
export function subscribeToUpdates(callback: () => void): () => void {
  const client = getClient();

  client.onNotification((notification: any) => {
    if (notification.reason.NewBlock) {
      callback();
    }
  });

  // Return unsubscribe function
  return () => {
    // Linera client doesn't have explicit unsubscribe yet
    console.log("Notification subscription cleanup");
  };
}
