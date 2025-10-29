import { useNavigate } from "react-router-dom";
import DashboardPageLayout from "@/components/dashboard/layout";
import DashboardCard from "@/components/dashboard/card";
import DashboardStat from "@/components/dashboard/stat";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import MicroMarkets from "@/components/prediction-markets/MicroMarkets";
import AIBotCard, { type AIBot } from "@/components/prediction-markets/AIBotCard";
import type { Market } from "@/components/prediction-markets/MarketCard";
import ChartLineIcon from "@/components/icons/chart-line";
import AtomIcon from "@/components/icons/atom";
import ProcessorIcon from "@/components/icons/proccesor";
import BracketsIcon from "@/components/icons/brackets";

// Mock data
const mockMarkets: Market[] = [
  {
    id: "1",
    title: "Lakers vs Warriors - Next Point Scored",
    description: "Which team will score the next point in the current quarter?",
    category: "sports",
    options: [
      { id: "1a", name: "Lakers", odds: 1.85, probability: 54, volume: 12.5 },
      { id: "1b", name: "Warriors", odds: 2.1, probability: 46, volume: 8.3 },
    ],
    totalVolume: 20.8,
    participants: 47,
    endsAt: new Date(Date.now() + 3 * 60000),
    status: "active",
    resolutionTime: "micro",
  },
  {
    id: "2",
    title: "Bitcoin Price - End of Hour",
    description: "Will Bitcoin close this hour above $65,000?",
    category: "crypto",
    options: [
      { id: "2a", name: "Above $65k", odds: 1.6, probability: 62, volume: 45.2 },
      { id: "2b", name: "Below $65k", odds: 2.5, probability: 38, volume: 25.1 },
    ],
    totalVolume: 70.3,
    participants: 128,
    endsAt: new Date(Date.now() + 8 * 60000),
    status: "active",
    resolutionTime: "micro",
  },
  {
    id: "5",
    title: "ETH Gas Price - Next Block",
    description: "Will the next block gas price be above 30 gwei?",
    category: "crypto",
    options: [
      { id: "5a", name: "Above 30 gwei", odds: 1.5, probability: 65, volume: 8.2 },
      { id: "5b", name: "Below 30 gwei", odds: 2.8, probability: 35, volume: 4.1 },
    ],
    totalVolume: 12.3,
    participants: 31,
    endsAt: new Date(Date.now() + 2 * 60000),
    status: "active",
    resolutionTime: "micro",
  },
];

const mockTopBot: AIBot = {
  id: "bot1",
  name: "NBA Score Predictor",
  description: "AI trained on 10,000+ NBA games",
  type: "predictor",
  status: "active",
  performance: {
    accuracy: 87.5,
    totalPredictions: 342,
    profitLoss: 12.4,
    winRate: 68.2,
  },
  currentPredictions: [
    {
      marketId: "1",
      marketTitle: "Lakers vs Warriors - Next Point",
      prediction: "Lakers",
      confidence: 64,
    },
  ],
};

export default function DashboardOverview() {
  const navigate = useNavigate();

  const handleMarketClick = (marketId: string) => {
    navigate(`/prediction-markets/${marketId}`);
  };

  return (
    <DashboardPageLayout
      header={{
        title: "Overview",
        description: new Date().toLocaleTimeString(),
        icon: SidebarTrigger,
      }}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <DashboardStat
            label="Total Volume"
            value="405.3 ETH"
            description="12.4% increase from yesterday"
            icon={ChartLineIcon}
            intent="positive"
            direction="up"
          />
          <DashboardStat
            label="Active Markets"
            value="24"
            description="Live prediction markets"
            icon={AtomIcon}
            intent="neutral"
          />
          <DashboardStat
            label="Active AI Bots"
            value="5"
            description="Automated traders"
            icon={ProcessorIcon}
            intent="positive"
            direction="up"
          />
          <DashboardStat
            label="Total Participants"
            value="1,247"
            description="Unique traders"
            icon={BracketsIcon}
            intent="neutral"
          />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Micro Markets - Takes 2 columns */}
          <div className="lg:col-span-2">
            <MicroMarkets
              markets={mockMarkets}
              onSelectMarket={handleMarketClick}
            />
          </div>

          {/* Top Performing Bot - Takes 1 column */}
          <div>
            <DashboardCard title="🏆 Top Performing Bot" intent="success">
              <AIBotCard
                bot={mockTopBot}
                onViewDetails={() => navigate("/ai-bots")}
              />
            </DashboardCard>
          </div>
        </div>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => navigate("/linera-market")}
            >
              🔗 Linera Market
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/prediction-markets")}
            >
              Browse Markets
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/ai-bots")}
            >
              Deploy AI Bot
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/create-pool")}
            >
              Create Pool
            </Button>
          </div>
        </DashboardCard>
      </div>
    </DashboardPageLayout>
  );
}
