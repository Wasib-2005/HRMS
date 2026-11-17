import { Metadata } from "next";
import AssetTable from "@/components/modules/assets/AssetTable";

export const metadata: Metadata = {
  title: "My Assigned Assets | EuITSols HRMS",
};

export default function MyAssetsPage() {
  return <AssetTable myAssetsOnly={true} />;
}
