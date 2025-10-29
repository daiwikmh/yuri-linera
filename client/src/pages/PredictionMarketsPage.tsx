import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPageLayout from "@/components/dashboard/layout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MarketCard, { type Market } from "@/components/prediction-markets/MarketCard";
import MarketStats from "@/components/prediction-markets/MarketStats";
import MicroMarkets from "@/components/prediction-markets/MicroMarkets";

// Mock data - In production, this would come from API/blockchain
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
    endsAt: new Date(Date.now() + 3 * 60000), // 3 minutes
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
    endsAt: new Date(Date.now() + 8 * 60000), // 8 minutes
    status: "active",
    resolutionTime: "micro",
  },
  {
    id: "3",
    title: "League of Legends - First Baron",
    description: "Which team will secure the first Baron in Game 3?",
    category: "esports",
    options: [
      { id: "3a", name: "Team A", odds: 1.75, probability: 57, volume: 18.4 },
      { id: "3b", name: "Team B", odds: 2.2, probability: 43, volume: 12.9 },
    ],
    totalVolume: 31.3,
    participants: 89,
    endsAt: new Date(Date.now() + 15 * 60000), // 15 minutes
    status: "active",
    resolutionTime: "normal",
  },
  {
    id: "4",
    title: "US Elections 2024 - Winner",
    description: "Who will win the 2024 US Presidential Election?",
    category: "cultural",
    options: [
      { id: "4a", name: "Candidate A", odds: 1.9, probability: 52, volume: 142.5 },
      { id: "4b", name: "Candidate B", odds: 2.0, probability: 48, volume: 128.7 },
    ],
    totalVolume: 271.2,
    participants: 542,
    endsAt: new Date(Date.now() + 180 * 24 * 60 * 60000), // 180 days
    status: "active",
    resolutionTime: "normal",
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
    endsAt: new Date(Date.now() + 2 * 60000), // 2 minutes
    status: "active",
    resolutionTime: "micro",
  },
];

export default function PredictionMarketsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState<string>("all");

  // Calculate stats
  const totalVolume = mockMarkets.reduce((sum, m) => sum + m.totalVolume, 0);
  const activeMarkets = mockMarkets.filter((m) => m.status === "active").length;
  const totalParticipants = mockMarkets.reduce(
    (sum, m) => sum + m.participants,
    0
  );
  const last24hVolume = totalVolume * 0.65; // Mock: 65% of total volume
  const volumeChange = 12.4; // Mock: 12.4% increase

  // Filter markets
  const filteredMarkets = mockMarkets.filter((market) => {
    if (selectedTab === "micro") return market.resolutionTime === "micro";
    if (selectedTab === "sports") return market.category === "sports";
    if (selectedTab === "esports") return market.category === "esports";
    if (selectedTab === "crypto") return market.category === "crypto";
    if (selectedTab === "cultural") return market.category === "cultural";
    return true;
  });

  const handleMarketClick = (marketId: string) => {
    navigate(`/prediction-markets/${marketId}`);
  };

  return (
    <DashboardPageLayout
      header={{
        title: "Prediction Markets",
        description: "Live betting on real-time events",
        icon: SidebarTrigger,
      }}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Stats Overview */}
        <MarketStats
          totalVolume={totalVolume}
          activeMarkets={activeMarkets}
          totalParticipants={totalParticipants}
          last24hVolume={last24hVolume}
          volumeChange={volumeChange}
        />

        {/* Micro Markets Section */}
        <MicroMarkets
          markets={mockMarkets}
          onSelectMarket={handleMarketClick}
        />

        {/* Markets Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="all">All Markets</TabsTrigger>
            <TabsTrigger value="micro">
              ⚡ Micro
              <Badge variant="outline" className="ml-2">
                {mockMarkets.filter((m) => m.resolutionTime === "micro").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sports">
              Sports
              <Badge variant="outline" className="ml-2">
                {mockMarkets.filter((m) => m.category === "sports").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="esports">
              Esports
              <Badge variant="outline" className="ml-2">
                {mockMarkets.filter((m) => m.category === "esports").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="crypto">
              Crypto
              <Badge variant="outline" className="ml-2">
                {mockMarkets.filter((m) => m.category === "crypto").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="cultural">
              Cultural
              <Badge variant="outline" className="ml-2">
                {mockMarkets.filter((m) => m.category === "cultural").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredMarkets.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-sm">No markets found</p>
                  <p className="text-xs mt-1">Try selecting a different category</p>
                </div>
              ) : (
                filteredMarkets.map((market) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    onClick={() => handleMarketClick(market.id)}
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
