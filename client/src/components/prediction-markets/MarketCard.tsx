import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bullet } from "@/components/ui/bullet";
import { cn } from "@/lib/utils";

export interface Market {
  id: string;
  title: string;
  description: string;
  category: "sports" | "esports" | "cultural" | "crypto";
  options: MarketOption[];
  totalVolume: number;
  participants: number;
  endsAt: Date;
  status: "active" | "resolving" | "resolved";
  resolutionTime?: "micro" | "normal"; // micro = minutes, normal = hours/days
}

export interface MarketOption {
  id: string;
  name: string;
  odds: number; // e.g., 1.5 means bet 1 ETH to win 1.5 ETH
  probability: number; // 0-100
  volume: number;
}

interface MarketCardProps {
  market: Market;
  onClick?: () => void;
  className?: string;
}

export default function MarketCard({
  market,
  onClick,
  className,
}: MarketCardProps) {
  const getTimeRemaining = () => {
    const now = new Date();
    const diff = market.endsAt.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
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

  const getStatusVariant = () => {
    switch (market.status) {
      case "active":
        return "default";
      case "resolving":
        return "secondary";
      case "resolved":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2.5 text-base">
          <Bullet />
          <span className="line-clamp-1">{market.title}</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {market.resolutionTime === "micro" && (
            <Badge variant="outline" className="uppercase text-xs">
              ⚡ Fast
            </Badge>
          )}
          <Badge variant={getStatusVariant()} className="uppercase text-xs">
            {market.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {market.description}
        </p>

        <div className="flex items-center gap-2">
          <Badge className={cn("uppercase text-xs", getCategoryColor())}>
            {market.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {getTimeRemaining()}
          </span>
        </div>

        <div className="space-y-2">
          {market.options.slice(0, 2).map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between p-2 rounded-md bg-accent"
            >
              <span className="text-sm font-medium">{option.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {option.probability.toFixed(1)}%
                </span>
                <Badge variant="outline" className="font-display">
                  {option.odds.toFixed(2)}x
                </Badge>
              </div>
            </div>
          ))}
          {market.options.length > 2 && (
            <div className="text-xs text-center text-muted-foreground">
              +{market.options.length - 2} more options
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{market.participants}</span>{" "}
            participants
          </div>
          <div className="text-xs text-muted-foreground">
            Volume:{" "}
            <span className="font-medium font-display">
              {market.totalVolume.toFixed(2)} ETH
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
