import type { Metadata } from "next";
import PortalAuthGuard from "@/components/guards/PortalAuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import { TaskProvider } from "@/context/TaskContext";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Portal | ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalAuthGuard>
      <TaskProvider>
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
          {/* Full-width Topbar matching the design */}
          <Topbar />
          <div className="flex flex-1 min-h-0">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </TaskProvider>
    </PortalAuthGuard>
  );
}
