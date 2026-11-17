import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | EuITSols HRMS",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
