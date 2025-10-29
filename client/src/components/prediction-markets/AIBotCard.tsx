import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bullet } from "@/components/ui/bullet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CuteRobotIcon from "@/components/icons/cute-robot";

export interface AIBot {
  id: string;
  name: string;
  description: string;
  type: "odds-maker" | "trader" | "predictor";
  status: "active" | "paused" | "training";
  performance: {
    accuracy: number; // 0-100
    totalPredictions: number;
    profitLoss: number; // in ETH
    winRate: number; // 0-100
  };
  currentPredictions?: {
    marketId: string;
    marketTitle: string;
    prediction: string;
    confidence: number; // 0-100
  }[];
}

interface AIBotCardProps {
  bot: AIBot;
  onToggleStatus?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export default function AIBotCard({
  bot,
  onToggleStatus,
  onViewDetails,
  className,
}: AIBotCardProps) {
  const getTypeColor = () => {
    switch (bot.type) {
      case "odds-maker":
        return "bg-chart-1/20 text-chart-1";
      case "trader":
        return "bg-chart-2/20 text-chart-2";
      case "predictor":
        return "bg-chart-3/20 text-chart-3";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusVariant = () => {
    switch (bot.status) {
      case "active":
        return "default";
      case "paused":
        return "secondary";
      case "training":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusColor = () => {
    switch (bot.status) {
      case "active":
        return "text-success";
      case "paused":
        return "text-warning";
      case "training":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <CuteRobotIcon className="size-7 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2.5 text-base">
              <Bullet variant={bot.status === "active" ? "success" : "default"} />
              <span>{bot.name}</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {bot.description}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant()} className="uppercase text-xs">
          {bot.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={cn("uppercase text-xs", getTypeColor())}>
            {bot.type.replace("-", " ")}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-accent">
            <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
            <div className="text-lg font-display font-medium">
              {bot.performance.accuracy.toFixed(1)}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-accent">
            <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
            <div className="text-lg font-display font-medium">
              {bot.performance.winRate.toFixed(1)}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-accent">
            <div className="text-xs text-muted-foreground mb-1">
              Predictions
            </div>
            <div className="text-lg font-display font-medium">
              {bot.performance.totalPredictions}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-accent">
            <div className="text-xs text-muted-foreground mb-1">P/L</div>
            <div
              className={cn(
                "text-lg font-display font-medium",
                bot.performance.profitLoss >= 0
                  ? "text-success"
                  : "text-destructive"
              )}
            >
              {bot.performance.profitLoss >= 0 ? "+" : ""}
              {bot.performance.profitLoss.toFixed(2)} ETH
            </div>
          </div>
        </div>

        {bot.currentPredictions && bot.currentPredictions.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase">
              Current Predictions
            </div>
            {bot.currentPredictions.slice(0, 2).map((pred, idx) => (
              <div
                key={idx}
                className="p-2 rounded-md bg-accent/50 border border-border"
              >
                <div className="text-xs font-medium line-clamp-1">
                  {pred.marketTitle}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {pred.prediction}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {pred.confidence}% conf.
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onToggleStatus && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleStatus}
              className="flex-1"
            >
              {bot.status === "active" ? "Pause" : "Activate"}
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant="default"
              size="sm"
              onClick={onViewDetails}
              className="flex-1"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
