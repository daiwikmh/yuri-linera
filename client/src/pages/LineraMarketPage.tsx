import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPageLayout from "@/components/dashboard/layout";
import DashboardCard from "@/components/dashboard/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLineraMarket } from "@/hooks/useLineraMarket";
import ArrowLeftIcon from "@/components/icons/arrow-left";
import { Bullet } from "@/components/ui/bullet";
import { cn } from "@/lib/utils";

export default function LineraMarketPage() {
  const navigate = useNavigate();
  const {
    isInitialized,
    isClientLoading,
    clientError,
    market,
    isMarketLoading,
    marketError,
    refetchMarket,
    placeBet,
    isPlacingBet,
  } = useLineraMarket();

  const [selectedOption, setSelectedOption] = useState<0 | 1 | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handlePlaceBet = async () => {
    if (selectedOption === null || !amount) {
      setError("Please select an option and enter an amount");
      return;
    }

    const betAmount = parseInt(amount);
    if (isNaN(betAmount) || betAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError("");
    const success = await placeBet(selectedOption, betAmount);

    if (success) {
      setAmount("");
      setSelectedOption(null);
      refetchMarket();
    }
  };

  const quickAmounts = [10, 50, 100, 500];

  // Calculate odds (simplified)
  const getOdds = (optionTotal: number, otherTotal: number) => {
    if (optionTotal === 0) return 2.0;
    const totalPool = optionTotal + otherTotal;
    return totalPool / optionTotal;
  };

  const totalA = market?.totalA || 0;
  const totalB = market?.totalB || 0;
  const oddsA = getOdds(totalA, totalB);
  const oddsB = getOdds(totalB, totalA);

  const potentialPayout =
    selectedOption !== null && amount
      ? parseInt(amount) * (selectedOption === 0 ? oddsA : oddsB)
      : 0;

  const potentialProfit = potentialPayout - (parseInt(amount) || 0);

  if (isClientLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "Linera Market",
          description: "Loading...",
          icon: SidebarTrigger,
        }}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initializing Linera client...</p>
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  if (clientError || !isInitialized) {
    return (
      <DashboardPageLayout
        header={{
          title: "Linera Market",
          description: "Error",
          icon: SidebarTrigger,
        }}
      >
        <DashboardCard title="Error" intent="default">
          <div className="space-y-4">
            <p className="text-destructive">
              Failed to initialize Linera client. Please make sure:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>The Linera testnet is accessible</li>
              <li>Your browser supports WebAssembly</li>
              <li>The contract is deployed correctly</li>
            </ul>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </DashboardCard>
      </DashboardPageLayout>
    );
  }

  if (!market && !isMarketLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "Linera Market",
          description: "No market found",
          icon: SidebarTrigger,
        }}
      >
        <DashboardCard title="No Market Created" intent="default">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              No prediction market has been created yet. Create one to get started!
            </p>
            <Button onClick={() => navigate("/linera-market/create")}>
              Create Market
            </Button>
          </div>
        </DashboardCard>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Linera Market",
        description: market?.isOpen ? "Live" : "Closed",
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
            <DashboardCard title={market?.question || "Loading..."} intent="default">
              <div className="space-y-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="uppercase">
                    Linera Blockchain
                  </Badge>
                  <Badge variant={market?.isOpen ? "default" : "secondary"}>
                    {market?.isOpen ? "OPEN" : "CLOSED"}
                  </Badge>
                  {market?.winningOption !== null && (
                    <Badge variant="outline" className="bg-success/20 text-success">
                      RESOLVED
                    </Badge>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Total Bets
                    </div>
                    <div className="text-lg font-display font-medium">
                      {totalA + totalB}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                    <div className="text-lg font-display font-medium">
                      {market?.isOpen ? "Open" : "Closed"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Blockchain
                    </div>
                    <div className="text-sm font-display font-medium">Linera</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Winner
                    </div>
                    <div className="text-sm font-display font-medium">
                      {market?.winningOption !== null
                        ? market?.winningOption === 0
                          ? "Option A"
                          : "Option B"
                        : "TBD"}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Market Options</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="space-y-1">
                      <div className="font-medium">{market?.optionA}</div>
                      <div className="text-xs text-muted-foreground">
                        {totalA} total bets
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-display font-bold">
                        {oddsA.toFixed(2)}x
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {totalA + totalB > 0
                          ? ((totalA / (totalA + totalB)) * 100).toFixed(1)
                          : "50.0"}
                        % pool
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="space-y-1">
                      <div className="font-medium">{market?.optionB}</div>
                      <div className="text-xs text-muted-foreground">
                        {totalB} total bets
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-display font-bold">
                        {oddsB.toFixed(2)}x
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {totalA + totalB > 0
                          ? ((totalB / (totalA + totalB)) * 100).toFixed(1)
                          : "50.0"}
                        % pool
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Betting Interface */}
          <div className="lg:col-span-1">
            <DashboardCard title="Place Your Bet" intent="success">
              <div className="space-y-6">
                {!market?.isOpen && (
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-sm text-warning">
                      This market is closed for betting
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Outcome</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedOption(0)}
                      disabled={!market?.isOpen}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                        "hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed",
                        selectedOption === 0
                          ? "border-primary bg-primary/5"
                          : "border-border bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "size-4 rounded-full border-2 transition-all",
                            selectedOption === 0
                              ? "border-primary bg-primary"
                              : "border-border"
                          )}
                        >
                          {selectedOption === 0 && (
                            <div className="size-full rounded-full bg-primary-foreground scale-50" />
                          )}
                        </div>
                        <span className="font-medium">{market?.optionA}</span>
                      </div>
                      <Badge variant="outline" className="font-display">
                        {oddsA.toFixed(2)}x
                      </Badge>
                    </button>

                    <button
                      onClick={() => setSelectedOption(1)}
                      disabled={!market?.isOpen}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                        "hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed",
                        selectedOption === 1
                          ? "border-primary bg-primary/5"
                          : "border-border bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "size-4 rounded-full border-2 transition-all",
                            selectedOption === 1
                              ? "border-primary bg-primary"
                              : "border-border"
                          )}
                        >
                          {selectedOption === 1 && (
                            <div className="size-full rounded-full bg-primary-foreground scale-50" />
                          )}
                        </div>
                        <span className="font-medium">{market?.optionB}</span>
                      </div>
                      <Badge variant="outline" className="font-display">
                        {oddsB.toFixed(2)}x
                      </Badge>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Bet Amount</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!market?.isOpen || selectedOption === null}
                    className="text-lg font-display"
                    step="1"
                    min="0"
                  />
                  <div className="flex gap-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(amt.toString())}
                        disabled={!market?.isOpen || selectedOption === null}
                        className="flex-1"
                      >
                        {amt}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedOption !== null && amount && (
                  <div className="space-y-2 p-4 rounded-lg bg-accent">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Potential Payout
                      </span>
                      <span className="font-display font-medium">
                        {potentialPayout.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Potential Profit
                      </span>
                      <span
                        className={cn(
                          "font-display font-medium",
                          potentialProfit > 0 ? "text-success" : "text-destructive"
                        )}
                      >
                        +{potentialProfit.toFixed(0)}
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handlePlaceBet}
                  disabled={
                    !market?.isOpen ||
                    selectedOption === null ||
                    !amount ||
                    isPlacingBet
                  }
                  className="w-full"
                  size="lg"
                >
                  {isPlacingBet ? "Placing Bet..." : "Place Bet"}
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  <Bullet className="inline mr-1" />
                  Powered by Linera Blockchain
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
