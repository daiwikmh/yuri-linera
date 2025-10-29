import React, { useState } from "react";
import DashboardPageLayout from "@/components/dashboard/layout";
import DashboardCard from "@/components/dashboard/card";
import DashboardStat from "@/components/dashboard/stat";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AIBotCard, { type AIBot } from "@/components/prediction-markets/AIBotCard";
import CuteRobotIcon from "@/components/icons/cute-robot";
import ChartLineIcon from "@/components/icons/chart-line";
import ProcessorIcon from "@/components/icons/proccesor";
import BracketsIcon from "@/components/icons/brackets";

// Mock data - In production, fetch from API
const mockBots: AIBot[] = [
  {
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
      {
        marketId: "2",
        marketTitle: "Celtics vs Heat - Winner",
        prediction: "Celtics",
        confidence: 71,
      },
    ],
  },
  {
    id: "bot2",
    name: "Crypto Odds Maker",
    description: "Dynamic odds calculation for crypto markets",
    type: "odds-maker",
    status: "active",
    performance: {
      accuracy: 92.1,
      totalPredictions: 1247,
      profitLoss: 34.7,
      winRate: 74.3,
    },
    currentPredictions: [],
  },
  {
    id: "bot3",
    name: "Auto Trader Pro",
    description: "Automated trading based on market inefficiencies",
    type: "trader",
    status: "active",
    performance: {
      accuracy: 78.9,
      totalPredictions: 892,
      profitLoss: 8.2,
      winRate: 61.5,
    },
    currentPredictions: [
      {
        marketId: "3",
        marketTitle: "ETH Price Movement",
        prediction: "Up",
        confidence: 58,
      },
    ],
  },
  {
    id: "bot4",
    name: "Esports Oracle",
    description: "League of Legends and Dota 2 specialist",
    type: "predictor",
    status: "paused",
    performance: {
      accuracy: 81.3,
      totalPredictions: 567,
      profitLoss: -2.1,
      winRate: 55.7,
    },
    currentPredictions: [],
  },
  {
    id: "bot5",
    name: "Micro Market Hunter",
    description: "Optimized for fast-resolving micro markets",
    type: "trader",
    status: "training",
    performance: {
      accuracy: 0,
      totalPredictions: 0,
      profitLoss: 0,
      winRate: 0,
    },
    currentPredictions: [],
  },
];

export default function AIBotsPage() {
  const [bots, setBots] = useState<AIBot[]>(mockBots);
  const [selectedTab, setSelectedTab] = useState<string>("all");

  // Calculate aggregate stats
  const activeBots = bots.filter((b) => b.status === "active").length;
  const totalPredictions = bots.reduce(
    (sum, b) => sum + b.performance.totalPredictions,
    0
  );
  const totalProfitLoss = bots.reduce(
    (sum, b) => sum + b.performance.profitLoss,
    0
  );
  const avgAccuracy =
    bots.reduce((sum, b) => sum + b.performance.accuracy, 0) / bots.length;

  // Filter bots
  const filteredBots = bots.filter((bot) => {
    if (selectedTab === "active") return bot.status === "active";
    if (selectedTab === "odds-maker") return bot.type === "odds-maker";
    if (selectedTab === "trader") return bot.type === "trader";
    if (selectedTab === "predictor") return bot.type === "predictor";
    return true;
  });

  const handleToggleBotStatus = (botId: string) => {
    setBots((prev) =>
      prev.map((bot) =>
        bot.id === botId
          ? {
              ...bot,
              status: bot.status === "active" ? "paused" : "active",
            }
          : bot
      )
    );
  };

  const handleViewBotDetails = (botId: string) => {
    console.log("View bot details:", botId);
    // In production, navigate to bot detail page
    alert(`Bot details for ${botId} - Feature coming soon!`);
  };

  return (
    <DashboardPageLayout
      header={{
        title: "AI Bots",
        description: "Manage your AI trading bots",
        icon: SidebarTrigger,
      }}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <DashboardStat
            label="Active Bots"
            value={activeBots.toString()}
            description={`${bots.length} total bots`}
            icon={CuteRobotIcon}
            intent="positive"
            direction="up"
          />
          <DashboardStat
            label="Total Predictions"
            value={totalPredictions.toString()}
            description="All-time predictions"
            icon={BracketsIcon}
            intent="neutral"
          />
          <DashboardStat
            label="Average Accuracy"
            value={`${avgAccuracy.toFixed(1)}%`}
            description="Across all bots"
            icon={ChartLineIcon}
            intent="positive"
            direction="up"
          />
          <DashboardStat
            label="Total P/L"
            value={`${totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)} ETH`}
            description="Combined profit/loss"
            icon={ProcessorIcon}
            intent={totalProfitLoss >= 0 ? "positive" : "negative"}
            direction={totalProfitLoss >= 0 ? "up" : "down"}
          />
        </div>

        {/* Create Bot CTA */}
        <DashboardCard title="Deploy New Bot" intent="success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Deploy specialized AI bots to automate your trading strategy
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Odds Makers</Badge>
                <Badge variant="outline">Traders</Badge>
                <Badge variant="outline">Predictors</Badge>
              </div>
            </div>
            <Button size="lg">
              Deploy New Bot
            </Button>
          </div>
        </DashboardCard>

        {/* Bots Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="all">
              All Bots
              <Badge variant="outline" className="ml-2">
                {bots.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              <Badge variant="outline" className="ml-2">
                {bots.filter((b) => b.status === "active").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="odds-maker">
              Odds Makers
              <Badge variant="outline" className="ml-2">
                {bots.filter((b) => b.type === "odds-maker").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="trader">
              Traders
              <Badge variant="outline" className="ml-2">
                {bots.filter((b) => b.type === "trader").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="predictor">
              Predictors
              <Badge variant="outline" className="ml-2">
                {bots.filter((b) => b.type === "predictor").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredBots.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <CuteRobotIcon className="size-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No bots found</p>
                  <p className="text-xs mt-1">
                    Try selecting a different category or deploy a new bot
                  </p>
                </div>
              ) : (
                filteredBots.map((bot) => (
                  <AIBotCard
                    key={bot.id}
                    bot={bot}
                    onToggleStatus={() => handleToggleBotStatus(bot.id)}
                    onViewDetails={() => handleViewBotDetails(bot.id)}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
