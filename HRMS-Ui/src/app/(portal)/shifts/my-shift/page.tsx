import { Metadata } from "next";
import ShiftTable from "@/components/modules/shifts/ShiftTable";

export const metadata: Metadata = {
  title: "My Shift Schedule | EuITSols HRMS",
};

export default function MyShiftPage() {
  return <ShiftTable myShiftOnly={true} />;
}
