import { Metadata } from "next";
import DashboardOverview from "@/components/modules/dashboard/DashboardOverview";

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard | EuITSols HRMS",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
