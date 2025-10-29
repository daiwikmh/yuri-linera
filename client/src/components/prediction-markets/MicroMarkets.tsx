import React from "react";
import DashboardCard from "@/components/dashboard/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Market } from "./MarketCard";

interface MicroMarketsProps {
  markets: Market[];
  onSelectMarket: (marketId: string) => void;
  className?: string;
}

export default function MicroMarkets({
  markets,
  onSelectMarket,
  className,
}: MicroMarketsProps) {
  const microMarkets = markets.filter((m) => m.resolutionTime === "micro");

  const getTimeRemaining = (endsAt: Date) => {
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getUrgencyColor = (endsAt: Date) => {
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 2) return "text-destructive";
    if (minutes < 5) return "text-warning";
    return "text-success";
  };

  return (
    <DashboardCard
      title="⚡ Micro Markets"
      intent="success"
      className={className}
      addon={
        <Badge variant="outline" className="uppercase text-xs">
          Resolves in minutes
        </Badge>
      }
    >
      <div className="space-y-3">
        {microMarkets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No active micro markets</p>
            <p className="text-xs mt-1">Check back soon for fast trades!</p>
          </div>
        ) : (
          microMarkets.map((market) => (
            <div
              key={market.id}
              className="p-3 rounded-lg border border-border bg-card hover:bg-accent transition-all cursor-pointer"
              onClick={() => onSelectMarket(market.id)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">
                    {market.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {market.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="uppercase text-xs">
                    {market.status}
                  </Badge>
                  <span
                    className={cn(
                      "text-xs font-display font-medium",
                      getUrgencyColor(market.endsAt)
                    )}
                  >
                    {getTimeRemaining(market.endsAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {market.options.slice(0, 3).map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center gap-2 px-2 py-1 rounded bg-accent text-xs"
                  >
                    <span className="font-medium">{option.name}</span>
                    <Badge variant="outline" className="text-xs font-display">
                      {option.odds.toFixed(2)}x
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {market.participants} traders
                </span>
                <span className="text-xs font-display font-medium">
                  {market.totalVolume.toFixed(2)} ETH
                </span>
              </div>
            </div>
          ))
        )}

        {microMarkets.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Navigate to all markets view
              window.dispatchEvent(
                new CustomEvent("navigate", { detail: "/prediction-markets" })
              );
            }}
          >
            View All Micro Markets
          </Button>
        )}
      </div>
    </DashboardCard>
  );
}
