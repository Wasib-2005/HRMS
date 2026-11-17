import { Metadata } from "next";
import TaskListView from "@/components/modules/tasks/TaskListView";
import RoleGuard from "@/components/guards/RoleGuard";

export const instant = false;

export const metadata: Metadata = {
  title: "Task List | EuITSols HRMS",
};

export default function TasksPage() {
  return (
    <RoleGuard allowedRoles={["Employee"]}>
      <TaskListView />
    </RoleGuard>
  );
}
