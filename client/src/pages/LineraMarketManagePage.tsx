import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPageLayout from "@/components/dashboard/layout";
import DashboardCard from "@/components/dashboard/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLineraMarket } from "@/hooks/useLineraMarket";

export default function LineraMarketManagePage() {
  const navigate = useNavigate();
  const {
    isInitialized,
    isClientLoading,
    clientError,
    market,
    isMarketLoading,
    createMarket,
    isCreating,
    closeMarket,
    resolveMarket,
    isProcessing,
    refetchMarket,
  } = useLineraMarket();

  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [error, setError] = useState("");

  const handleCreateMarket = async () => {
    if (!question || !optionA || !optionB) {
      setError("All fields are required");
      return;
    }

    setError("");
    const success = await createMarket(question, optionA, optionB);

    if (success) {
      setQuestion("");
      setOptionA("");
      setOptionB("");
      refetchMarket();
      navigate("/linera-market");
    }
  };

  const handleCloseMarket = async () => {
    if (confirm("Are you sure you want to close this market? This action cannot be undone.")) {
      const success = await closeMarket();
      if (success) {
        refetchMarket();
      }
    }
  };

  const handleResolveMarket = async (winningOption: 0 | 1) => {
    const optionName = winningOption === 0 ? market?.optionA : market?.optionB;
    if (
      confirm(
        `Are you sure you want to resolve this market with "${optionName}" as the winner? This action cannot be undone.`
      )
    ) {
      const success = await resolveMarket(winningOption);
      if (success) {
        refetchMarket();
      }
    }
  };

  if (isClientLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "Market Management",
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
          title: "Market Management",
          description: "Error",
          icon: SidebarTrigger,
        }}
      >
        <DashboardCard title="Error" intent="default">
          <div className="space-y-4">
            <p className="text-destructive">Failed to initialize Linera client.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </DashboardCard>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Market Management",
        description: "Admin Panel",
        icon: SidebarTrigger,
      }}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Create Market */}
        {!market && (
          <DashboardCard title="Create New Market" intent="success">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Question</label>
                <Input
                  placeholder="e.g., Will Bitcoin reach $100k by end of 2025?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Option A</label>
                  <Input
                    placeholder="e.g., Yes"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Option B</label>
                  <Input
                    placeholder="e.g., No"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                onClick={handleCreateMarket}
                disabled={isCreating || !question || !optionA || !optionB}
                size="lg"
                className="w-full"
              >
                {isCreating ? "Creating Market..." : "Create Market"}
              </Button>
            </div>
          </DashboardCard>
        )}

        {/* Manage Existing Market */}
        {market && (
          <>
            <DashboardCard title="Current Market" intent="default">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{market.question}</h3>
                    <Badge variant={market.isOpen ? "default" : "secondary"}>
                      {market.isOpen ? "OPEN" : "CLOSED"}
                    </Badge>
                    {market.winningOption !== null && (
                      <Badge variant="outline" className="bg-success/20 text-success">
                        RESOLVED
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-accent">
                    <div className="text-sm text-muted-foreground mb-1">Option A</div>
                    <div className="text-lg font-medium">{market.optionA}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {market.totalA} total bets
                    </div>
                    {market.winningOption === 0 && (
                      <Badge variant="outline" className="mt-2 bg-success/20 text-success">
                        WINNER
                      </Badge>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-accent">
                    <div className="text-sm text-muted-foreground mb-1">Option B</div>
                    <div className="text-lg font-medium">{market.optionB}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {market.totalB} total bets
                    </div>
                    {market.winningOption === 1 && (
                      <Badge variant="outline" className="mt-2 bg-success/20 text-success">
                        WINNER
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Total Bets
                    </div>
                    <div className="text-2xl font-display font-bold">
                      {market.totalA + market.totalB}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <div className="text-2xl font-display font-bold">
                      {market.isOpen ? "Open" : "Closed"}
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Market Actions" intent="default">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Close Market</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Close the market to prevent further betting. This action cannot be undone.
                  </p>
                  <Button
                    onClick={handleCloseMarket}
                    disabled={!market.isOpen || isProcessing}
                    variant="outline"
                  >
                    {isProcessing ? "Processing..." : "Close Market"}
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Resolve Market</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Declare the winning option. The market must be closed first.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleResolveMarket(0)}
                      disabled={
                        market.isOpen ||
                        market.winningOption !== null ||
                        isProcessing
                      }
                      variant="default"
                      className="flex-1"
                    >
                      {market.optionA} Wins
                    </Button>
                    <Button
                      onClick={() => handleResolveMarket(1)}
                      disabled={
                        market.isOpen ||
                        market.winningOption !== null ||
                        isProcessing
                      }
                      variant="default"
                      className="flex-1"
                    >
                      {market.optionB} Wins
                    </Button>
                  </div>
                  {market.isOpen && (
                    <p className="text-xs text-warning mt-2">
                      ⚠️ Close the market before resolving
                    </p>
                  )}
                  {market.winningOption !== null && (
                    <p className="text-xs text-success mt-2">
                      ✅ Market already resolved
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/linera-market")}
                    className="flex-1"
                  >
                    View Market
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => refetchMarket()}
                    className="flex-1"
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </DashboardCard>
          </>
        )}
      </div>
    </DashboardPageLayout>
  );
}
