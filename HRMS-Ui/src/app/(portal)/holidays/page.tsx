import { Metadata } from "next";
import HolidayTable from "@/components/modules/holidays/HolidayTable";

export const metadata: Metadata = {
  title: "Holiday Calendar | EuITSols HRMS",
};

export default function HolidaysPage() {
  return <HolidayTable />;
}
