import {
  Browser,
  ChartLineUp,
  Database,
  Robot,
  TrendUp,
  type Icon,
} from "@phosphor-icons/react";

/** Shared map for home Services + service pages. */
export const serviceIcons: Record<string, Icon> = {
  browser: Browser,
  trend: TrendUp,
  chart: ChartLineUp,
  robot: Robot,
  database: Database,
};
