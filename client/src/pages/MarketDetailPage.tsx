import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import DashboardPageLayout from "@/components/dashboard/layout";
import DashboardCard from "@/components/dashboard/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BettingInterface from "@/components/prediction-markets/BettingInterface";
import AIBotCard, { type AIBot } from "@/components/prediction-markets/AIBotCard";
import type { Market } from "@/components/prediction-markets/MarketCard";
import ArrowLeftIcon from "@/components/icons/arrow-left";

// Mock data - In production, fetch from API/blockchain
const mockMarket: Market = {
  id: "1",
  title: "Lakers vs Warriors - Next Point Scored",
  description:
    "Which team will score the next point in the current quarter? Live betting on NBA action with real-time odds updates.",
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
};

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
    ],
  },
];

export default function MarketDetailPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [market] = useState<Market>(mockMarket);

  const handlePlaceBet = async (optionId: string, amount: number) => {
    // In production, this would interact with smart contracts
    console.log("Placing bet:", { marketId, optionId, amount, address });

    // Simulate transaction
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
          alert(`Bet placed successfully: ${amount} ETH on ${optionId}`);
        } else {
          reject(new Error("Transaction failed"));
        }
      }, 2000);
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const diff = market.endsAt.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getCategoryColor = () => {
    switch (market.category) {
      case "sports":
        return "bg-chart-1/20 text-chart-1";
      case "esports":
        return "bg-chart-2/20 text-chart-2";
      case "cultural":
        return "bg-chart-3/20 text-chart-3";
      case "crypto":
        return "bg-chart-4/20 text-chart-4";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardPageLayout
      header={{
        title: "Market Details",
        description: getTimeRemaining(),
        icon: SidebarTrigger,
      }}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/prediction-markets")}
          className="gap-2"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Markets
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Details */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardCard title={market.title} intent="default">
              <div className="space-y-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getCategoryColor()}>
                    {market.category.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {market.status.toUpperCase()}
                  </Badge>
                  {market.resolutionTime === "micro" && (
                    <Badge variant="outline">⚡ FAST RESOLUTION</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {market.description}
                </p>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Total Volume
                    </div>
                    <div className="text-lg font-display font-medium">
                      {market.totalVolume.toFixed(2)} ETH
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Participants
                    </div>
                    <div className="text-lg font-display font-medium">
                      {market.participants}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Closes In
                    </div>
                    <div className="text-lg font-display font-medium text-warning">
                      {getTimeRemaining()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Resolution
                    </div>
                    <div className="text-lg font-display font-medium">
                      {market.resolutionTime === "micro" ? "Minutes" : "Normal"}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Market Options</h3>
                  {market.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{option.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.volume.toFixed(2)} ETH volume
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-display font-bold">
                          {option.odds.toFixed(2)}x
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {option.probability.toFixed(1)}% implied
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>

            {/* AI Bot Predictions */}
            <DashboardCard title="🤖 AI Bot Predictions" intent="success">
              <div className="space-y-4">
                {mockBots.map((bot) => (
                  <div
                    key={bot.id}
                    className="p-4 rounded-lg border border-border bg-accent"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium">{bot.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {bot.description}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {bot.performance.accuracy.toFixed(1)}% accuracy
                      </Badge>
                    </div>
                    {bot.currentPredictions &&
                      bot.currentPredictions.length > 0 && (
                        <div className="space-y-2">
                          {bot.currentPredictions.map((pred, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>
                                Predicting: <strong>{pred.prediction}</strong>
                              </span>
                              <Badge variant="outline">
                                {pred.confidence}% confidence
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* Betting Interface */}
          <div className="lg:col-span-1">
            <BettingInterface
              options={market.options}
              onPlaceBet={handlePlaceBet}
              isConnected={isConnected}
              className="sticky top-24"
            />
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
