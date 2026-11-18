import {
  Browser,
  ChartLineUp,
  Database,
  DeviceMobile,
  Robot,
  TrendUp,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";

/** Shared map for home Services + service pages. */
export const serviceIcons: Record<string, Icon> = {
  browser: Browser,
  device: DeviceMobile,
  trend: TrendUp,
  chart: ChartLineUp,
  robot: Robot,
  users: UsersThree,
  database: Database,
};
