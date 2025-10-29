import React from "react";
import DashboardStat from "@/components/dashboard/stat";
import ChartLineIcon from "@/components/icons/chart-line";
import AtomIcon from "@/components/icons/atom";
import ProcessorIcon from "@/components/icons/proccesor";
import BracketsIcon from "@/components/icons/brackets";

interface MarketStatsProps {
  totalVolume: number;
  activeMarkets: number;
  totalParticipants: number;
  last24hVolume: number;
  volumeChange?: number; // percentage change
  className?: string;
}

export default function MarketStats({
  totalVolume,
  activeMarkets,
  totalParticipants,
  last24hVolume,
  volumeChange = 0,
  className,
}: MarketStatsProps) {
  const volumeDirection = volumeChange >= 0 ? "up" : "down";
  const volumeIntent = volumeChange >= 0 ? "positive" : "negative";

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardStat
          label="Total Volume"
          value={`${totalVolume.toFixed(2)} ETH`}
          description={`${Math.abs(volumeChange).toFixed(1)}% ${
            volumeChange >= 0 ? "increase" : "decrease"
          } from yesterday`}
          icon={ChartLineIcon}
          intent={volumeIntent}
          direction={volumeDirection}
        />

        <DashboardStat
          label="Active Markets"
          value={activeMarkets.toString()}
          description="Live prediction markets"
          icon={AtomIcon}
          intent="neutral"
        />

        <DashboardStat
          label="Participants"
          value={totalParticipants.toString()}
          description="Unique traders"
          icon={BracketsIcon}
          intent="neutral"
        />

        <DashboardStat
          label="24h Volume"
          value={`${last24hVolume.toFixed(2)} ETH`}
          description="Last 24 hours"
          icon={ProcessorIcon}
          intent="positive"
          direction="up"
        />
      </div>
    </div>
  );
}
