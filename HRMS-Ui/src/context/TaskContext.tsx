"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { TaskItem, TaskPriority, TaskCategory } from "@/types/task.types";
import { taskService } from "@/services/task.service";

export const INITIAL_TASKS: TaskItem[] = [
  // Overdue (2 tasks)
  {
    id: "t-1",
    title: "Update leave request design specs",
    category: "overdue",
    dueDateLabel: "Overdue · 20 Oct",
    priority: "Normal",
    isCompleted: false,
  },
  {
    id: "t-2",
    title: "Review payroll handoff comments",
    category: "overdue",
    dueDateLabel: "Overdue · 21 Oct",
    priority: "High",
    isCompleted: false,
  },
  // Today (4 tasks)
  {
    id: "t-3",
    title: "Review HRMS dashboard handoff",
    category: "today",
    dueDateLabel: "Today",
    priority: "High",
    isCompleted: false,
  },
  {
    id: "t-4",
    title: "Submit weekly timesheet",
    category: "today",
    dueDateLabel: "Today",
    priority: "Normal",
    isCompleted: false,
  },
  {
    id: "t-5",
    title: "Complete data privacy training",
    category: "today",
    dueDateLabel: "Today",
    priority: "Normal",
    isCompleted: false,
  },
  {
    id: "t-6",
    title: "Share attendance flow feedback",
    category: "today",
    dueDateLabel: "Today",
    priority: "Normal",
    isCompleted: false,
  },
  // Upcoming (6 tasks)
  {
    id: "t-7",
    title: "Prepare onboarding usability script",
    category: "upcoming",
    dueDateLabel: "23 Oct",
    priority: "Normal",
    isCompleted: false,
  },
  {
    id: "t-8",
    title: "Update employee profile components",
    category: "upcoming",
    dueDateLabel: "26 Oct",
    priority: "Normal",
    isCompleted: false,
  },
  {
    id: "t-9",
    title: "Check payslip accessibility fixes",
    category: "upcoming",
    dueDateLabel: "27 Oct",
    priority: "Normal",
    isCompleted: false,
  },
  {
    id: "t-10",
    title: "Document leave balance edge cases",
    category: "upcoming",
    dueDateLabel: "28 Oct",
    priority: "Normal",
    isCompleted: false,
  },
  {
    id: "t-11",
    title: "Review mobile attendance prototype",
    category: "upcoming",
    dueDateLabel: "29 Oct",
    priority: "Normal",
    isCompleted: false,
  },
  {
    id: "t-12",
    title: "Publish design system release notes",
    category: "upcoming",
    dueDateLabel: "30 Oct",
    priority: "Normal",
    isCompleted: false,
  },
];

interface TaskContextType {
  tasks: TaskItem[];
  activeCount: number;
  completedCount: number;
  isLoading: boolean;
  toggleTask: (id: string) => void;
  addTask: (title: string, priority: TaskPriority, category: TaskCategory) => void;
  deleteTask: (id: string) => void;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: INITIAL_TASKS,
  activeCount: 12,
  completedCount: 0,
  isLoading: false,
  toggleTask: () => {},
  addTask: () => {},
  deleteTask: () => {},
  refreshTasks: async () => {},
});

const STORAGE_KEY = "hrms_employee_tasks_v1";

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live tasks from MongoDB backend
  const loadTasksFromBackend = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await taskService.getTasks();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: TaskItem[] = res.data.map((t: any) => ({
          ...t,
          id: t._id || t.id,
        }));
        setTasks(mapped);
        return;
      }
    } catch {
      // Fallback to localStorage if server offline
    } finally {
      setIsLoading(false);
      setIsHydrated(true);
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    loadTasksFromBackend();
  }, [loadTasksFromBackend]);

  // Persist locally for instant offline cache
  useEffect(() => {
    if (isHydrated && tasks.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch {
        // Ignore
      }
    }
  }, [tasks, isHydrated]);

  // Toggle completion with real-time optimistic update and backend sync
  const toggleTask = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id || t._id === id) {
          const nextCompleted = !t.isCompleted;
          return {
            ...t,
            isCompleted: nextCompleted,
            completedAt: nextCompleted
              ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : undefined,
          };
        }
        return t;
      })
    );

    try {
      await taskService.toggleTask(id);
    } catch (err) {
      console.warn("Could not sync task toggle to backend:", err);
    }
  };

  // Add task with optimistic insertion and backend persistence
  const addTask = async (title: string, priority: TaskPriority, category: TaskCategory) => {
    const tempId = `t-${Date.now()}`;
    const newTask: TaskItem = {
      id: tempId,
      title: title.trim(),
      category,
      dueDateLabel:
        category === "today"
          ? "Today"
          : category === "upcoming"
          ? "24 Oct"
          : "Overdue · 21 Oct",
      priority,
      isCompleted: false,
    };

    setTasks((prev) => [newTask, ...prev]);

    try {
      const res = await taskService.createTask({
        title: newTask.title,
        category: newTask.category,
        priority: newTask.priority,
        dueDateLabel: newTask.dueDateLabel,
      });

      if (res?.data) {
        const serverDoc: any = res.data;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === tempId ? { ...serverDoc, id: serverDoc._id || serverDoc.id } : t
          )
        );
      }
    } catch (err) {
      console.warn("Could not persist task to backend:", err);
    }
  };

  // Delete task with optimistic deletion
  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
    try {
      await taskService.deleteTask(id);
    } catch (err) {
      console.warn("Could not sync task deletion to backend:", err);
    }
  };

  const activeCount = tasks.filter((t) => !t.isCompleted).length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activeCount,
        completedCount,
        isLoading,
        toggleTask,
        addTask,
        deleteTask,
        refreshTasks: loadTasksFromBackend,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
