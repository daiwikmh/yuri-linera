import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bullet } from "@/components/ui/bullet";
import { cn } from "@/lib/utils";
import type { MarketOption } from "./MarketCard";

interface BettingInterfaceProps {
  options: MarketOption[];
  onPlaceBet: (optionId: string, amount: number) => Promise<void>;
  isConnected: boolean;
  className?: string;
}

export default function BettingInterface({
  options,
  onPlaceBet,
  isConnected,
  className,
}: BettingInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string>("");

  const selectedOptionData = options.find((opt) => opt.id === selectedOption);

  const potentialPayout =
    selectedOptionData && amount
      ? parseFloat(amount) * selectedOptionData.odds
      : 0;

  const potentialProfit = potentialPayout - (parseFloat(amount) || 0);

  const handlePlaceBet = async () => {
    if (!selectedOption || !amount) {
      setError("Please select an option and enter an amount");
      return;
    }

    const betAmount = parseFloat(amount);
    if (isNaN(betAmount) || betAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsPlacing(true);
    setError("");

    try {
      await onPlaceBet(selectedOption, betAmount);
      setAmount("");
      setSelectedOption(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place bet");
    } finally {
      setIsPlacing(false);
    }
  };

  const quickAmounts = [0.1, 0.5, 1, 5];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet variant="success" />
          Place Your Bet
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isConnected && (
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-warning">
              Connect your wallet to place bets
            </p>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium">Select Outcome</label>
          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                disabled={!isConnected}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                  "hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed",
                  selectedOption === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-accent"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-4 rounded-full border-2 transition-all",
                      selectedOption === option.id
                        ? "border-primary bg-primary"
                        : "border-border"
                    )}
                  >
                    {selectedOption === option.id && (
                      <div className="size-full rounded-full bg-primary-foreground scale-50" />
                    )}
                  </div>
                  <span className="font-medium">{option.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {option.probability.toFixed(1)}%
                  </span>
                  <Badge variant="outline" className="font-display">
                    {option.odds.toFixed(2)}x
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Bet Amount (ETH)</label>
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!isConnected || !selectedOption}
            className="text-lg font-display"
            step="0.01"
            min="0"
          />
          <div className="flex gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt.toString())}
                disabled={!isConnected || !selectedOption}
                className="flex-1"
              >
                {amt} ETH
              </Button>
            ))}
          </div>
        </div>

        {selectedOption && amount && (
          <div className="space-y-2 p-4 rounded-lg bg-accent">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Potential Payout</span>
              <span className="font-display font-medium">
                {potentialPayout.toFixed(4)} ETH
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Potential Profit</span>
              <span
                className={cn(
                  "font-display font-medium",
                  potentialProfit > 0 ? "text-success" : "text-destructive"
                )}
              >
                +{potentialProfit.toFixed(4)} ETH
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
          disabled={!isConnected || !selectedOption || !amount || isPlacing}
          className="w-full"
          size="lg"
        >
          {isPlacing ? "Placing Bet..." : "Place Bet"}
        </Button>
      </CardContent>
    </Card>
  );
}
