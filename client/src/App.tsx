import { AppLayout } from "@/pages/Layout";
import DashboardOverview from "./pages/DashBoard";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/utils/wallet/config/WalletConfig";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Pool from "@/components/pool/Pool";
import Canvas from "./pages/Canvas";
import PredictionMarketsPage from "./pages/PredictionMarketsPage";
import MarketDetailPage from "./pages/MarketDetailPage";
import AIBotsPage from "./pages/AIBotsPage";
import LineraMarketPage from "./pages/LineraMarketPage";
import LineraMarketManagePage from "./pages/LineraMarketManagePage";
import { baseSepolia } from "viem/chains";
function App() {
  const client = new QueryClient();

  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={client}>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/create-pool" element={<Pool />} />
                <Route path="/canvas" element={<Canvas />} />
                <Route path="/prediction-markets" element={<PredictionMarketsPage />} />
                <Route path="/prediction-markets/:marketId" element={<MarketDetailPage />} />
                <Route path="/ai-bots" element={<AIBotsPage />} />
                <Route path="/linera-market" element={<LineraMarketPage />} />
                <Route path="/linera-market/manage" element={<LineraMarketManagePage />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
